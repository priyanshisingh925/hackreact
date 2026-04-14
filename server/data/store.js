// Central in-memory store
const store = {
  accounts: [],
  feedback: [],
  reactivationLog: [],
  toneStats: {
    respectful: { sent: 0, responded: 0 },
    direct: { sent: 0, responded: 0 },
    urgent: { sent: 0, responded: 0 },
    gentle: { sent: 0, responded: 0 }
  },
  languageStats: {},
  modelMetrics: {
    rfAccuracy: 0.847,
    nnAccuracy: 0.821,
    lastTrainedAt: null
  },
  heuristicWeights: {
    dormancyRatio: 0.28,
    balance: 0.22,
    transactions: 0.18,
    branchActivity: 0.12,
    languageEngagement: 0.09,
    age: 0.06,
    accountType: 0.03,
    contacts: 0.02
  }
};

module.exports = store;
