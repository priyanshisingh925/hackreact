'use strict';
const express = require('express');
const cors = require('cors');
const { init } = require('./data/generator');
const { rf } = require('./services/aiModel');
const store = require('./data/store');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow all origins for Render cross-service deployment.
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/import', require('./routes/import'));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    ts: Date.now(),
    accounts: store.accounts.length,
    nnReady: Boolean(store.modelMetrics.nnReady)
  });
});

// Global error handler prevents server crash on unhandled route errors.
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message });
});

function startServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Backend running on port ${PORT}`);
    console.log(`[SERVER] API: http://localhost:${PORT}/api/health`);
  });
}

function trainRandomForest() {
  console.log('[ML]     Training Random Forest (50 trees, depth 8)...');
  const t0 = Date.now();
  rf.train(store.accounts);
  console.log(`[ML]     Random Forest ready in ${Date.now() - t0}ms`);
}

async function trainNeuralNetwork() {
  const { trainNeuralNet } = require('./services/aiScoring');
  console.log('[ML]     Training Neural Network (TensorFlow.js)...');
  await trainNeuralNet(store.accounts);
  store.modelMetrics.nnReady = true;
  store.modelMetrics.lastTrainedAt = new Date().toISOString();
  console.log('[ML]     Neural Network ready');
}

async function preScoreAccounts(label = 'Pre-scoring accounts') {
  const { scoreAccount } = require('./services/aiScoring');
  const { detectAnomalies, penalizeScore } = require('./services/anomalyDetector');
  const { generateMessages } = require('./services/messageGenerator');
  const { getRecommendation } = require('./services/recommendationEngine');

  console.log(`[ML]     ${label}...`);
  let scored = 0;
  for (const acc of store.accounts) {
    try {
      const { rfScore, nnScore, heuristic, finalScore } = await scoreAccount(acc);
      const { flags, riskLevel } = detectAnomalies(acc);
      const penalized = penalizeScore(finalScore, riskLevel);
      acc.aiScore = +penalized.toFixed(3);
      acc.rfScore = +rfScore.toFixed(3);
      acc.nnScore = +(nnScore || rfScore).toFixed(3);
      acc.heuristic = +heuristic.toFixed(3);
      acc.riskLevel = riskLevel;
      acc.flags = flags;
      acc.messages = generateMessages(acc);
      acc.recommendation = getRecommendation(acc, acc.aiScore, riskLevel);
      scored++;
    } catch (e) {
      console.warn(`[ML]     Score failed for ${acc.id}: ${e.message}`);
    }
  }
  store.modelMetrics.lastTrainedAt = new Date().toISOString();
  console.log(`[ML]     Pre-scored ${scored}/${store.accounts.length} accounts`);
}

async function bootstrap() {
  console.log('[SERVER] Initializing account data...');
  init();
  console.log(`[DATA]   ${store.accounts.length} accounts loaded`);

  trainRandomForest();
  store.modelMetrics.nnReady = false;
  await preScoreAccounts('Pre-scoring accounts with RF fallback');

  startServer();

  trainNeuralNetwork()
    .then(() => preScoreAccounts('Refreshing account scores with neural net'))
    .catch(e => {
      console.warn('[ML]     Neural Network unavailable - hybrid scoring will use RF x 0.8 + heuristic x 0.2');
      console.warn('[ML]    ', e.message);
    });
}

bootstrap().catch(e => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
