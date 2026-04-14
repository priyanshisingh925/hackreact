import React, { useEffect, useState, useCallback } from 'react'

const css = `
.accounts-layout { display: grid; grid-template-columns: 1fr 380px; gap: 16px; height: calc(100vh - var(--topbar-h) - 56px); }
.accounts-left { display: flex; flex-direction: column; gap: 12px; overflow: hidden; }
.accounts-right { overflow-y: auto; }

.filters-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filters-bar input { flex: 1; min-width: 160px; }
.filters-bar select { min-width: 120px; }

.acc-table-wrap { flex: 1; overflow-y: auto; background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.acc-table { width: 100%; border-collapse: collapse; }
.acc-table th {
  text-align: left; padding: 10px 14px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--text-muted); background: var(--bg);
  border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 2;
}
.acc-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
.acc-table tr:last-child td { border-bottom: none; }
.acc-table tr { cursor: pointer; transition: background 100ms; }
.acc-table tr:hover td { background: var(--bg-hover); }
.acc-table tr.selected td { background: var(--accent-light); }

.acc-name-cell { font-weight: 600; color: var(--text-primary); }
.acc-id-cell { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted); }
.acc-bal { font-family: var(--font-mono); font-size: 12px; }

.score-pill {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 22px; border-radius: 4px;
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
}
.score-high { background: #dcfce7; color: #16773c; }
.score-med { background: #fef3c7; color: #b45309; }
.score-low { background: #fee2e2; color: #b91c1c; }
.score-none { background: var(--bg); color: var(--text-muted); }

.pagination { display: flex; align-items: center; gap: 8px; padding: 10px 0; }
.page-btn { padding: 5px 12px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg-panel); cursor: pointer; font-size: 12px; color: var(--text-secondary); }
.page-btn:hover:not(:disabled) { background: var(--bg-hover); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 12px; color: var(--text-muted); margin: 0 auto; font-family: var(--font-mono); }

/* Detail panel */
.detail-panel { background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.detail-header { padding: 18px 20px; border-bottom: 1px solid var(--border); background: var(--bg); }
.detail-name { font-family: var(--font-head); font-size: 17px; font-weight: 800; color: var(--text-primary); }
.detail-id { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 3px; }
.detail-body { padding: 18px 20px; }

.detail-score-block {
  background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 8px; text-align: center;
}
.dsb-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); }
.dsb-val { font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--text-primary); margin-top: 2px; }
.dsb-sub { font-size: 9px; color: var(--text-muted); margin-top: 1px; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.info-item { }
.info-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
.info-val { font-size: 13px; color: var(--text-primary); }

.flags-section { margin-bottom: 16px; }
.flag-item { display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; border-radius: 5px; background: var(--danger-light); border: 1px solid #fca5a5; margin-bottom: 6px; }
.flag-type { font-size: 10px; font-weight: 700; color: var(--danger); letter-spacing: 0.05em; white-space: nowrap; }
.flag-detail { font-size: 11.5px; color: #7f1d1d; }

.msg-tabs { display: flex; gap: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 12px; }
.msg-tab { flex: 1; padding: 7px; text-align: center; font-size: 11px; font-weight: 600; cursor: pointer; background: var(--bg); color: var(--text-muted); border: none; transition: var(--transition); }
.msg-tab.active { background: var(--accent); color: white; }
.msg-content { font-size: 12px; line-height: 1.6; color: var(--text-secondary); background: var(--bg); padding: 10px; border-radius: var(--radius); border: 1px solid var(--border); white-space: pre-wrap; max-height: 120px; overflow-y: auto; }

.rec-block { background: var(--accent-light); border: 1px solid #c7d7ff; border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
.rec-priority { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--accent); margin-bottom: 4px; }
.rec-strategy { font-size: 12px; color: #1e3a8a; line-height: 1.5; }
.rec-meta { display: flex; gap: 12px; margin-top: 8px; }
.rec-meta-item { font-size: 11px; color: var(--accent); }

.detail-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 300px; color: var(--text-muted); gap: 8px;
}
.detail-empty-icon { font-size: 36px; opacity: 0.3; }
.detail-empty-text { font-size: 13px; }

/* CSV upload */
.csv-upload-area {
  border: 1.5px dashed var(--border-strong); border-radius: var(--radius-lg);
  padding: 24px; text-align: center; cursor: pointer; transition: var(--transition);
  background: var(--bg-panel);
}
.csv-upload-area:hover { border-color: var(--accent); background: var(--accent-light); }
.csv-upload-area.dragging { border-color: var(--accent); background: var(--accent-light); }
.csv-result { background: var(--success-light); border: 1px solid #a7f3d0; border-radius: var(--radius); padding: 12px; margin-top: 10px; font-size: 12.5px; color: var(--success); }

.score-btn { width: 100%; margin-top: 8px; }
`

function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

function ScorePill({ score }) {
  if (score === null || score === undefined) return <span className="score-pill score-none">—</span>
  const v = (score * 100).toFixed(0)
  const cls = score >= 0.7 ? 'score-high' : score >= 0.45 ? 'score-med' : 'score-low'
  return <span className={`score-pill ${cls}`}>{v}</span>
}

function DetailPanel({ account, onScore }) {
  const [activeTab, setActiveTab] = useState('sms')
  const [scoring, setScoring] = useState(false)
  const [explanation, setExplanation] = useState(null)

  useEffect(() => {
    if (account) {
      fetch(`/api/ai/explain/${account.id}`, { method: 'POST' })
        .then(r => r.json()).then(setExplanation).catch(() => {})
    }
  }, [account?.id])

  if (!account) return (
    <div className="detail-panel">
      <div className="detail-empty">
        <div className="detail-empty-icon">⊟</div>
        <div className="detail-empty-text">Select an account to view details</div>
      </div>
    </div>
  )

  const handleScore = async () => {
    setScoring(true)
    try {
      const r = await fetch(`/api/accounts/${account.id}/score`, { method: 'POST' })
      const updated = await r.json()
      onScore(updated)
    } finally { setScoring(false) }
  }

  const msgs = account.messages || {}
  const tabContent = { sms: msgs.sms, email: msgs.emailBody, ivr: msgs.ivrScript }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-name">{account.name}</div>
        <div className="detail-id">{account.id} · {account.branch}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <span className={`tag tag-${account.status === 'DORMANT' ? 'dormant' : 'active'}`}>{account.status}</span>
          {account.riskLevel && <span className={`tag tag-${account.riskLevel.toLowerCase()}`}>{account.riskLevel} Risk</span>}
          {account.deafRisk && <span className="tag tag-critical">DEAF Risk</span>}
        </div>
      </div>
      <div className="detail-body">
        {/* Score block */}
        <div className="detail-score-block">
          <div>
            <div className="dsb-label">AI Score</div>
            <div className="dsb-val" style={{ color: account.aiScore >= 0.7 ? 'var(--success)' : account.aiScore >= 0.45 ? 'var(--warn)' : 'var(--danger)' }}>
              {account.aiScore !== null && account.aiScore !== undefined ? (account.aiScore * 100).toFixed(1) : '—'}
            </div>
            <div className="dsb-sub">Final (hybrid)</div>
          </div>
          <div>
            <div className="dsb-label">RF Score</div>
            <div className="dsb-val">{account.rfScore !== undefined ? (account.rfScore * 100).toFixed(1) : '—'}</div>
            <div className="dsb-sub">Random Forest</div>
          </div>
          <div>
            <div className="dsb-label">NN Score</div>
            <div className="dsb-val">{account.nnScore !== undefined ? (account.nnScore * 100).toFixed(1) : '—'}</div>
            <div className="dsb-sub">Neural Net</div>
          </div>
        </div>

        <button className="btn btn-primary score-btn" onClick={handleScore} disabled={scoring}>
          {scoring ? 'Scoring...' : '⚡ Re-score with AI'}
        </button>

        {/* Info grid */}
        <div className="info-grid" style={{ marginTop: 16 }}>
          {[
            ['Balance', fmt(account.balance)],
            ['Dormancy', `${account.dormancyYears} years`],
            ['Age', `${account.age} years`],
            ['Account Type', account.accountType],
            ['Region', account.regionType],
            ['State', account.state],
            ['Mobile', account.hasMobile ? '✓ Available' : '✗ Missing'],
            ['Email', account.hasEmail ? '✓ Available' : '✗ Missing'],
            ['Language', account.preferredLanguage],
            ['Last Active', account.lastTransactionDate],
          ].map(([label, val]) => (
            <div className="info-item" key={label}>
              <div className="info-label">{label}</div>
              <div className="info-val">{val}</div>
            </div>
          ))}
        </div>

        {/* Flags */}
        {account.flags && account.flags.length > 0 && (
          <div className="flags-section">
            <div className="section-title">Risk Flags</div>
            {account.flags.map((f, i) => (
              <div className="flag-item" key={i}>
                <div className="flag-type">{f.type?.replace(/_/g, ' ')}</div>
                <div className="flag-detail">{f.detail}</div>
              </div>
            ))}
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-title">Score Explanation</div>
            {explanation.reasons?.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 8, borderLeft: '2px solid var(--accent)' }}>{r}</div>
            ))}
          </div>
        )}

        {/* Recommendation */}
        {account.recommendation && (
          <div className="rec-block">
            <div className="rec-priority">{account.recommendation.priority} Priority</div>
            <div className="rec-strategy">{account.recommendation.strategy}</div>
            <div className="rec-meta">
              <div className="rec-meta-item">⏱ {account.recommendation.timing}</div>
              <div className="rec-meta-item">₹{account.recommendation.estimatedCost} cost</div>
              <div className="rec-meta-item">{(account.recommendation.estimatedRecoveryProb * 100)?.toFixed(0)}% prob</div>
            </div>
          </div>
        )}

        {/* Messages */}
        {msgs.sms && (
          <div>
            <div className="section-title">Generated Messages ({msgs.languageUsed} · {msgs.tone})</div>
            <div className="msg-tabs">
              {['sms', 'email', 'ivr'].map(t => (
                <button key={t} className={`msg-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="msg-content">{tabContent[activeTab]}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function CSVUpload({ onImported }) {
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch('/api/import', { method: 'POST', body: fd })
      const data = await r.json()
      setResult(data)
      if (onImported) onImported()
    } catch (e) {
      setResult({ error: e.message })
    } finally { setUploading(false) }
  }

  return (
    <div>
      <div
        className={`csv-upload-area${dragging ? ' dragging' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]) }}
        onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.csv'; i.onchange = e => upload(e.target.files[0]); i.click() }}
      >
        <div style={{ fontSize: 24, marginBottom: 8 }}>📂</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {uploading ? 'Processing...' : 'Drop CSV or click to upload'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Up to 10,000 rows · Auto column detection</div>
      </div>
      {result && !result.error && (
        <div className="csv-result">
          ✓ Imported {result.total} accounts · {result.added} new · {result.updated} updated<br />
          Risk: HIGH {result.riskDistribution?.HIGH || 0} · MEDIUM {result.riskDistribution?.MEDIUM || 0} · LOW {result.riskDistribution?.LOW || 0}
        </div>
      )}
      {result?.error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>Error: {result.error}</div>}
    </div>
  )
}

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [sortBy, setSortBy] = useState('scoreDesc')
  const [showUpload, setShowUpload] = useState(false)
  const limit = 15

  const loadAccounts = useCallback(() => {
    const params = new URLSearchParams({ page, limit, sortBy })
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    if (riskFilter) params.set('riskLevel', riskFilter)
    fetch(`/api/accounts?${params}`)
      .then(r => r.json())
      .then(data => { setAccounts(data.accounts || []); setTotal(data.total || 0) })
      .catch(console.error)
  }, [page, search, statusFilter, riskFilter, sortBy])

  useEffect(() => { loadAccounts() }, [loadAccounts])

  const handleScore = (updated) => {
    setSelected(updated)
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
  }

  const scoreAll = async () => {
    await fetch('/api/accounts/score/all', { method: 'POST' })
    loadAccounts()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <style>{css}</style>
      <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="filters-bar" style={{ flex: 1 }}>
          <input placeholder="Search name, ID, branch..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ minWidth: 200 }} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            <option value="DORMANT">Dormant</option>
            <option value="ACTIVE">Active</option>
          </select>
          <select value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setPage(1) }}>
            <option value="">All Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}>
            <option value="scoreDesc">Sort: AI score</option>
            <option value="balanceDesc">Sort: Balance</option>
            <option value="dormancyDesc">Sort: Dormancy</option>
            <option value="riskDesc">Sort: Risk</option>
            <option value="nameAsc">Sort: Name</option>
          </select>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowUpload(s => !s)}>📂 Import CSV</button>
        <button className="btn btn-primary btn-sm" onClick={scoreAll}>⚡ Score All</button>
      </div>

      {showUpload && (
        <div style={{ marginBottom: 16 }}>
          <CSVUpload onImported={() => { loadAccounts(); setShowUpload(false) }} />
        </div>
      )}

      <div className="accounts-layout">
        <div className="accounts-left">
          <div className="acc-table-wrap">
            <table className="acc-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Dormancy</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} className={selected?.id === acc.id ? 'selected' : ''} onClick={() => setSelected(acc)}>
                    <td>
                      <div className="acc-name-cell">{acc.name}</div>
                      <div className="acc-id-cell">{acc.id}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{acc.accountType}</td>
                    <td className="acc-bal">{fmt(acc.balance)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{acc.dormancyYears}y</td>
                    <td><span className={`tag tag-${acc.status === 'DORMANT' ? 'dormant' : 'active'}`}>{acc.status}</span></td>
                    <td>{acc.riskLevel ? <span className={`tag tag-${acc.riskLevel.toLowerCase()}`}>{acc.riskLevel}</span> : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>}</td>
                    <td><ScorePill score={acc.aiScore} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>← Prev</button>
            <div className="page-info">Page {page} of {totalPages} · {total} accounts</div>
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next →</button>
          </div>
        </div>

        <div className="accounts-right">
          <DetailPanel account={selected} onScore={handleScore} />
        </div>
      </div>
    </>
  )
}
