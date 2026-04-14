# ReActivate AI
### Intelligent Dormant Account Reactivation Platform for Indian Banks

> An RBI-compliant, production-grade AI platform that identifies, scores, and reactivates dormant bank accounts using a Hybrid Random Forest + TensorFlow.js neural network.

---

## 🚀 Quick Start

**Requirements:** Node.js 18+ (no other global installs needed)

```bash
# 1. Extract and enter the project
unzip reactivate-ai.zip
cd reactivate-ai

# 2. Launch everything
node start.js
```

`start.js` will:
- Install backend dependencies (`server/node_modules`)
- Install frontend dependencies (`client/node_modules`)
- Start Express backend on **port 3001**
- Start Vite frontend on **port 5173**
- Auto-open browser at `http://localhost:5173`

---

## 🏗 Architecture

```
reactivate-ai/
├── start.js                    ← Unified launcher
├── server/                     ← Node.js + Express backend
│   ├── server.js               ← Entry point + bootstrap
│   ├── package.json
│   ├── data/
│   │   ├── store.js            ← In-memory data store
│   │   └── generator.js        ← 75 realistic Indian bank accounts
│   ├── services/
│   │   ├── aiModel.js          ← Random Forest (50 trees, depth 8, seeded)
│   │   ├── aiScoring.js        ← TF.js Neural Net + 60/20/20 hybrid scoring
│   │   ├── anomalyDetector.js  ← DEAF risk, balance spike, unreachable flags
│   │   ├── messageGenerator.js ← 8-language, urban/rural intelligent routing
│   │   ├── recommendationEngine.js  ← Priority, channel, cost, timing
│   │   ├── feedbackEngine.js   ← Self-learning loop, NN retrain on feedback
│   │   ├── businessMetrics.js  ← KPIs, reactivation rate, DEAF exposure
│   │   └── csvImporter.js      ← Auto column detection, up to 10K rows
│   └── routes/
│       ├── accounts.js         ← CRUD + scoring
│       ├── ai.js               ← Feature importance, explain, analytics
│       ├── feedback.js         ← Campaign response recording
│       └── import.js           ← CSV upload endpoint
└── client/                     ← React 18 + Vite frontend
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx             ← Shell + loading screen + routing
        ├── components/
        │   ├── Sidebar.jsx     ← Dark sidebar navigation
        │   └── Topbar.jsx      ← Live clock + RBI stats strip
        └── pages/
            ├── Dashboard.jsx   ← Command center, 8 KPIs, 4 charts
            ├── Accounts.jsx    ← Table + sliding detail panel + CSV upload
            ├── Workforce.jsx   ← Field ops, campaign timeline, recovery estimates
            ├── Analytics.jsx   ← Tone/language/funnel/heatmap analytics
            └── About.jsx       ← RBI pitch deck, AI architecture, system flow
```

---

## 🧠 AI Engine

### Hybrid Scoring Formula
```
Final Score = (0.6 × Random Forest) + (0.2 × Neural Network) + (0.2 × Domain Heuristic)
Penalized   = score × (HIGH risk → 0.60 | MEDIUM → 0.82 | LOW → 1.00)
```

### Random Forest
- **50 decision trees** built with recursive variance-reduction splitting
- **Max depth:** 8 levels
- **Feature sampling:** √8 ≈ 3 features per node split
- **Bootstrap:** 80% sample per tree
- **Randomness:** Deterministic seeded (reproducible)
- **Ensemble:** Averaged predictions

### Neural Network (TensorFlow.js)
- Architecture: `8 → 16 → 8 → 1` (Dense, ReLU, Sigmoid output)
- Trained in-process on Node.js
- **30 epochs**, Adam optimizer, 10% dropout
- **Retrains automatically** every 10 feedback records (self-learning loop)

### Feature Engineering (8 features)
| Feature | Weight | Description |
|---|---|---|
| Dormancy Duration | 28% | Primary signal — years since last transaction |
| Balance | 22% | Recovery value proxy |
| Transaction History | 18% | Frequency before dormancy |
| Branch Activity | 12% | Urban vs rural engagement |
| Language Engagement | 9% | Past engagement score |
| Age Score | 6% | Demographic response likelihood |
| Account Type | 3% | Account category |
| Contact Score | 2% | Mobile + email availability |

---

## 💬 Multilingual Message Generator

Supports **8 languages** with urban/rural intelligent routing:

| Language | Use Case |
|---|---|
| English | Urban accounts, high engagement |
| Hindi | Urban UP/Rajasthan, rural fallback |
| Bengali | West Bengal rural |
| Telugu | Telangana rural |
| Marathi | Maharashtra rural |
| Tamil | Tamil Nadu rural |
| Gujarati | Gujarat rural |
| Kannada | Karnataka rural |

**Routing logic:**
- `URBAN` → English by default; switch to regional if engagement < 25%
- `RURAL` → Local language by default; Hindi fallback; English only if engagement > 70%

**Tone selection:**
- Age > 60 → `respectful`
- Balance > ₹5L or dormancy > 8yr → `urgent`
- Age 18–35 → `direct`
- Engagement < 30% → `gentle`

---

## 📂 CSV Import

Upload CSVs with any column naming — auto-detected:

| Your Column | Detected As |
|---|---|
| `account_id`, `accountid`, `id` | Account ID |
| `customer_name`, `full_name` | Name |
| `dormancy_years`, `inactive_years` | Dormancy |
| `account_type`, `type` | Account Type |
| `balance`, `amount` | Balance |
| `has_mobile`, `mobile` | Mobile flag |
| `region_type`, `area_type` | Urban/Rural |

Sample CSV: see `sample_accounts.csv`

---

## 🌐 REST API Reference

```
GET  /api/accounts              — List accounts (filter: status, riskLevel, state, search)
GET  /api/accounts/:id          — Get single account
POST /api/accounts              — Create account
PUT  /api/accounts/:id          — Update account
POST /api/accounts/:id/score    — AI-score single account
POST /api/accounts/score/all    — Bulk score all accounts

GET  /api/ai/metrics            — Business KPIs
GET  /api/ai/feature-importance — RF feature weights
POST /api/ai/explain/:id        — Score explanation for account
GET  /api/ai/trend              — 30-day reactivation trend
GET  /api/ai/region-breakdown   — Dormancy by state
GET  /api/ai/risk-distribution  — HIGH/MEDIUM/LOW counts
GET  /api/ai/tone-stats         — Tone performance stats
GET  /api/ai/language-stats     — Language engagement stats

POST /api/feedback              — Record campaign response
GET  /api/feedback/summary      — Feedback analytics

POST /api/import                — Upload CSV file (multipart/form-data, field: 'file')

GET  /api/health                — Health check
```

---

## 🏦 Real-World Context (RBI)

| Metric | Value |
|---|---|
| DEAF Fund (RBI) | ₹35,012 Crore |
| Dormant accounts in India | 8.5+ Crore |
| Industry response rate | ~4% |
| Our projected uplift | 4.2× |
| Dormancy threshold (RBI) | 2+ years |
| DEAF transfer threshold | 10 years |

---

## 📊 Pages

| Page | What it shows |
|---|---|
| **Dashboard** | 8 KPI cards, reactivation trend, region map, risk donut, feature importance, top targets |
| **Accounts** | Searchable/filterable table, AI score panel, risk flags, multilingual messages, CSV upload |
| **Workforce** | Field agent estimates, channel breakdown, recovery projections, 10-week campaign roadmap |
| **Analytics** | Tone performance, language engagement, conversion funnel, score distribution, heatmap |
| **About** | RBI pitch deck — problem, solution, AI deep dive, system flow, business impact |

---

## 🛠 Tech Stack

- **Backend:** Node.js 18, Express 4, Multer, csv-parse
- **ML:** Custom Random Forest (pure JS) + TensorFlow.js 4.x
- **Frontend:** React 18, Vite 5
- **Styling:** Pure CSS (no Tailwind, no UI libraries)
- **Data:** In-memory (no database required)
- **Fonts:** Syne (headings) + DM Sans (body) + DM Mono (numbers)
