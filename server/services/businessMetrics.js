const store = require('../data/store');

function computeMetrics() {
  const accounts = store.accounts;
  const dormant = accounts.filter(a => a.status === 'DORMANT');
  const reactivated = accounts.filter(a => a.reactivated);
  const deafRisk = accounts.filter(a => a.deafRisk);

  const totalBalance = dormant.reduce((s, a) => s + a.balance, 0);
  const deafBalance = deafRisk.reduce((s, a) => s + a.balance, 0);
  const reactivatedBalance = reactivated.reduce((s, a) => s + a.balance, 0);

  const reactivationRate = dormant.length > 0 ? ((reactivated.length / dormant.length) * 100).toFixed(2) : 0;

  const scoredAccounts = accounts.filter(a => a.aiScore !== null);
  const avgScore = scoredAccounts.length
    ? (scoredAccounts.reduce((s, a) => s + a.aiScore, 0) / scoredAccounts.length).toFixed(3)
    : 0;

  const highPriority = scoredAccounts.filter(a => a.aiScore >= 0.7).length;
  const mediumPriority = scoredAccounts.filter(a => a.aiScore >= 0.45 && a.aiScore < 0.7).length;
  const lowPriority = scoredAccounts.filter(a => a.aiScore < 0.45).length;

  // Industry baseline response rate: 4%
  const baselineRate = 0.04;
  const ourRate = dormant.length > 0 ? reactivated.length / dormant.length : 0;
  const uplift = ourRate > 0 ? (ourRate / baselineRate).toFixed(1) : 'N/A';

  // Cost efficiency
  const totalOutreach = store.feedback.length;
  const costPerContact = 45; // avg ₹45 per contact
  const totalCost = totalOutreach * costPerContact;
  const costPerReactivation = reactivated.length > 0 ? (totalCost / reactivated.length).toFixed(0) : 0;

  return {
    totalAccounts: accounts.length,
    dormantAccounts: dormant.length,
    dormantPct: ((dormant.length / accounts.length) * 100).toFixed(1),
    reactivated: reactivated.length,
    reactivationRate,
    deafRiskAccounts: deafRisk.length,
    totalDormantBalance: totalBalance,
    deafBalance,
    reactivatedBalance,
    avgAiScore: avgScore,
    highPriority,
    mediumPriority,
    lowPriority,
    baselineResponseRate: (baselineRate * 100).toFixed(1),
    ourResponseRate: (ourRate * 100).toFixed(2),
    reactivationUplift: uplift,
    totalCost,
    costPerReactivation,
    // Real Indian banking stats shown in UI
    industryContext: {
      deafFundTotal: 3501200000000, // ₹35,012 crore
      totalDormantIndia: 85000000,  // 8.5 crore
      industryResponseRate: 4.0
    }
  };
}

function getReactivationTrend() {
  return store.reactivationLog.slice(-30);
}

function getRegionBreakdown() {
  const breakdown = {};
  store.accounts.filter(a => a.status === 'DORMANT').forEach(a => {
    if (!breakdown[a.state]) breakdown[a.state] = { dormant: 0, balance: 0, reactivated: 0 };
    breakdown[a.state].dormant++;
    breakdown[a.state].balance += a.balance;
    if (a.reactivated) breakdown[a.state].reactivated++;
  });
  return breakdown;
}

function getRiskDistribution() {
  const dist = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  store.accounts.forEach(a => { if (a.riskLevel) dist[a.riskLevel]++; });
  return dist;
}

module.exports = { computeMetrics, getReactivationTrend, getRegionBreakdown, getRiskDistribution };
