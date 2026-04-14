import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Accounts from './pages/Accounts.jsx'
import Workforce from './pages/Workforce.jsx'
import Analytics from './pages/Analytics.jsx'
import About from './pages/About.jsx'

const styles = `
:root {
  --bg: #090b0a;
  --bg-panel: rgba(18, 22, 21, 0.94);
  --bg-raised: rgba(28, 34, 32, 0.9);
  --bg-hover: rgba(42, 50, 47, 0.86);
  --border: rgba(229, 238, 232, 0.11);
  --border-strong: rgba(229, 238, 232, 0.2);
  --text-primary: #f4f7f3;
  --text-secondary: #d7dfd8;
  --text-muted: #9aa89f;
  --accent: #7fd7b9;
  --accent-blue: #8db7f5;
  --accent-rose: #e6a2a8;
  --accent-gold: #d8c56f;
  --accent-light: rgba(127, 215, 185, 0.14);
  --accent-hover: #a5e6d0;
  --danger: #e6a2a8;
  --danger-light: rgba(230, 162, 168, 0.14);
  --warn: #d8c56f;
  --warn-light: rgba(216, 197, 111, 0.15);
  --success: #98d88f;
  --success-light: rgba(152, 216, 143, 0.15);
  --nav-h: 64px;
  --topbar-h: 82px;
  --font-head: 'Manrope', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 8px;
  --radius-lg: 8px;
  --shadow: 0 18px 52px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px var(--border);
  --shadow-md: 0 28px 90px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px var(--border);
  --transition: 150ms ease;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  font-size: 13.5px;
  line-height: 1.5;
}

.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 76% 14%, rgba(127, 215, 185, 0.18), transparent 26%),
    radial-gradient(circle at 24% 72%, rgba(141, 183, 245, 0.13), transparent 28%),
    radial-gradient(circle at 88% 84%, rgba(230, 162, 168, 0.12), transparent 24%),
    linear-gradient(135deg, #0d1110 0%, #070908 48%, #11130f 100%),
    var(--bg);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px 36px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

/* Utility */
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 3px; font-size: 11px;
  font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
}
.tag-high { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(255,107,107,0.2); }
.tag-medium { background: var(--warn-light); color: var(--warn); border: 1px solid rgba(245,197,107,0.2); }
.tag-low { background: var(--success-light); color: var(--success); border: 1px solid rgba(101,217,135,0.2); }
.tag-critical { background: #1a0a0a; color: #ff6b6b; }
.tag-active { background: var(--success-light); color: var(--success); }
.tag-dormant { background: var(--warn-light); color: var(--warn); }

.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--radius);
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; transition: var(--transition);
  text-decoration: none;
}
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent-hover); color: #050505; }
.btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
.btn-danger { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(255,107,107,0.3); }
.btn-sm { padding: 5px 10px; font-size: 12px; }

.card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.section-title {
  font-family: var(--font-head);
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 16px;
}

.mono { font-family: var(--font-mono); }

input, select {
  font-family: var(--font-body);
  font-size: 13px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 7px 11px;
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);
}
input:focus, select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(48,213,200,0.12);
}

/* Loading screen */
.loader-overlay {
  position: fixed; inset: 0;
  background: #0d0d0d;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease;
}
.loader-logo {
  font-family: var(--font-head);
  font-size: 28px; font-weight: 800;
  color: white; letter-spacing: -0.5px;
  margin-bottom: 6px;
}
.loader-sub {
  font-size: 12px; color: #666; letter-spacing: 0.08em;
  text-transform: uppercase; margin-bottom: 40px;
}
.loader-bar-wrap {
  width: 240px; height: 2px;
  background: #222; border-radius: 2px; overflow: hidden;
}
.loader-bar {
  height: 100%; background: var(--accent);
  border-radius: 2px;
  animation: loadprog 1.8s ease-in-out forwards;
}
.loader-status {
  margin-top: 16px; font-size: 11px; color: #555;
  font-family: var(--font-mono); letter-spacing: 0.05em;
}
@keyframes loadprog {
  0% { width: 0%; }
  40% { width: 35%; }
  70% { width: 68%; }
  90% { width: 88%; }
  100% { width: 100%; }
}
`

const PAGES = { dashboard: Dashboard, accounts: Accounts, workforce: Workforce, analytics: Analytics, about: About }

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [loadMsg, setLoadMsg] = useState('Initializing ML models...')

  useEffect(() => {
    const msgs = [
      'Initializing ML models...',
      'Training Random Forest (50 trees)...',
      'Calibrating Neural Network...',
      'Loading account data...',
      'Ready.'
    ]
    let i = 0
    const iv = setInterval(() => {
      i++
      if (i < msgs.length) setLoadMsg(msgs[i])
      else { clearInterval(iv); setTimeout(() => setLoading(false), 300) }
    }, 360)
    return () => clearInterval(iv)
  }, [])

  const PageComponent = PAGES[page] || Dashboard

  return (
    <>
      <style>{styles}</style>
      {loading && (
        <div className="loader-overlay">
          <div className="loader-logo">ReActivate AI</div>
          <div className="loader-sub">Dormant Account Intelligence Platform</div>
          <div className="loader-bar-wrap"><div className="loader-bar" /></div>
          <div className="loader-status">{loadMsg}</div>
        </div>
      )}
      {!loading && (
        <div className="app-shell">
          <Sidebar activePage={page} onNavigate={setPage} />
          <div className="main-area">
            <Topbar page={page} />
            <div className="page-content">
              <PageComponent onNavigate={setPage} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
