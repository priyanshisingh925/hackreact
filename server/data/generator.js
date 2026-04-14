const store = require('./store');

const firstNames = ['Rajesh','Priya','Suresh','Anita','Vikram','Sunita','Arun','Deepa','Manoj','Kavitha',
  'Sanjay','Meena','Ravi','Lakshmi','Ajay','Geeta','Rohit','Usha','Kiran','Saritha',
  'Amit','Pooja','Dinesh','Radha','Vinod','Nirmala','Harish','Savitha','Naveen','Jyothi',
  'Sunil','Rekha','Ramesh','Vimala','Prasad','Leela','Gopal','Sudha','Mohan','Pushpa'];

const lastNames = ['Sharma','Patel','Reddy','Nair','Kumar','Rao','Singh','Iyer','Joshi','Pillai',
  'Gupta','Verma','Desai','Menon','Agarwal','Bhat','Choudhary','Hegde','Shetty','Naidu'];

const branches = {
  'Maharashtra': ['Mumbai - Andheri', 'Pune - Shivajinagar', 'Nagpur - Sitabuldi', 'Mumbai - Dadar'],
  'Karnataka': ['Bengaluru - Indiranagar', 'Mysuru - Saraswathipuram', 'Hubballi - Deshpande Nagar'],
  'Tamil Nadu': ['Chennai - T. Nagar', 'Coimbatore - RS Puram', 'Madurai - Anna Nagar'],
  'Telangana': ['Hyderabad - Banjara Hills', 'Warangal - Hanamkonda', 'Karimnagar - Main Road'],
  'West Bengal': ['Kolkata - Park Street', 'Siliguri - Sevoke Road', 'Asansol - GT Road'],
  'Gujarat': ['Ahmedabad - CG Road', 'Surat - Ring Road', 'Vadodara - Alkapuri'],
  'Uttar Pradesh': ['Lucknow - Hazratganj', 'Varanasi - Sigra', 'Kanpur - Civil Lines'],
  'Rajasthan': ['Jaipur - MI Road', 'Jodhpur - Sardarpura', 'Udaipur - Fatehpura']
};

const regionLanguageMap = {
  'Maharashtra': { urban: 'English', rural: 'Marathi' },
  'Karnataka': { urban: 'English', rural: 'Kannada' },
  'Tamil Nadu': { urban: 'English', rural: 'Tamil' },
  'Telangana': { urban: 'English', rural: 'Telugu' },
  'West Bengal': { urban: 'English', rural: 'Bengali' },
  'Gujarat': { urban: 'English', rural: 'Gujarati' },
  'Uttar Pradesh': { urban: 'Hindi', rural: 'Hindi' },
  'Rajasthan': { urban: 'Hindi', rural: 'Hindi' }
};

const accountTypes = ['Savings', 'Current', 'FD Linked', 'NRO', 'Jan Dhan'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickRandom(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function formatIndianNumber(n) {
  return n.toLocaleString('en-IN');
}

function generateAccounts(count = 240) {
  const accounts = [];
  const states = Object.keys(branches);

  for (let i = 0; i < count; i++) {
    const rng = seededRandom(i * 7919 + 314159);
    const state = pickRandom(states, rng);
    const branchList = branches[state];
    const branch = pickRandom(branchList, rng);
    const regionType = rng() > 0.45 ? 'URBAN' : 'RURAL';
    const langMap = regionLanguageMap[state];
    const preferredLanguage = langMap ? (regionType === 'URBAN' ? langMap.urban : langMap.rural) : 'Hindi';

    const age = Math.floor(20 + rng() * 65);
    const accountType = pickRandom(accountTypes, rng);

    // Dormancy: 1–15 years (weighted toward 2–8)
    const dormancyYears = +(1 + rng() * 2 + rng() * 8 + rng() * 4).toFixed(1);
    const dormancyDays = Math.floor(dormancyYears * 365);

    // Balance: realistic distribution
    let balance;
    const balanceTier = rng();
    if (balanceTier < 0.25) balance = Math.floor(500 + rng() * 9500);
    else if (balanceTier < 0.55) balance = Math.floor(10000 + rng() * 90000);
    else if (balanceTier < 0.82) balance = Math.floor(100000 + rng() * 400000);
    else balance = Math.floor(500000 + rng() * 2500000);

    // Previous transactions in last active year
    const lastYearTx = Math.floor(rng() * 48);

    // Contact info availability
    const hasMobile = rng() > 0.15;
    const hasEmail = rng() > 0.38;

    // Engagement score (0–1)
    const engagementScore = +(rng() * 0.6 + (hasMobile ? 0.2 : 0) + (hasEmail ? 0.2 : 0)).toFixed(2);

    // DEAF risk: dormancy >= 10 years
    const deafRisk = dormancyYears >= 10;
    const dormantStatus = dormancyYears >= 2 ? 'DORMANT' : 'ACTIVE';

    const firstName = pickRandom(firstNames, rng);
    const lastName = pickRandom(lastNames, rng);

    accounts.push({
      id: `ACC${String(1000 + i).padStart(6, '0')}`,
      name: `${firstName} ${lastName}`,
      age,
      state,
      branch,
      regionType,
      preferredLanguage,
      accountType,
      balance,
      dormancyDays,
      dormancyYears: +dormancyYears.toFixed(1),
      lastTransactionDate: new Date(Date.now() - dormancyDays * 86400000).toISOString().split('T')[0],
      lastYearTx,
      hasMobile,
      hasEmail,
      engagementScore,
      status: dormantStatus,
      deafRisk,
      aiScore: null,
      riskLevel: null,
      flags: [],
      reactivated: false,
      createdAt: new Date(Date.now() - (dormancyDays + Math.floor(rng() * 1825)) * 86400000).toISOString().split('T')[0]
    });
  }

  return accounts;
}

function init() {
  store.accounts = generateAccounts(240);

  // Init language stats
  const langs = ['English','Hindi','Bengali','Telugu','Marathi','Tamil','Gujarati','Kannada'];
  langs.forEach(l => {
    store.languageStats[l] = { sent: 0, responded: 0 };
  });

  // Simulate some historical reactivation data for charts
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now - i * 86400000).toISOString().split('T')[0];
    const reactivated = Math.floor(Math.random() * 8 + 2);
    store.reactivationLog.push({ date, reactivated, outreach: reactivated + Math.floor(Math.random() * 20 + 5) });
  }

  console.log(`[DATA] Generated ${store.accounts.length} accounts`);
}

module.exports = { init, generateAccounts };
