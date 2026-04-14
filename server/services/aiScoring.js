'use strict';
const store = require('../data/store');
const { rf, extractFeatures, syntheticLabel } = require('./aiModel');

// Lazy-load TF.js so server starts even if it's not installed yet
let tf = null;
let nnModel = null;
let nnTrained = false;

function getTF() {
  if (!tf) {
    try { tf = require('@tensorflow/tfjs'); } catch (_) { tf = null; }
  }
  return tf;
}

async function buildNeuralNet() {
  const tfjs = getTF();
  if (!tfjs) throw new Error('TensorFlow.js not available');
  const model = tfjs.sequential();
  model.add(tfjs.layers.dense({ units: 16, activation: 'relu', inputShape: [8] }));
  model.add(tfjs.layers.dropout({ rate: 0.1 }));
  model.add(tfjs.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tfjs.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: tfjs.train.adam(0.01), loss: 'meanSquaredError' });
  return model;
}

async function trainNeuralNet(accounts) {
  const tfjs = getTF();
  if (!tfjs) throw new Error('TensorFlow.js not installed');
  if (!accounts || accounts.length < 5) throw new Error('Need at least 5 accounts to train');

  const features = accounts.map(a => extractFeatures(a));
  const rawLabels = features.map(f => syntheticLabel(f));
  const maxL = Math.max(...rawLabels), minL = Math.min(...rawLabels);
  const labels = rawLabels.map(l => (l - minL) / (maxL - minL + 1e-9));

  const xs = tfjs.tensor2d(features);
  const ys = tfjs.tensor2d(labels, [labels.length, 1]);

  nnModel = await buildNeuralNet();
  await nnModel.fit(xs, ys, { epochs: 30, batchSize: 16, shuffle: true, verbose: 0 });

  xs.dispose(); ys.dispose();
  nnTrained = true;
  store.modelMetrics.lastTrainedAt = new Date().toISOString();
  console.log('[ML]     Neural Network trained successfully');
}

function nnPredict(account) {
  if (!nnTrained || !nnModel || !getTF()) return null;
  try {
    const tfjs = getTF();
    const features = extractFeatures(account);
    const input = tfjs.tensor2d([features]);
    const pred = nnModel.predict(input);
    const value = pred.dataSync()[0];
    input.dispose(); pred.dispose();
    return isNaN(value) ? null : value;
  } catch (_) { return null; }
}

function domainHeuristic(account) {
  let score = 0.5;
  if (account.dormancyYears >= 10)       score -= 0.25;
  else if (account.dormancyYears >= 5)   score -= 0.15;
  else if (account.dormancyYears >= 2)   score -= 0.05;

  if (account.balance > 500000)          score += 0.15;
  else if (account.balance > 100000)     score += 0.08;
  else if (account.balance < 5000)       score -= 0.10;

  if (account.hasMobile)                 score += 0.08;
  if (account.hasEmail)                  score += 0.05;
  if (account.regionType === 'URBAN')    score += 0.04;
  if (account.accountType === 'Current') score += 0.03;
  if (account.accountType === 'Jan Dhan') score -= 0.05;

  return Math.max(0, Math.min(1, score));
}

async function scoreAccount(account) {
  const rfScore = rf.predict(account);
  const nnScore = nnPredict(account);
  const heuristic = domainHeuristic(account);

  let finalScore;
  if (nnScore !== null) {
    // Full hybrid: 60% RF + 20% NN + 20% heuristic
    finalScore = 0.6 * rfScore + 0.2 * nnScore + 0.2 * heuristic;
  } else {
    // Graceful fallback (no NN): 80% RF + 20% heuristic
    finalScore = 0.8 * rfScore + 0.2 * heuristic;
  }

  return {
    rfScore,
    nnScore: nnScore !== null ? nnScore : rfScore,
    heuristic,
    finalScore: Math.max(0, Math.min(1, finalScore))
  };
}

function explainPrediction(account) {
  const features = extractFeatures(account);
  const w = store.heuristicWeights;
  const featureNames = [
    'Dormancy Duration', 'Balance', 'Age', 'Contact Availability',
    'Transaction History', 'Language Engagement', 'Account Type', 'Branch Activity'
  ];
  const weights = [w.dormancyRatio, w.balance, w.age, w.contacts, w.transactions, w.languageEngagement, w.accountType, w.branchActivity];

  const contributions = featureNames.map((name, i) => ({
    feature: name,
    value: +features[i].toFixed(3),
    weight: weights[i],
    contribution: +(features[i] * weights[i]).toFixed(4),
    impact: features[i] > 0.6 ? 'positive' : features[i] < 0.3 ? 'negative' : 'neutral'
  }));
  contributions.sort((a, b) => b.contribution - a.contribution);

  const reasons = [];
  if (account.dormancyYears < 3)
    reasons.push('Recent dormancy period improves reactivation likelihood');
  else if (account.dormancyYears >= 8)
    reasons.push('Extended dormancy severely reduces response probability');
  if (account.balance > 200000)
    reasons.push('High balance creates strong financial incentive for reactivation');
  if (account.hasMobile && account.hasEmail)
    reasons.push('Full contact availability enables multi-channel outreach');
  else if (!account.hasMobile)
    reasons.push('Missing mobile contact limits outreach effectiveness');
  if (account.regionType === 'URBAN')
    reasons.push('Urban account holder typically more responsive to digital outreach');
  if (account.deafRisk)
    reasons.push('DEAF risk detected — score penalised, immediate action required');

  return { contributions, reasons, topFactors: contributions.slice(0, 3) };
}

module.exports = { scoreAccount, trainNeuralNet, explainPrediction, domainHeuristic, isNNTrained: () => nnTrained };
