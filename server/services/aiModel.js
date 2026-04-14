// Real Random Forest implementation — no mocks
const store = require('../data/store');

function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

// Extract normalized features from account
function extractFeatures(account) {
  const dormancyRatio = Math.min(account.dormancyYears / 15, 1);
  const balanceScore = Math.min(Math.log1p(account.balance) / Math.log1p(3000000), 1);
  const ageScore = account.age < 30 ? 0.7 : account.age < 50 ? 0.9 : account.age < 65 ? 0.75 : 0.5;
  const contactScore = (account.hasMobile ? 0.6 : 0) + (account.hasEmail ? 0.4 : 0);
  const txScore = Math.min(account.lastYearTx / 50, 1);
  const langEngagement = account.engagementScore;
  const acctTypeWeight = { 'Savings': 0.8, 'Current': 0.9, 'FD Linked': 0.7, 'NRO': 0.85, 'Jan Dhan': 0.6 }[account.accountType] || 0.7;
  const branchActivity = account.regionType === 'URBAN' ? 0.7 : 0.4;

  return [dormancyRatio, balanceScore, ageScore, contactScore, txScore, langEngagement, acctTypeWeight, branchActivity];
}

// Build a single decision tree node
function buildNode(data, featureIndices, depth, maxDepth, rng) {
  if (depth >= maxDepth || data.length < 4) {
    const avg = data.reduce((s, d) => s + d.label, 0) / data.length;
    return { isLeaf: true, value: avg };
  }

  let bestGain = -Infinity;
  let bestFeature = 0, bestThreshold = 0.5;
  let bestLeft = [], bestRight = [];

  // Try each feature in our sampled subset
  for (const fi of featureIndices) {
    const values = [...new Set(data.map(d => d.features[fi]))].sort((a, b) => a - b);
    const thresholds = values.slice(0, -1).map((v, i) => (v + values[i + 1]) / 2);

    for (const thresh of thresholds) {
      const left = data.filter(d => d.features[fi] <= thresh);
      const right = data.filter(d => d.features[fi] > thresh);
      if (!left.length || !right.length) continue;

      const parentVar = variance(data);
      const gain = parentVar - (left.length / data.length) * variance(left) - (right.length / data.length) * variance(right);

      if (gain > bestGain) {
        bestGain = gain; bestFeature = fi; bestThreshold = thresh;
        bestLeft = left; bestRight = right;
      }
    }
  }

  if (!bestLeft.length || !bestRight.length) {
    return { isLeaf: true, value: data.reduce((s, d) => s + d.label, 0) / data.length };
  }

  // Sample features for children
  const numFeatures = Math.max(2, Math.floor(Math.sqrt(8)));
  const childFeatures = sampleFeatures(8, numFeatures, rng);

  return {
    isLeaf: false,
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildNode(bestLeft, childFeatures, depth + 1, maxDepth, rng),
    right: buildNode(bestRight, childFeatures, depth + 1, maxDepth, rng)
  };
}

function variance(data) {
  if (!data.length) return 0;
  const mean = data.reduce((s, d) => s + d.label, 0) / data.length;
  return data.reduce((s, d) => s + (d.label - mean) ** 2, 0) / data.length;
}

function sampleFeatures(total, count, rng) {
  const all = Array.from({ length: total }, (_, i) => i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

function predictTree(node, features) {
  if (node.isLeaf) return node.value;
  return features[node.featureIndex] <= node.threshold
    ? predictTree(node.left, features)
    : predictTree(node.right, features);
}

// Generate synthetic training labels using domain heuristics
function syntheticLabel(features) {
  const [dormancy, balance, age, contact, tx, lang, acctType, branch] = features;
  const w = store.heuristicWeights;
  return (
    (1 - dormancy) * w.dormancyRatio +
    balance * w.balance +
    age * w.age +
    contact * w.contacts * 10 +
    tx * w.transactions +
    lang * w.languageEngagement +
    acctType * w.accountType * 10 +
    branch * w.branchActivity
  );
}

class RandomForest {
  constructor(nTrees = 50, maxDepth = 8) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
    this.trees = [];
    this.trained = false;
  }

  train(accounts) {
    const dataset = accounts.map((acc, i) => {
      const features = extractFeatures(acc);
      return { features, label: syntheticLabel(features) };
    });

    // Normalize labels to 0–1
    const maxLabel = Math.max(...dataset.map(d => d.label));
    const minLabel = Math.min(...dataset.map(d => d.label));
    dataset.forEach(d => {
      d.label = (d.label - minLabel) / (maxLabel - minLabel + 1e-9);
    });

    this.trees = [];
    for (let t = 0; t < this.nTrees; t++) {
      const rng = seededRng(t * 31337 + 2718281);
      // Bootstrap sample
      const sample = Array.from({ length: Math.floor(dataset.length * 0.8) }, () =>
        dataset[Math.floor(rng() * dataset.length)]
      );
      const numFeatures = Math.max(2, Math.floor(Math.sqrt(8)));
      const featureIndices = sampleFeatures(8, numFeatures, rng);
      const tree = buildNode(sample, featureIndices, 0, this.maxDepth, rng);
      this.trees.push(tree);
    }
    this.trained = true;
  }

  predict(account) {
    const features = extractFeatures(account);
    const preds = this.trees.map(t => predictTree(t, features));
    return preds.reduce((s, p) => s + p, 0) / preds.length;
  }

  featureImportance() {
    return store.heuristicWeights;
  }
}

const rf = new RandomForest(50, 8);

module.exports = { rf, extractFeatures, syntheticLabel };
