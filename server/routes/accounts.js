const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { scoreAccount } = require('../services/aiScoring');
const { detectAnomalies, penalizeScore } = require('../services/anomalyDetector');
const { generateMessages } = require('../services/messageGenerator');
const { getRecommendation } = require('../services/recommendationEngine');

// GET all accounts with filters + pagination
router.get('/', (req, res) => {
  let { status, riskLevel, state, search, sortBy = 'scoreDesc', page = 1, limit = 20 } = req.query;
  let accounts = [...store.accounts];
  if (status) accounts = accounts.filter(a => a.status === status);
  if (riskLevel) accounts = accounts.filter(a => a.riskLevel === riskLevel);
  if (state) accounts = accounts.filter(a => a.state === state);
  if (search) {
    const s = search.toLowerCase();
    accounts = accounts.filter(a =>
      a.name.toLowerCase().includes(s) ||
      a.id.toLowerCase().includes(s) ||
      (a.branch && a.branch.toLowerCase().includes(s))
    );
  }

  const riskRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const sorters = {
    scoreDesc: (a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1),
    balanceDesc: (a, b) => (b.balance || 0) - (a.balance || 0),
    dormancyDesc: (a, b) => (b.dormancyYears || 0) - (a.dormancyYears || 0),
    riskDesc: (a, b) => (riskRank[b.riskLevel] || 0) - (riskRank[a.riskLevel] || 0),
    nameAsc: (a, b) => a.name.localeCompare(b.name)
  };
  accounts.sort(sorters[sortBy] || sorters.scoreDesc);

  const total = accounts.length;
  const pageNum = parseInt(page), limitNum = parseInt(limit);
  const paginated = accounts.slice((pageNum - 1) * limitNum, pageNum * limitNum);
  res.json({ accounts: paginated, total, page: pageNum, limit: limitNum });
});

// IMPORTANT: /score/all must be registered BEFORE /:id to avoid route conflict
router.post('/score/all', async (req, res) => {
  let done = 0;
  for (const acc of store.accounts) {
    try {
      const { finalScore } = await scoreAccount(acc);
      const { flags, riskLevel } = detectAnomalies(acc);
      acc.aiScore = +penalizeScore(finalScore, riskLevel).toFixed(3);
      acc.riskLevel = riskLevel;
      acc.flags = flags;
      acc.messages = generateMessages(acc);
      acc.recommendation = getRecommendation(acc, acc.aiScore, riskLevel);
      done++;
    } catch (e) { /* skip on error */ }
  }
  res.json({ scored: done, total: store.accounts.length });
});

router.post('/', async (req, res) => {
  const b = req.body;
  const dormYears = parseFloat(b.dormancyYears) || 2;
  const acc = {
    id: `ACC${Date.now()}`, name: b.name || 'Unknown',
    age: parseInt(b.age) || 40, state: b.state || 'Maharashtra',
    branch: b.branch || 'Main Branch', regionType: b.regionType || 'URBAN',
    preferredLanguage: b.preferredLanguage || 'English',
    accountType: b.accountType || 'Savings',
    balance: parseFloat(b.balance) || 0, dormancyYears: dormYears,
    dormancyDays: Math.floor(dormYears * 365), lastYearTx: parseInt(b.lastYearTx) || 0,
    hasMobile: b.hasMobile !== false, hasEmail: b.hasEmail || false,
    engagementScore: parseFloat(b.engagementScore) || 0.3,
    aiScore: null, riskLevel: null, flags: [], reactivated: false,
    status: dormYears >= 2 ? 'DORMANT' : 'ACTIVE', deafRisk: dormYears >= 10,
    lastTransactionDate: new Date(Date.now() - dormYears * 365 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0]
  };
  store.accounts.push(acc);
  res.status(201).json(acc);
});

router.get('/:id', (req, res) => {
  const acc = store.accounts.find(a => a.id === req.params.id);
  if (!acc) return res.status(404).json({ error: 'Account not found' });
  res.json(acc);
});

router.post('/:id/score', async (req, res) => {
  const acc = store.accounts.find(a => a.id === req.params.id);
  if (!acc) return res.status(404).json({ error: 'Not found' });
  try {
    const { rfScore, nnScore, heuristic, finalScore } = await scoreAccount(acc);
    const { flags, riskLevel } = detectAnomalies(acc);
    acc.aiScore = +penalizeScore(finalScore, riskLevel).toFixed(3);
    acc.rfScore = +rfScore.toFixed(3);
    acc.nnScore = +nnScore.toFixed(3);
    acc.heuristic = +heuristic.toFixed(3);
    acc.riskLevel = riskLevel; acc.flags = flags;
    acc.messages = generateMessages(acc);
    acc.recommendation = getRecommendation(acc, acc.aiScore, riskLevel);
    res.json(acc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', (req, res) => {
  const idx = store.accounts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  store.accounts[idx] = { ...store.accounts[idx], ...req.body };
  res.json(store.accounts[idx]);
});

module.exports = router;
