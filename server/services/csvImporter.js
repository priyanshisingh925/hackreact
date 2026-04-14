const { parse } = require('csv-parse/sync');
const store = require('../data/store');
const { scoreAccount } = require('./aiScoring');
const { detectAnomalies, penalizeScore } = require('./anomalyDetector');
const { generateMessages } = require('./messageGenerator');
const { getRecommendation } = require('./recommendationEngine');

const COLUMN_MAP = {
  id: ['id', 'account_id', 'accountid', 'acc_id'],
  name: ['name', 'customer_name', 'customername', 'full_name'],
  age: ['age', 'customer_age'],
  state: ['state', 'region', 'location'],
  branch: ['branch', 'branch_name'],
  accountType: ['account_type', 'accounttype', 'type'],
  balance: ['balance', 'amount', 'account_balance'],
  dormancyYears: ['dormancy_years', 'dormancyyears', 'inactive_years', 'years_dormant'],
  hasMobile: ['has_mobile', 'mobile', 'mobile_available'],
  hasEmail: ['has_email', 'email_available'],
  regionType: ['region_type', 'regiontype', 'area_type'],
  preferredLanguage: ['preferred_language', 'language']
};

function detectColumn(headers, candidates) {
  const h = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = h.indexOf(c.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function normalizeRow(row, mapping) {
  const get = (field) => {
    const col = mapping[field];
    return col ? row[col] : undefined;
  };

  const id = get('id') || `IMP${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const name = get('name') || 'Unknown Customer';
  const age = parseInt(get('age')) || 40;
  const balance = parseFloat((get('balance') || '0').toString().replace(/[₹,]/g, '')) || 0;
  const dormancyYears = parseFloat(get('dormancyYears')) || 2;
  const regionType = (get('regionType') || 'URBAN').toUpperCase() === 'RURAL' ? 'RURAL' : 'URBAN';
  const hasMobile = ['true', '1', 'yes', 'y'].includes((get('hasMobile') || 'true').toString().toLowerCase());
  const hasEmail = ['true', '1', 'yes', 'y'].includes((get('hasEmail') || 'false').toString().toLowerCase());
  const accountType = get('accountType') || 'Savings';
  const state = get('state') || 'Maharashtra';
  const branch = get('branch') || `${state} - Main Branch`;
  const preferredLanguage = get('preferredLanguage') || (regionType === 'RURAL' ? 'Hindi' : 'English');

  return {
    id, name, age, state, branch, regionType, preferredLanguage,
    accountType, balance, dormancyYears,
    dormancyDays: Math.floor(dormancyYears * 365),
    lastYearTx: Math.floor(Math.random() * 20),
    hasMobile, hasEmail,
    engagementScore: +(Math.random() * 0.8).toFixed(2),
    status: dormancyYears >= 2 ? 'DORMANT' : 'ACTIVE',
    deafRisk: dormancyYears >= 10,
    aiScore: null, riskLevel: null, flags: [],
    reactivated: false,
    lastTransactionDate: new Date(Date.now() - dormancyYears * 365 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
    imported: true
  };
}

async function importCSV(buffer) {
  const records = parse(buffer, { columns: true, skip_empty_lines: true, trim: true });

  if (!records.length) throw new Error('No records found in CSV');
  if (records.length > 10000) throw new Error('Maximum 10,000 rows supported');

  const headers = Object.keys(records[0]);
  const mapping = {};
  for (const [field, candidates] of Object.entries(COLUMN_MAP)) {
    const col = detectColumn(headers, candidates);
    if (col) mapping[field] = col;
  }

  const preview = records.slice(0, 5).map(r => normalizeRow(r, mapping));
  const all = records.map(r => normalizeRow(r, mapping));

  // Score each account
  const scored = [];
  for (const acc of all) {
    try {
      const { finalScore } = await scoreAccount(acc);
      const { flags, riskLevel } = detectAnomalies(acc);
      const penalized = penalizeScore(finalScore, riskLevel);
      acc.aiScore = +penalized.toFixed(3);
      acc.riskLevel = riskLevel;
      acc.flags = flags;
      acc.messages = generateMessages(acc);
      scored.push(acc);
    } catch (e) {
      scored.push(acc);
    }
  }

  // Merge into store (replace duplicates by id)
  const existingIds = new Set(store.accounts.map(a => a.id));
  let added = 0, updated = 0;
  scored.forEach(acc => {
    if (existingIds.has(acc.id)) {
      const idx = store.accounts.findIndex(a => a.id === acc.id);
      store.accounts[idx] = acc;
      updated++;
    } else {
      store.accounts.push(acc);
      added++;
    }
  });

  const dist = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  scored.forEach(a => { if (a.riskLevel) dist[a.riskLevel]++; });

  return { total: scored.length, added, updated, preview, riskDistribution: dist, detectedColumns: mapping };
}

module.exports = { importCSV };
