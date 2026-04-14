import React from 'react'

const css = `
.about-wrap {
  max-width: 1180px;
  color: var(--text-secondary);
}

.about-hero,
.about-section,
.feature-card,
.stat-card,
.timeline-item,
.journey-card,
.chart-panel {
  background: linear-gradient(145deg, rgba(20, 25, 24, 0.96), rgba(13, 16, 15, 0.95));
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.about-hero {
  padding: 44px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 82% 18%, rgba(127,215,185,0.16), transparent 26%),
    radial-gradient(circle at 18% 82%, rgba(141,183,245,0.12), transparent 28%);
  pointer-events: none;
}

.about-hero > * {
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}

.hero-title {
  font-family: var(--font-head);
  font-size: 44px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.8px;
  line-height: 1.08;
  max-width: 920px;
}

.hero-copy,
.section-copy {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.82;
}

.hero-copy {
  max-width: 960px;
  margin-top: 20px;
}

.about-section {
  padding: 28px;
  margin-bottom: 20px;
}

.section-head {
  margin-bottom: 18px;
}

.section-kicker {
  color: var(--accent);
  font-size: 12px;
  font-family: var(--font-mono);
  margin-bottom: 8px;
}

.section-title {
  font-family: var(--font-head);
  font-size: 25px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.stat-grid,
.feature-grid,
.journey-grid,
.impact-grid {
  display: grid;
  gap: 12px;
}

.stat-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
}

.stat-value {
  font-family: var(--font-head);
  font-size: 27px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.4px;
}

.stat-label {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
}

.feature-card,
.journey-card,
.chart-panel {
  padding: 18px;
  box-shadow: none;
}

.feature-title,
.journey-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 9px;
}

.feature-copy,
.journey-copy,
.timeline-copy {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.72;
}

.diagram {
  width: 100%;
  height: auto;
  display: block;
  margin-top: 20px;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.timeline-item {
  padding: 18px;
  box-shadow: none;
  min-height: 160px;
}

.timeline-num {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #07100d;
  font-family: var(--font-mono);
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent));
  margin-bottom: 14px;
}

.timeline-title {
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 8px;
}

.journey-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 18px;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 16px;
  margin-top: 18px;
}

.bar-row {
  display: grid;
  grid-template-columns: 150px 1fr 44px;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.bar-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.bar-track {
  height: 9px;
  background: rgba(255,255,255,0.06);
  border-radius: 99px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 99px;
}

.bar-value {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  text-align: right;
}

.impact-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.source-note {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.75;
  margin-top: 16px;
}

@media (max-width: 1060px) {
  .stat-grid,
  .feature-grid,
  .journey-grid,
  .timeline,
  .impact-grid,
  .chart-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 660px) {
  .about-hero,
  .about-section {
    padding: 22px;
  }

  .hero-title {
    font-size: 31px;
  }

  .hero-copy,
  .section-copy {
    font-size: 15px;
  }

  .stat-grid,
  .feature-grid,
  .journey-grid,
  .timeline,
  .impact-grid,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .bar-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .bar-value {
    text-align: left;
  }
}
`

const featureGroups = [
  ['Portfolio Dashboard', 'Main balance card, switchable graphs, risk donut, recovery targets, recent activity, high-priority count, DEAF watch, and average account score.'],
  ['Account Registry', 'Search, pagination, status filter, risk filter, full-dataset sorting, score pills, detail panel, risk flags, generated messages, and account-level recommendations.'],
  ['CSV Import', 'Upload dormant account data, detect common columns, normalize customer records, add new accounts, update duplicates, and score imported entries.'],
  ['AI Prioritization', 'Scores accounts using dormancy, balance, contactability, transaction behavior, region, language, account type, age, and risk flags.'],
  ['Recovery Messaging', 'Generates outreach content for customer communication, including SMS, email body, IVR-style script, tone selection, and language-aware text.'],
  ['Workforce Planning', 'Shows available agents, capacity, open visit slots, branch destinations, required appointments, booked appointments, and high-value visit reservations.'],
  ['Analytics', 'Tracks tone performance, language engagement, conversion funnel, score distribution, daily outreach heatmap, and scoring feature weights.'],
  ['CASA Impact', 'Frames recovery around returning owner money and converting idle balances into active current and savings account participation.'],
  ['Compliance Context', 'Highlights long dormancy and DEAF-risk accounts so teams can act before money becomes harder to recover.'],
]

const timeline = [
  ['Data Intake', 'Load the generated 240-account sample or import bank CSV records.'],
  ['AI Scoring', 'Rank every dormant account by recovery probability and risk profile.'],
  ['Human Review', 'Review account details, risk flags, messages, and recommendation notes.'],
  ['Field Assignment', 'Reserve agents for high-value accounts and branch visits.'],
  ['Reactivation', 'Complete KYC, documents, nominee updates, and account reactivation.'],
]

const scoringWeights = [
  ['Dormancy', 28, 'var(--accent)'],
  ['Balance', 22, 'var(--accent-blue)'],
  ['Transactions', 18, 'var(--accent-gold)'],
  ['Branch pattern', 12, 'var(--accent-rose)'],
  ['Language', 9, 'var(--success)'],
  ['Age', 6, 'var(--warn)'],
  ['Account type', 3, 'var(--accent-blue)'],
  ['Contacts', 2, 'var(--accent)'],
]

const journey = [
  ['Customer money found', 'The account appears in dormant or unclaimed data with balance, branch, and identity context.'],
  ['Best action selected', 'The system decides whether to start with low-cost outreach, branch review, or field-agent follow-up.'],
  ['Appointment planned', 'High-value or high-risk accounts receive agent reservation and branch destination planning.'],
  ['CASA restored', 'The customer or heir completes the process and the dormant balance returns to active banking.'],
]

export default function About() {
  return (
    <>
      <style>{css}</style>
      <div className="about-wrap">
        <section className="about-hero">
          <div className="eyebrow">About the project</div>
          <h1 className="hero-title">Reactivate turns dormant account data into recovery action.</h1>
          <p className="hero-copy">
            Reactivate is a banking recovery dashboard for dormant and unclaimed accounts. It helps a bank identify
            inactive accounts, prioritize recovery targets, explain why an account deserves attention, generate outreach
            guidance, reserve field agents for high-value cases, and track progress from discovery to reactivation. The
            project is built around one question: how do we move money from idle, forgotten, or hard-to-claim status back
            into active financial participation?
          </p>
        </section>

        <section className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">240</div>
            <div className="stat-label">Sample accounts generated at startup for demos and testing.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">INR 67,000 Cr+</div>
            <div className="stat-label">Unclaimed bank deposits reported across India as of June 2025.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">INR 72,000 Cr+</div>
            <div className="stat-label">Reported transferred to the RBI-maintained DEA Fund by early 2026.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">CASA</div>
            <div className="stat-label">The project links recovery to active current and savings account growth.</div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">01 / Product map</div>
            <div className="section-title">Everything Reactivate covers</div>
          </div>
          <p className="section-copy">
            The project covers the full dormant-account recovery loop: portfolio view, individual accounts, AI scoring,
            imported data, outreach guidance, field-agent dispatch, appointment planning, analytics, and CASA impact.
          </p>
          <div className="feature-grid">
            {featureGroups.map(([title, copy]) => (
              <div className="feature-card" key={title}>
                <div className="feature-title">{title}</div>
                <div className="feature-copy">{copy}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">02 / Recovery flow</div>
            <div className="section-title">From dormant data to field action</div>
          </div>
          <svg className="diagram" viewBox="0 0 980 230" role="img" aria-label="Recovery workflow diagram">
            <defs>
              <linearGradient id="flowStroke" x1="0" x2="1">
                <stop offset="0%" stopColor="#8db7f5" />
                <stop offset="50%" stopColor="#7fd7b9" />
                <stop offset="100%" stopColor="#e6a2a8" />
              </linearGradient>
            </defs>
            <path d="M 95 118 C 215 40, 340 40, 465 118 S 725 196, 885 118" fill="none" stroke="url(#flowStroke)" strokeWidth="5" strokeLinecap="round" />
            {[
              ['Data', 95, 118, '#8db7f5'],
              ['Score', 280, 72, '#7fd7b9'],
              ['Review', 465, 118, '#d8c56f'],
              ['Assign', 650, 164, '#e6a2a8'],
              ['Reactivate', 885, 118, '#98d88f'],
            ].map(([label, x, y, color]) => (
              <g key={label}>
                <circle cx={x} cy={y} r="42" fill="rgba(255,255,255,0.04)" stroke={color} strokeWidth="3" />
                <text x={x} y={y + 5} fill="#f4f7f3" fontSize="18" textAnchor="middle" fontWeight="800">{label}</text>
              </g>
            ))}
          </svg>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">03 / Recovery timeline</div>
            <div className="section-title">How the work moves through the bank</div>
          </div>
          <div className="timeline">
            {timeline.map(([title, copy], index) => (
              <div className="timeline-item" key={title}>
                <div className="timeline-num">{index + 1}</div>
                <div className="timeline-title">{title}</div>
                <div className="timeline-copy">{copy}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">04 / Scoring logic</div>
            <div className="section-title">What makes an account a strong recovery target</div>
          </div>
          <p className="section-copy">
            Reactivate does not treat every dormant account the same. It weighs account value, years dormant, contact
            availability, transaction history, language, branch context, account type, age, and risk flags. The result is
            a practical priority score that helps teams choose the next best action.
          </p>
          <div className="chart-grid">
            <div className="chart-panel">
              {scoringWeights.map(([label, value, color]) => (
                <div className="bar-row" key={label}>
                  <div className="bar-label">{label}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${value / 28 * 100}%`, background: color }} /></div>
                  <div className="bar-value">{value}%</div>
                </div>
              ))}
            </div>
            <div className="chart-panel">
              <div className="feature-title">Priority formula</div>
              <div className="feature-copy">
                Strong targets usually combine meaningful balance, reachable contact details, moderate dormancy, branch
                context, and fewer unresolved documentation risks. Accounts with DEAF risk or missing contact information
                are flagged for careful handling and often need field support.
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">05 / Customer journey</div>
            <div className="section-title">How Reactivate helps money flow back</div>
          </div>
          <div className="journey-grid">
            {journey.map(([title, copy]) => (
              <div className="journey-card" key={title}>
                <div className="journey-title">{title}</div>
                <div className="journey-copy">{copy}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">06 / Workforce loop</div>
            <div className="section-title">Why field operations are part of the product</div>
          </div>
          <svg className="diagram" viewBox="0 0 980 250" role="img" aria-label="Workforce loop chart">
            {[
              ['Available agents', 130, 80, '#7fd7b9'],
              ['High-value accounts', 360, 80, '#d8c56f'],
              ['Branch destinations', 590, 80, '#8db7f5'],
              ['Booked visits', 820, 80, '#e6a2a8'],
            ].map(([label, x, y, color], index) => (
              <g key={label}>
                <rect x={x - 88} y={y - 34} width="176" height="68" rx="8" fill="rgba(255,255,255,0.045)" stroke={color} />
                <text x={x} y={y + 5} fill="#f4f7f3" fontSize="16" textAnchor="middle" fontWeight="800">{label}</text>
                {index < 3 && <path d={`M ${x + 96} ${y} L ${x + 126} ${y}`} stroke="#9aa89f" strokeWidth="3" strokeLinecap="round" />}
              </g>
            ))}
            <path d="M 820 124 C 740 205, 240 205, 130 124" fill="none" stroke="rgba(127,215,185,0.48)" strokeWidth="3" strokeDasharray="8 8" />
            <text x="475" y="215" fill="#9aa89f" textAnchor="middle" fontSize="14">feedback updates agent planning and next-day recovery priorities</text>
          </svg>
        </section>

        <section className="about-section">
          <div className="section-head">
            <div className="section-kicker">07 / Impact</div>
            <div className="section-title">The end goal is owner recovery and CASA growth</div>
          </div>
          <div className="impact-grid">
            <div className="journey-card">
              <div className="journey-title">For customers and heirs</div>
              <div className="journey-copy">The product reduces discovery friction, makes the claim path clearer, and helps people reconnect with balances they may not know exist.</div>
            </div>
            <div className="journey-card">
              <div className="journey-title">For banks</div>
              <div className="journey-copy">Recovered accounts update customer records, improve continuity, strengthen active CASA deposits, and give operations teams a clearer recovery playbook.</div>
            </div>
          </div>
          <div className="source-note">
            The India context uses rounded public 2025-26 figures because reported values vary by date and definition. The project itself uses generated demo data to show the recovery workflow end to end.
          </div>
        </section>
      </div>
    </>
  )
}
