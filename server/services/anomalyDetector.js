const store = require('../data/store');

function detectAnomalies(account) {
  const flags = [];
  let riskLevel = 'LOW';

  // Balance spike vs account type norms
  const typeNorms = { 'Savings': 150000, 'Current': 500000, 'FD Linked': 300000, 'NRO': 800000, 'Jan Dhan': 20000 };
  const norm = typeNorms[account.accountType] || 150000;
  if (account.balance > norm * 2.5) {
    flags.push({ type: 'BALANCE_SPIKE', detail: `Balance ₹${account.balance.toLocaleString('en-IN')} is ${(account.balance / norm).toFixed(1)}x above ${account.accountType} average` });
    riskLevel = 'MEDIUM';
  }

  // DEAF risk
  if (account.dormancyYears >= 10) {
    flags.push({ type: 'DEAF_ELIGIBLE', detail: `Account dormant for ${account.dormancyYears} years — eligible for DEAF transfer` });
    riskLevel = 'HIGH';
  } else if (account.dormancyYears >= 8) {
    flags.push({ type: 'DEAF_APPROACHING', detail: `Account approaching DEAF transfer threshold (${account.dormancyYears}/10 years)` });
    if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
  }

  // No contact info + high balance
  if (!account.hasMobile && !account.hasEmail && account.balance > 50000) {
    flags.push({ type: 'UNREACHABLE_HIGH_VALUE', detail: 'High-value account with no contact information — field visit required' });
    if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
  }

  // Very low engagement + long dormancy
  if (account.engagementScore < 0.2 && account.dormancyYears > 4) {
    flags.push({ type: 'LOW_ENGAGEMENT', detail: 'Extremely low engagement score suggests difficult reactivation' });
  }

  // Rural + no mobile is a red flag
  if (account.regionType === 'RURAL' && !account.hasMobile) {
    flags.push({ type: 'RURAL_UNREACHABLE', detail: 'Rural account with no mobile — recommend branch or agent visit' });
  }

  // NRO with long dormancy
  if (account.accountType === 'NRO' && account.dormancyYears > 3) {
    flags.push({ type: 'NRO_DORMANT', detail: 'NRO account dormancy may indicate account holder moved abroad permanently' });
    if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
  }

  return { flags, riskLevel };
}

function penalizeScore(score, riskLevel) {
  if (riskLevel === 'HIGH') return score * 0.6;
  if (riskLevel === 'MEDIUM') return score * 0.82;
  return score;
}

module.exports = { detectAnomalies, penalizeScore };
