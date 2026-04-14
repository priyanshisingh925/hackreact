const express = require('express');
const router = express.Router();
const { recordFeedback, getFeedbackSummary } = require('../services/feedbackEngine');

router.post('/', (req, res) => {
  const { accountId, responded, channel, tone, language } = req.body;
  if (!accountId) return res.status(400).json({ error: 'accountId required' });
  const fb = recordFeedback(accountId, responded, channel || 'SMS', tone || 'direct', language || 'English');
  res.json(fb);
});

router.get('/summary', (req, res) => {
  res.json(getFeedbackSummary());
});

module.exports = router;
