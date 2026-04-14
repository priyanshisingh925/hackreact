const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { explainPrediction } = require('../services/aiScoring');
const { computeMetrics, getReactivationTrend, getRegionBreakdown, getRiskDistribution } = require('../services/businessMetrics');

router.get('/feature-importance', (req, res) => {
  res.json({
    weights: store.heuristicWeights,
    modelMetrics: store.modelMetrics,
    features: [
      { name: 'Dormancy Duration', key: 'dormancyRatio', weight: store.heuristicWeights.dormancyRatio, description: 'Years of account inactivity — primary dormancy signal' },
      { name: 'Balance', key: 'balance', weight: store.heuristicWeights.balance, description: 'Account balance — higher balance = stronger recovery incentive' },
      { name: 'Transaction History', key: 'transactions', weight: store.heuristicWeights.transactions, description: 'Historical transaction frequency before dormancy' },
      { name: 'Branch Activity', key: 'branchActivity', weight: store.heuristicWeights.branchActivity, description: 'Urban vs rural branch engagement patterns' },
      { name: 'Language Engagement', key: 'languageEngagement', weight: store.heuristicWeights.languageEngagement, description: 'Past engagement based on communication language' },
      { name: 'Age Score', key: 'age', weight: store.heuristicWeights.age, description: 'Demographic age group response probability' },
      { name: 'Account Type', key: 'accountType', weight: store.heuristicWeights.accountType, description: 'Account category influences reactivation likelihood' },
      { name: 'Contact Score', key: 'contacts', weight: store.heuristicWeights.contacts, description: 'Mobile and email availability for outreach' }
    ]
  });
});

router.post('/explain/:id', (req, res) => {
  const acc = store.accounts.find(a => a.id === req.params.id);
  if (!acc) return res.status(404).json({ error: 'Account not found' });
  const explanation = explainPrediction(acc);
  res.json(explanation);
});

router.get('/metrics', (req, res) => {
  res.json(computeMetrics());
});

router.get('/trend', (req, res) => {
  res.json(getReactivationTrend());
});

router.get('/region-breakdown', (req, res) => {
  res.json(getRegionBreakdown());
});

router.get('/risk-distribution', (req, res) => {
  res.json(getRiskDistribution());
});

router.get('/tone-stats', (req, res) => {
  res.json(store.toneStats);
});

router.get('/language-stats', (req, res) => {
  res.json(store.languageStats);
});

module.exports = router;
