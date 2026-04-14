import React from 'react'

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', sub: 'Portfolio metrics and recovery targets' },
  accounts: { title: 'Accounts', sub: 'Search, score, and review dormant accounts' },
  workforce: { title: 'Workforce', sub: 'Campaign effort and recovery planning' },
  analytics: { title: 'Analytics', sub: 'Model signals and outreach performance' },
  about: { title: 'About', sub: 'Project overview, features, and recovery workflow' },
}

const css = `
.topbar {
  min-height: var(--topbar-h);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 32px 14px;
  flex-shrink: 0;
}

.topbar-page-title {
  font-family: var(--font-head);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.6px;
  line-height: 1.05;
}

.topbar-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 6px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
}

.topbar-pill {
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
}

@media (max-width: 760px) {
  .topbar {
    padding: 18px 16px 10px;
    align-items: flex-start;
    flex-direction: column;
  }

  .topbar-page-title {
    font-size: 24px;
  }
}
`

export default function Topbar({ page }) {
  const { title, sub } = PAGE_TITLES[page] || PAGE_TITLES.dashboard

  return (
    <>
      <style>{css}</style>
      <div className="topbar">
        <div>
          <div className="topbar-page-title">{title}</div>
          <div className="topbar-sub">{sub}</div>
        </div>
        <div className="topbar-right">
          <div className="topbar-pill">Sample portfolio</div>
          <div className="topbar-pill">AI scored</div>
        </div>
      </div>
    </>
  )
}
