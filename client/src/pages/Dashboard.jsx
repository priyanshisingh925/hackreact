import React, { useEffect, useState } from 'react'
import { apiUrl } from '../apiBase.js'

const GRAPH_OPTIONS = {
  outreach: {
    label: 'Outreach',
    eyebrow: 'Daily outreach volume',
    note: 'Accounts contacted across the last 30 days',
    colorA: '#8db7f5',
    colorB: '#7fd7b9',
    value: data => data.reduce((sum, day) => sum + (day.outreach || 0), 0),
    series: data => data.map(day => day.outreach || 0),
    format: v => `${v} contacts`,
  },
  reactivated: {
    label: 'Reactivated',
    eyebrow: 'Daily reactivations',
    note: 'Accounts brought back into active recovery flow',
    colorA: '#98d88f',
    colorB: '#7fd7b9',
    value: data => data.reduce((sum, day) => sum + (day.reactivated || 0), 0),
    series: data => data.map(day => day.reactivated || 0),
    format: v => `${v} wins`,
  },
  efficiency: {
    label: 'Efficiency',
    eyebrow: 'Recovery efficiency',
    note: 'Daily reactivation rate from contacted accounts',
    colorA: '#e6a2a8',
    colorB: '#d8c56f',
    value: data => {
      const outreach = data.reduce((sum, day) => sum + (day.outreach || 0), 0)
      const reactivated = data.reduce((sum, day) => sum + (day.reactivated || 0), 0)
      return outreach ? (reactivated / outreach) * 100 : 0
    },
    series: data => data.map(day => day.outreach ? ((day.reactivated || 0) / day.outreach) * 100 : 0),
    format: v => `${v.toFixed(1)}%`,
  },
}

const css = `
.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(300px, 0.9fr);
  gap: 18px;
}

.dashboard-main,
.widget,
.target-row,
.activity-row {
  background: linear-gradient(145deg, rgba(20, 25, 24, 0.96), rgba(13, 16, 15, 0.95));
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.dashboard-main {
  min-height: 480px;
  padding: 26px;
  position: relative;
  overflow: hidden;
}

.dashboard-main::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 72% 18%, rgba(127,215,185,0.16), transparent 26%),
    radial-gradient(circle at 12% 78%, rgba(141,183,245,0.12), transparent 24%),
    linear-gradient(180deg, rgba(255,255,255,0.04), transparent 36%);
  pointer-events: none;
}

.main-content {
  position: relative;
  z-index: 1;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 22px;
}

.eyebrow {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.balance {
  margin-top: 8px;
  font-family: var(--font-head);
  font-size: 44px;
  line-height: 1;
  letter-spacing: -1px;
  color: var(--text-primary);
  font-weight: 800;
}

.balance-note {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.graph-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.graph-tab {
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition: var(--transition);
}

.graph-tab:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.graph-tab.active {
  color: #07100d;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent));
  border-color: transparent;
}

.soft-pill-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.soft-pill {
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 12px;
  font-family: var(--font-mono);
}

.trend-svg {
  width: 100%;
  height: 250px;
  display: block;
  margin-top: 24px;
}

.lower-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.widget {
  padding: 18px;
}

.widget-title {
  font-family: var(--font-head);
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 800;
}

.widget-sub {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.metric-value {
  margin-top: 18px;
  font-family: var(--font-head);
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.metric-label {
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 12px;
}

.side-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.donut-wrap {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  align-items: center;
  margin-top: 18px;
}

.donut-labels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.donut-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  display: inline-block;
  margin-right: 8px;
}

.target-list,
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.target-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  box-shadow: none;
}

.target-score {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-light);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
}

.target-name,
.activity-title {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.target-detail,
.activity-detail,
.target-balance {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 3px;
}

.target-balance {
  font-family: var(--font-mono);
  margin-top: 0;
}

.activity-row {
  padding: 13px;
  box-shadow: none;
}

.dashboard-state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

@media (max-width: 1120px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard-main,
  .widget {
    padding: 18px;
  }

  .panel-head {
    flex-direction: column;
  }

  .graph-tabs {
    justify-content: flex-start;
  }

  .balance {
    font-size: 34px;
  }

  .lower-grid,
  .donut-wrap {
    grid-template-columns: 1fr;
  }

  .target-row {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .target-balance {
    grid-column: 2;
  }
}
`

function fmt(n = 0) {
  if (n >= 10000000) return `INR ${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `INR ${(n / 100000).toFixed(1)} L`
  return `INR ${Number(n).toLocaleString('en-IN')}`
}

function pct(score) {
  if (score === null || score === undefined) return '--'
  return (score * 100).toFixed(0)
}

async function fetchJson(url, retries = 6) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${url} returned ${res.status}`)
    return await res.json()
  } catch (err) {
    if (retries <= 0) throw err
    await new Promise(resolve => setTimeout(resolve, 700))
    return fetchJson(url, retries - 1)
  }
}

function TrendChart({ data, graph }) {
  if (!data.length) return <div className="dashboard-state">No trend data yet</div>

  const config = GRAPH_OPTIONS[graph]
  const vals = config.series(data)
  const max = Math.max(...vals, 1)
  const W = 900
  const H = 250
  const pad = 18
  const points = vals.map((v, i) => {
    const x = pad + (i / Math.max(vals.length - 1, 1)) * (W - pad * 2)
    const y = H - pad - (v / max) * (H - pad * 2)
    return [x, y]
  })
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`dashLine-${graph}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={config.colorA} />
          <stop offset="100%" stopColor={config.colorB} />
        </linearGradient>
        <linearGradient id={`dashFill-${graph}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={config.colorB} stopOpacity="0.2" />
          <stop offset="100%" stopColor={config.colorB} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1="18" x2="882" y1={pad + i * 52} y2={pad + i * 52} stroke="rgba(229,238,232,0.07)" />
      ))}
      <polygon points={area} fill={`url(#dashFill-${graph})`} />
      <polyline points={line} fill="none" stroke={`url(#dashLine-${graph})`} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {points.filter((_, i) => i % 5 === 0).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#0c100f" stroke={config.colorB} strokeWidth="2" />
      ))}
    </svg>
  )
}

function RiskDonut({ riskDist }) {
  const total = (riskDist.HIGH || 0) + (riskDist.MEDIUM || 0) + (riskDist.LOW || 0) || 1
  const parts = [
    { key: 'HIGH', color: '#e6a2a8', value: riskDist.HIGH || 0 },
    { key: 'MEDIUM', color: '#d8c56f', value: riskDist.MEDIUM || 0 },
    { key: 'LOW', color: '#98d88f', value: riskDist.LOW || 0 },
  ]
  let offset = 25

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" width="140" height="140">
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(229,238,232,0.09)" strokeWidth="16" />
        {parts.map(part => {
          const dash = (part.value / total) * 264
          const circle = (
            <circle
              key={part.key}
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke={part.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${264 - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          )
          offset -= dash
          return circle
        })}
        <text x="60" y="57" textAnchor="middle" fill="#f4f7f3" fontSize="20" fontWeight="800">{total}</text>
        <text x="60" y="74" textAnchor="middle" fill="#9aa89f" fontSize="10">scored</text>
      </svg>
      <div className="donut-labels">
        {parts.map(part => (
          <div className="donut-label" key={part.key}>
            <span><span className="dot" style={{ background: part.color }} />{part.key}</span>
            <strong>{part.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [graph, setGraph] = useState('outreach')

  const loadDashboard = async () => {
    setError(null)
    try {
      const [metrics, trend, riskDist, accountData] = await Promise.all([
        fetchJson(apiUrl('/api/ai/metrics')),
        fetchJson(apiUrl('/api/ai/trend')),
        fetchJson(apiUrl('/api/ai/risk-distribution')),
        fetchJson(apiUrl('/api/accounts?status=DORMANT&sortBy=scoreDesc&limit=5')),
      ])

      setData({ metrics, trend, riskDist, topAccounts: accountData.accounts || [] })
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (error) {
    return (
      <>
        <style>{css}</style>
        <div className="dashboard-state">
          <div>Metrics are not ready yet.</div>
          <button className="btn btn-primary" onClick={loadDashboard}>Retry</button>
          <div style={{ fontSize: 11 }}>{error}</div>
        </div>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <style>{css}</style>
        <div className="dashboard-state">Loading metrics...</div>
      </>
    )
  }

  const { metrics, trend, riskDist, topAccounts } = data
  const totalRisk = (riskDist.HIGH || 0) + (riskDist.MEDIUM || 0) + (riskDist.LOW || 0)
  const activeGraph = GRAPH_OPTIONS[graph]
  const graphValue = activeGraph.value(trend)

  return (
    <>
      <style>{css}</style>
      <div className="dashboard">
        <div>
          <section className="dashboard-main">
            <div className="main-content">
              <div className="panel-head">
                <div>
                  <div className="eyebrow">{activeGraph.eyebrow}</div>
                  <div className="balance">{activeGraph.format(graphValue)}</div>
                  <div className="balance-note">{activeGraph.note}</div>
                </div>
                <div className="graph-tabs" aria-label="Dashboard graph selector">
                  {Object.entries(GRAPH_OPTIONS).map(([key, option]) => (
                    <button key={key} className={`graph-tab${graph === key ? ' active' : ''}`} onClick={() => setGraph(key)}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <TrendChart data={trend} graph={graph} />
              <div className="soft-pill-row">
                <div className="soft-pill">{metrics.totalAccounts} sample accounts</div>
                <div className="soft-pill">{metrics.dormantAccounts} dormant</div>
                <div className="soft-pill">{fmt(metrics.totalDormantBalance)} dormant balance</div>
              </div>
            </div>
          </section>

          <section className="lower-grid">
            <div className="widget">
              <div className="widget-title">High Priority</div>
              <div className="widget-sub">Best first recovery targets</div>
              <div className="metric-value">{metrics.highPriority}</div>
              <div className="metric-label">AI score above 70</div>
            </div>
            <div className="widget">
              <div className="widget-title">DEAF Watch</div>
              <div className="widget-sub">Accounts past long dormancy threshold</div>
              <div className="metric-value">{metrics.deafRiskAccounts}</div>
              <div className="metric-label">{fmt(metrics.deafBalance)} at risk</div>
            </div>
            <div className="widget">
              <div className="widget-title">Average Score</div>
              <div className="widget-sub">Portfolio reactivation signal</div>
              <div className="metric-value">{(+metrics.avgAiScore * 100).toFixed(0)}</div>
              <div className="metric-label">out of 100</div>
            </div>
          </section>
        </div>

        <aside className="side-stack">
          <section className="widget">
            <div className="widget-title">Risk Distribution</div>
            <div className="widget-sub">{totalRisk} scored dormant accounts</div>
            <RiskDonut riskDist={riskDist} />
          </section>

          <section className="widget">
            <div className="panel-head" style={{ marginBottom: 0 }}>
              <div>
                <div className="widget-title">Recovery Targets</div>
                <div className="widget-sub">Reserved for the first outreach wave</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate?.('accounts')}>View all</button>
            </div>
            <div className="target-list">
              {topAccounts.map(acc => (
                <div className="target-row" key={acc.id}>
                  <div className="target-score">{pct(acc.aiScore)}</div>
                  <div>
                    <div className="target-name">{acc.name}</div>
                    <div className="target-detail">{acc.branch?.split(' - ')[0]} - {acc.dormancyYears}y dormant</div>
                  </div>
                  <div className="target-balance">{fmt(acc.balance)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="widget">
            <div className="widget-title">Recent Activity</div>
            <div className="activity-list">
              {trend.slice(-3).reverse().map(day => (
                <div className="activity-row" key={day.date}>
                  <div className="activity-title">{day.date}</div>
                  <div className="activity-detail">{day.outreach} contacted - {day.reactivated} reactivated</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
