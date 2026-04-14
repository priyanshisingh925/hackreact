const store = require('../data/store');
const { trainNeuralNet } = require('./aiScoring');

function recordFeedback(accountId, responded, channel, tone, language) {
  const fb = { accountId, responded, channel, tone, language, recordedAt: new Date().toISOString() };
  store.feedback.push(fb);

  // Update tone stats
  if (store.toneStats[tone]) {
    if (responded) store.toneStats[tone].responded++;
  }

  // Update language stats
  if (store.languageStats[language]) {
    if (responded) store.languageStats[language].responded++;
  }

  // Update account
  const acc = store.accounts.find(a => a.id === accountId);
  if (acc && responded) {
    acc.reactivated = true;
    acc.status = 'ACTIVE';
    store.reactivationLog.push({
      date: new Date().toISOString().split('T')[0],
      reactivated: 1,
      outreach: 1
    });
  }

  // Retrain NN after every 10 feedback items
  if (store.feedback.length % 10 === 0) {
    trainNeuralNet(store.accounts).catch(e => console.error('[FEEDBACK] NN retrain error:', e));
  }

  return fb;
}

function getFeedbackSummary() {
  const total = store.feedback.length;
  const responded = store.feedback.filter(f => f.responded).length;
  return {
    total,
    responded,
    responseRate: total ? ((responded / total) * 100).toFixed(1) : 0,
    byTone: store.toneStats,
    byLanguage: store.languageStats
  };
}

module.exports = { recordFeedback, getFeedbackSummary };
