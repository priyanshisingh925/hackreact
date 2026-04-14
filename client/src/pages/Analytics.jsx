import React, { useEffect, useState } from 'react'
import { apiUrl } from '../apiBase.js'

const css = `
.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.analytics-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 16px; }
.a-card { background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; }
.a-title { font-family: var(--font-head); font-size: 13.5px; font-weight: 700; margin-bottom: 3px; }
.a-sub { font-size: 11.5px; color: var(--text-muted); margin-bottom: 18px; }

/* Tone chart */
.tone-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.tone-label { width: 90px; font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: capitalize; }
.tone-bar-group { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.tone-bar-bg { height: 8px; background: var(--bg); border-radius: 4px; overflow: hidden; }
.tone-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.tone-stats { display: flex; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
.tone-rate { font-weight: 700; color: var(--success); }

/* Language chart */
.lang-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.lang-name { width: 80px; font-size: 12px; color: var(--text-secondary); }
.lang-bar-bg { flex: 1; height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; }
.lang-bar-fill { height: 100%; border-radius: 3px; }
.lang-pct { width: 36px; text-align: right; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }

/* Funnel */
.funnel-step { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.funnel-label { width: 110px; font-size: 12px; color: var(--text-secondary); }
.funnel-bar-bg { flex: 1; height: 28px; background: var(--bg); border-radius: 4px; overflow: hidden; position: relative; }
.funnel-bar-fill { height: 100%; display: flex; align-items: center; padding-left: 10px; font-size: 11.5px; font-weight: 600; color: white; border-radius: 4px; transition: width 0.6s ease; }
.funnel-count { width: 50px; text-align: right; font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--text-primary); }

/* Score distribution */
.score-dist { display: flex; align-items: flex-end; gap: 3px; height: 80px; }
.sd-bar { flex: 1; border-radius: 3px 3px 0 0; min-height: 2px; cursor: pointer; transition: opacity 150ms; }
.sd-bar:hover { opacity: 0.7; }
.sd-labels { display: flex; justify-content: space-between; margin-top: 4px; }
.sd-label { font-size: 9.5px; font-family: var(--font-mono); color: var(--text-muted); }

/* Conversion funnel metrics */
.conv-metric { text-align: center; padding: 16px; background: var(--bg); border-radius: var(--radius); border: 1px solid var(--border); }
.conv-val { font-family: var(--font-head); font-size: 24px; font-weight: 800; color: var(--text-primary); }
.conv-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-muted); margin-top: 4px; }
.conv-delta { font-size: 11px; margin-top: 4px; }
.up { color: var(--success); font-weight: 600; }
.dn { color: var(--danger); font-weight: 600; }

.heatmap { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; }
.hm-cell {
  min-height: 48px;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 150ms;
  border: 1px solid rgba(255,255,255,0.05);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hm-cell:hover { opacity: 0.7; }
.hm-day { font-size: 10px; color: rgba(255,255,255,0.62); font-family: var(--font-mono); }
.hm-count { font-size: 13px; color: var(--text-primary); font-weight: 800; }
@media (max-width: 900px) { .heatmap { grid-template-columns: repeat(5, 1fr); } }
@media (max-width: 540px) { .heatmap { grid-template-columns: repeat(2, 1fr); } }
`

const LANG_COLORS = ['#7fd7b9', '#8db7f5', '#e6a2a8', '#d8c56f', '#98d88f', '#a7c5e8', '#c6d98f', '#d8a8c4']
const TONE_COLORS = { respectful: '#8db7f5', direct: '#7fd7b9', urgent: '#e6a2a8', gentle: '#98d88f' }

export default function Analytics() {
  const [toneStats, setToneStats] = useState({})
  const [langStats, setLangStats] = useState({})
  const [metrics, setMetrics] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [featureData, setFeatureData] = useState([])
  const [trendData, setTrendData] = useState([])

  useEffect(() => {
    Promise.all([
      fetch(apiUrl('/api/ai/tone-stats')).then(r => r.json()),
      fetch(apiUrl('/api/ai/language-stats')).then(r => r.json()),
      fetch(apiUrl('/api/ai/metrics')).then(r => r.json()),
      fetch(apiUrl('/api/accounts?limit=240')).then(r => r.json()),
      fetch(apiUrl('/api/ai/feature-importance')).then(r => r.json()),
      fetch(apiUrl('/api/ai/trend')).then(r => r.json()),
    ]).then(([tone, lang, met, accs, fi, trend]) => {
      setToneStats(tone)
      setLangStats(lang)
      setMetrics(met)
      setAccounts(accs.accounts || [])
      setFeatureData(fi.features || [])
      setTrendData(trend || [])
    }).catch(console.error)
  }, [])

  if (!metrics) return <div style={{ padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading analytics...</div>

  const toneEntries = Object.entries(toneStats)
  const maxSent = Math.max(...toneEntries.map(([, v]) => v.sent), 1)

  const langEntries = Object.entries(langStats).sort((a, b) => b[1].sent - a[1].sent)
  const maxLangSent = Math.max(...langEntries.map(([, v]) => v.sent), 1)

  // Score distribution buckets
  const scored = accounts.filter(a => a.aiScore !== null && a.aiScore !== undefined)
  const buckets = Array(10).fill(0)
  scored.forEach(a => { const b = Math.min(9, Math.floor(a.aiScore * 10)); buckets[b]++ })
  const maxBucket = Math.max(...buckets, 1)

  const dormant = metrics.dormantAccounts || 0
  const funnelData = [
    { label: 'Total Accounts', count: metrics.totalAccounts, color: '#d7dfd8' },
    { label: 'Dormant', count: dormant, color: '#d8c56f' },
    { label: 'Scored by AI', count: scored.length, color: '#8db7f5' },
    { label: 'High Priority', count: metrics.highPriority, color: '#7fd7b9' },
    { label: 'Reactivated', count: metrics.reactivated, color: '#98d88f' },
  ]
  const funnelMax = funnelData[0].count || 1

  const dailyHeat = trendData.slice(-30)
  const maxHeat = Math.max(...dailyHeat.map(d => d.outreach || 0), 1)

  const conversionRate = dormant > 0 ? ((metrics.reactivated / dormant) * 100).toFixed(2) : '0.00'
  const uplift = ((+conversionRate / 4.0)).toFixed(1)

  return (
    <>
      <style>{css}</style>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { val: `${metrics.ourResponseRate || '0.00'}%`, label: 'Our Response Rate', delta: `${uplift}x industry` },
          { val: '4.0%', label: 'Industry Baseline', delta: 'RBI benchmark' },
          { val: `${metrics.highPriority}`, label: 'High Priority Accs', delta: 'Score ≥ 70%' },
          { val: `${(+metrics.avgAiScore * 100).toFixed(1)}`, label: 'Avg AI Score', delta: 'Portfolio mean' },
          { val: `${conversionRate}%`, label: 'Conversion Rate', delta: `vs 4% baseline` },
        ].map(m => (
          <div className="conv-metric" key={m.label}>
            <div className="conv-val">{m.val}</div>
            <div className="conv-label">{m.label}</div>
            <div className="conv-delta" style={{ color: 'var(--text-muted)', fontSize: 11 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Tone performance */}
        <div className="a-card">
          <div className="a-title">Tone Performance</div>
          <div className="a-sub">Response rates by message tone strategy</div>
          {toneEntries.map(([tone, stats]) => {
            const rate = stats.sent > 0 ? ((stats.responded / stats.sent) * 100).toFixed(1) : '0.0'
            return (
              <div className="tone-row" key={tone}>
                <div className="tone-label">{tone}</div>
                <div className="tone-bar-group">
                  <div className="tone-bar-bg">
                    <div className="tone-bar-fill" style={{ width: `${(stats.sent / maxSent) * 100}%`, background: TONE_COLORS[tone] || '#ccc', opacity: 0.5 }} />
                  </div>
                  <div className="tone-bar-bg">
                    <div className="tone-bar-fill" style={{ width: `${(stats.responded / (maxSent || 1)) * 100}%`, background: TONE_COLORS[tone] || '#ccc' }} />
                  </div>
                </div>
                <div className="tone-stats">
                  <span>{stats.sent}s</span>
                  <span className="tone-rate">{rate}%</span>
                </div>
              </div>
            )
          })}
          {toneEntries.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>No feedback data yet. Send campaigns and record responses.</div>}
        </div>

        {/* Language engagement */}
        <div className="a-card">
          <div className="a-title">Language Engagement</div>
          <div className="a-sub">Outreach volume and response by language</div>
          {langEntries.map(([lang, stats], i) => {
            const pct = (stats.sent / (maxLangSent || 1)) * 100
            const rate = stats.sent > 0 ? ((stats.responded / stats.sent) * 100).toFixed(1) : '0.0'
            return (
              <div className="lang-row" key={lang}>
                <div className="lang-name">{lang}</div>
                <div className="lang-bar-bg">
                  <div className="lang-bar-fill" style={{ width: `${pct}%`, background: LANG_COLORS[i] || 'var(--accent)' }} />
                </div>
                <div className="lang-pct">{stats.sent}</div>
                <div style={{ width: 36, textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 600 }}>{rate}%</div>
              </div>
            )
          })}
          {langEntries.every(([, v]) => v.sent === 0) && <div style={{ color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>Language stats accumulate as AI scores accounts.</div>}
        </div>

        {/* Conversion funnel */}
        <div className="a-card">
          <div className="a-title">Conversion Funnel</div>
          <div className="a-sub">Account pipeline from total to reactivated</div>
          {funnelData.map((step, i) => (
            <div className="funnel-step" key={step.label}>
              <div className="funnel-label">{step.label}</div>
              <div className="funnel-bar-bg">
                <div className="funnel-bar-fill" style={{ width: `${(step.count / funnelMax) * 100}%`, background: step.color, color: step.color === '#d7dfd8' ? '#07100d' : '#07100d' }}>
                  {step.count > 0 ? step.count : ''}
                </div>
              </div>
              <div className="funnel-count">{step.count}</div>
            </div>
          ))}
        </div>

        {/* Score distribution */}
        <div className="a-card">
          <div className="a-title">AI Score Distribution</div>
          <div className="a-sub">Account spread across reactivation probability buckets</div>
          <div className="score-dist">
            {buckets.map((count, i) => (
              <div
                key={i}
                className="sd-bar"
                style={{
                  height: `${Math.max(4, (count / maxBucket) * 100)}%`,
                  background: i >= 7 ? '#98d88f' : i >= 4 ? '#d8c56f' : '#e6a2a8',
                  opacity: 0.6 + (i / 9) * 0.4
                }}
                title={`Score ${i * 10}–${(i + 1) * 10}%: ${count} accounts`}
              />
            ))}
          </div>
          <div className="sd-labels">
            <span className="sd-label">0%</span>
            <span className="sd-label">50%</span>
            <span className="sd-label">100%</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            {[['< 45% Low', '#e6a2a8'], ['45–70% Med', '#d8c56f'], ['> 70% High', '#98d88f']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-grid-3">
        {/* Engagement heatmap */}
        <div className="a-card" style={{ gridColumn: 'span 2' }}>
          <div className="a-title">Daily Outreach Heatmap</div>
          <div className="a-sub">Daily account activity over the last 30 days</div>
          <div className="heatmap">
            {dailyHeat.map(day => {
              const outreach = day.outreach || 0
              const intensity = outreach / maxHeat
              const dt = new Date(`${day.date}T00:00:00`)
              return (
                <div
                  key={day.date}
                  className="hm-cell"
                  style={{ background: `rgba(48,213,200,${0.08 + intensity * 0.62})` }}
                  title={`${day.date}: ${outreach} contacted, ${day.reactivated || 0} reactivated`}
                >
                  <div className="hm-day">{dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                  <div className="hm-count">{outreach}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(op => (
              <div key={op} style={{ width: 14, height: 10, borderRadius: 2, background: `rgba(48,213,200,${op})` }} />
            ))}
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>High</span>
          </div>
        </div>

        {/* Feature weights */}
        <div className="a-card">
          <div className="a-title">Model Feature Weights</div>
          <div className="a-sub">Current AI model importance scores</div>
          {featureData.map((f, i) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <div style={{ width: 110, fontSize: 11.5, color: 'var(--text-secondary)' }}>{f.name}</div>
              <div style={{ flex: 1, height: 5, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${f.weight * 100 / 0.28 * 100}%`, background: 'var(--accent)', borderRadius: 3, opacity: 0.7 + f.weight * 2 }} />
              </div>
              <div style={{ width: 34, textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{(f.weight * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
