import React from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'workforce', label: 'Workforce' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'about', label: 'About' },
]

const css = `
.top-nav {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  background: rgba(9, 11, 10, 0.84);
  backdrop-filter: blur(18px);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: fit-content;
}

.brand-mark {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22), 0 10px 30px rgba(155,214,192,0.14);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  font-family: var(--font-head);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: var(--text-primary);
}

.brand-sub {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 2px;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  transition: var(--transition);
  border: 1px solid transparent;
  user-select: none;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-item.active {
  color: #07100d;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent));
  border-color: rgba(255,255,255,0.18);
}

@media (max-width: 780px) {
  .top-nav {
    height: auto;
    min-height: var(--nav-h);
    padding: 14px 16px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .nav-items {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
`

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <>
      <style>{css}</style>
      <header className="top-nav">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-copy">
            <div className="brand-title">ReActivate AI</div>
            <div className="brand-sub">Dormant Account Intel</div>
          </div>
        </div>
        <nav className="nav-items" aria-label="Main navigation">
          {NAV.map(n => (
            <div
              key={n.id}
              className={`nav-item${activePage === n.id ? ' active' : ''}`}
              onClick={() => onNavigate(n.id)}
            >
              {n.label}
            </div>
          ))}
        </nav>
      </header>
    </>
  )
}
