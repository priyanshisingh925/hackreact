function getRecommendation(account, aiScore, riskLevel) {
  const score = aiScore;
  const rec = {
    priority: '',
    channel: [],
    timing: '',
    strategy: '',
    estimatedCost: 0,
    estimatedRecoveryProb: 0,
    agentRequired: false
  };

  if (score >= 0.7) {
    rec.priority = 'HIGH';
    rec.channel = ['SMS', 'Email', 'IVR'];
    rec.timing = 'Within 48 hours';
    rec.strategy = 'Multi-channel aggressive outreach. High probability account — prioritize for immediate campaign.';
    rec.estimatedCost = 45;
    rec.estimatedRecoveryProb = Math.min(0.72 + score * 0.2, 0.92);
  } else if (score >= 0.45) {
    rec.priority = 'MEDIUM';
    rec.channel = account.hasMobile ? ['SMS', 'IVR'] : ['Email'];
    rec.timing = 'Within 1 week';
    rec.strategy = 'Standard reactivation outreach. Monitor response and escalate if no reply in 5 days.';
    rec.estimatedCost = 28;
    rec.estimatedRecoveryProb = 0.3 + score * 0.4;
  } else {
    rec.priority = 'LOW';
    rec.channel = account.hasMobile ? ['SMS'] : [];
    rec.timing = 'Next scheduled batch (30 days)';
    rec.strategy = 'Low-effort outreach or field agent visit recommended. Consider cost-benefit analysis.';
    rec.estimatedCost = 120;
    rec.estimatedRecoveryProb = 0.05 + score * 0.2;
    rec.agentRequired = !account.hasMobile && !account.hasEmail;
  }

  if (riskLevel === 'HIGH') {
    rec.priority = 'CRITICAL';
    rec.timing = 'Immediate — same day';
    rec.strategy = 'DEAF risk detected. Escalate to compliance team. Initiate emergency reactivation protocol.';
    rec.agentRequired = true;
    rec.estimatedCost += 200;
  }

  if (!account.hasMobile && !account.hasEmail) {
    rec.agentRequired = true;
    rec.channel = ['Field Visit'];
    rec.estimatedCost += 350;
  }

  return rec;
}

function getBulkRecommendations(accounts) {
  const summary = { critical: 0, high: 0, medium: 0, low: 0, agentRequired: 0, totalCost: 0 };
  accounts.forEach(acc => {
    const score = acc.aiScore || 0;
    const risk = acc.riskLevel || 'LOW';
    const rec = getRecommendation(acc, score, risk);
    const p = rec.priority.toLowerCase();
    if (summary[p] !== undefined) summary[p]++;
    if (rec.agentRequired) summary.agentRequired++;
    summary.totalCost += rec.estimatedCost;
  });
  return summary;
}

module.exports = { getRecommendation, getBulkRecommendations };
