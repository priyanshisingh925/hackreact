import React, { useEffect, useMemo, useState } from 'react'
import { apiUrl } from '../apiBase.js'

const css = `
.workforce-page {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr;
  gap: 18px;
}

.wf-stack {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.wf-card,
.agent-card,
.appointment-row,
.route-row,
.reserve-row {
  background: linear-gradient(145deg, rgba(31, 28, 25, 0.96), rgba(18, 17, 16, 0.94));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.wf-card {
  padding: 20px;
}

.wf-title {
  font-family: var(--font-head);
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
}

.wf-sub {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

.capacity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}

.capacity-box {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
}

.capacity-value {
  font-family: var(--font-head);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}

.capacity-label {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 4px;
}

.agent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.agent-card {
  padding: 14px;
}

.agent-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.agent-name {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 14px;
}

.agent-area {
  color: var(--text-muted);
  font-size: 11px;
  margin-top: 2px;
}

.agent-status {
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--success-light);
  color: var(--success);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.agent-status.busy {
  background: var(--warn-light);
  color: var(--warn);
}

.agent-meta {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-top: 14px;
}

.agent-meta div {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px;
}

.meta-label {
  color: var(--text-muted);
  font-size: 10px;
}

.meta-value {
  margin-top: 4px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
}

.route-list,
.appointment-list,
.reserve-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.route-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 14px;
  align-items: center;
}

.route-title,
.appointment-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 800;
}

.route-detail,
.appointment-detail {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

.route-count {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-light);
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 800;
}

.appointment-row {
  display: grid;
  grid-template-columns: 82px 1fr 150px;
  gap: 12px;
  align-items: center;
  padding: 14px;
}

.appointment-time {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
}

.appointment-agent {
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.appointment-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.appt-pill {
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--accent-light);
  color: var(--accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.appt-pill.needs {
  background: var(--warn-light);
  color: var(--warn);
}

.reserve-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 14px;
  align-items: center;
}

.reserve-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 800;
}

.reserve-detail {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

.reserve-value {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 1060px) {
  .workforce-page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .agent-grid,
  .capacity-grid {
    grid-template-columns: 1fr;
  }

  .appointment-row,
  .route-row {
    grid-template-columns: 1fr;
  }

  .appointment-agent {
    white-space: normal;
  }

  .appointment-meta {
    align-items: flex-start;
  }

  .reserve-row {
    grid-template-columns: 1fr;
  }
}
`

const AGENTS = [
  { name: 'Asha Rao', state: 'Maharashtra', city: 'Mumbai', capacity: 7, booked: 4, available: true, languages: 'Hindi, Marathi' },
  { name: 'Farhan Ali', state: 'Maharashtra', city: 'Pune', capacity: 6, booked: 5, available: true, languages: 'Hindi, Marathi' },
  { name: 'Devika More', state: 'Maharashtra', city: 'Nagpur', capacity: 7, booked: 2, available: true, languages: 'Marathi, Hindi' },
  { name: 'Meera Nair', state: 'Karnataka', city: 'Bengaluru', capacity: 8, booked: 3, available: true, languages: 'Kannada, English' },
  { name: 'Nikhil Hegde', state: 'Karnataka', city: 'Mysuru', capacity: 6, booked: 2, available: true, languages: 'Kannada, English' },
  { name: 'Rohan Shetty', state: 'Karnataka', city: 'Hubballi', capacity: 6, booked: 5, available: true, languages: 'Kannada, Hindi' },
  { name: 'S. Karthik', state: 'Tamil Nadu', city: 'Chennai', capacity: 6, booked: 6, available: false, languages: 'Tamil, English' },
  { name: 'Revathi Iyer', state: 'Tamil Nadu', city: 'Coimbatore', capacity: 7, booked: 3, available: true, languages: 'Tamil, English' },
  { name: 'Manoj Pillai', state: 'Tamil Nadu', city: 'Madurai', capacity: 5, booked: 2, available: true, languages: 'Tamil' },
  { name: 'Neha Desai', state: 'Gujarat', city: 'Ahmedabad', capacity: 7, booked: 2, available: true, languages: 'Gujarati, Hindi' },
  { name: 'Darshan Patel', state: 'Gujarat', city: 'Surat', capacity: 6, booked: 3, available: true, languages: 'Gujarati, Hindi' },
  { name: 'Kavya Mehta', state: 'Gujarat', city: 'Vadodara', capacity: 5, booked: 1, available: true, languages: 'Gujarati, English' },
  { name: 'Arjun Singh', state: 'Uttar Pradesh', city: 'Lucknow', capacity: 8, booked: 4, available: true, languages: 'Hindi' },
  { name: 'Nidhi Verma', state: 'Uttar Pradesh', city: 'Varanasi', capacity: 7, booked: 5, available: true, languages: 'Hindi' },
  { name: 'Kabir Choudhary', state: 'Uttar Pradesh', city: 'Kanpur', capacity: 6, booked: 2, available: true, languages: 'Hindi' },
  { name: 'Riya Sen', state: 'West Bengal', city: 'Kolkata', capacity: 5, booked: 4, available: true, languages: 'Bengali, Hindi' },
  { name: 'Subho Das', state: 'West Bengal', city: 'Siliguri', capacity: 6, booked: 3, available: true, languages: 'Bengali, Hindi' },
  { name: 'Ishita Roy', state: 'West Bengal', city: 'Asansol', capacity: 5, booked: 1, available: true, languages: 'Bengali' },
  { name: 'Imran Khan', state: 'Telangana', city: 'Hyderabad', capacity: 6, booked: 3, available: true, languages: 'Telugu, Hindi' },
  { name: 'Sravani Reddy', state: 'Telangana', city: 'Warangal', capacity: 6, booked: 2, available: true, languages: 'Telugu, English' },
  { name: 'Venu Rao', state: 'Telangana', city: 'Karimnagar', capacity: 5, booked: 4, available: true, languages: 'Telugu, Hindi' },
  { name: 'Bhavna Joshi', state: 'Rajasthan', city: 'Jaipur', capacity: 7, booked: 4, available: true, languages: 'Hindi, Marwari' },
  { name: 'Gaurav Bhat', state: 'Rajasthan', city: 'Jodhpur', capacity: 6, booked: 2, available: true, languages: 'Hindi, Marwari' },
  { name: 'Pooja Menon', state: 'Rajasthan', city: 'Udaipur', capacity: 5, booked: 5, available: false, languages: 'Hindi' },
]

function fmt(n = 0) {
  if (n >= 10000000) return `INR ${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `INR ${(n / 100000).toFixed(1)} L`
  return `INR ${Number(n).toLocaleString('en-IN')}`
}

export default function Workforce() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    fetch(apiUrl('/api/accounts?status=DORMANT&sortBy=balanceDesc&limit=240'))
      .then(r => r.json())
      .then(data => setAccounts(data.accounts || []))
      .catch(console.error)
  }, [])

  const states = useMemo(() => {
    const byState = {}
    accounts.forEach(acc => {
      if (!byState[acc.state]) byState[acc.state] = { accounts: 0, highRisk: 0, balance: 0 }
      byState[acc.state].accounts += 1
      byState[acc.state].balance += acc.balance || 0
      if (acc.riskLevel === 'HIGH' || acc.deafRisk) byState[acc.state].highRisk += 1
    })

    return Object.entries(byState)
      .map(([state, data]) => {
        const agents = AGENTS.filter(agent => agent.state === state)
        const slots = agents.reduce((sum, agent) => sum + Math.max(agent.capacity - agent.booked, 0), 0)
        return { state, ...data, agents, slots }
      })
      .sort((a, b) => b.highRisk - a.highRisk || b.accounts - a.accounts)
  }, [accounts])

  const availableAgents = AGENTS.filter(agent => agent.available && agent.booked < agent.capacity)
  const highValueAccounts = [...accounts]
    .sort((a, b) => (b.balance || 0) - (a.balance || 0) || (b.aiScore || 0) - (a.aiScore || 0))
    .slice(0, 8)
  const bookedAppointments = highValueAccounts.slice(0, 6).map((acc, index) => {
    const sameStateAgents = AGENTS.filter(a => a.state === acc.state && a.available && a.booked < a.capacity)
    const agent = sameStateAgents[0] || availableAgents[index % availableAgents.length] || AGENTS[0]
    const hour = 10 + Math.floor(index / 2)
    const minute = index % 2 === 0 ? '00' : '30'
    return {
      account: acc,
      agent,
      time: `${hour}:${minute}`,
      status: index < 4 ? 'Booked' : 'Pending',
      requiresAppointment: acc.balance >= 500000 || acc.deafRisk || acc.riskLevel === 'HIGH',
      destination: acc.branch || `${acc.state} - Main Branch`
    }
  })

  const totalSlots = AGENTS.reduce((sum, agent) => sum + Math.max(agent.capacity - agent.booked, 0), 0)
  const urgentAccounts = accounts.filter(acc => acc.riskLevel === 'HIGH' || acc.deafRisk).length
  const coveredUrgent = states.reduce((sum, state) => sum + Math.min(state.highRisk, state.slots), 0)

  return (
    <>
      <style>{css}</style>
      <div className="workforce-page">
        <div className="wf-stack">
          <div className="wf-card">
            <div className="wf-title">Field Capacity</div>
            <div className="wf-sub">Who is available today and how much urgent work can be covered by territory.</div>
            <div className="capacity-grid">
              <div className="capacity-box">
                <div className="capacity-value">{availableAgents.length}</div>
                <div className="capacity-label">Agents available</div>
              </div>
              <div className="capacity-box">
                <div className="capacity-value">{totalSlots}</div>
                <div className="capacity-label">Open visit slots</div>
              </div>
              <div className="capacity-box">
                <div className="capacity-value">{coveredUrgent}/{urgentAccounts}</div>
                <div className="capacity-label">Urgent accounts coverable</div>
              </div>
            </div>
          </div>

          <div className="wf-card">
            <div className="wf-title">Available Agents</div>
            <div className="wf-sub">Capacity is shown as booked visits against today's route limit.</div>
            <div className="agent-grid">
              {AGENTS.map(agent => (
                <div className="agent-card" key={agent.name}>
                  <div className="agent-top">
                    <div>
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-area">{agent.city}, {agent.state}</div>
                    </div>
                    <div className={`agent-status${agent.available && agent.booked < agent.capacity ? '' : ' busy'}`}>
                      {agent.available && agent.booked < agent.capacity ? 'Open' : 'Full'}
                    </div>
                  </div>
                  <div className="agent-meta">
                    <div>
                      <div className="meta-label">Booked</div>
                      <div className="meta-value">{agent.booked}/{agent.capacity}</div>
                    </div>
                    <div>
                      <div className="meta-label">Slots</div>
                      <div className="meta-value">{Math.max(agent.capacity - agent.booked, 0)}</div>
                    </div>
                    <div>
                      <div className="meta-label">Language</div>
                      <div className="meta-value">{agent.languages.split(', ')[0]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wf-stack">
          <div className="wf-card">
            <div className="wf-title">Where To Send Agents</div>
            <div className="wf-sub">States are prioritized by urgent accounts, local agent capacity, dormant balance, and branch destination.</div>
            <div className="route-list">
              {states.slice(0, 8).map(route => (
                <div className="route-row" key={route.state}>
                  <div>
                    <div className="route-title">{route.state}</div>
                    <div className="route-detail">
                      {route.highRisk} urgent accounts, {route.slots} open field slots, {fmt(route.balance)} dormant balance. Send to nearest active branch cluster.
                    </div>
                  </div>
                  <div className="route-count">{route.agents.length}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="wf-card">
            <div className="wf-title">Reserved High-Value Visits</div>
            <div className="wf-sub">Largest balances are assigned first to agents with matching territory capacity.</div>
            <div className="reserve-list">
              {highValueAccounts.slice(0, 5).map((account, index) => {
                const agent = AGENTS.find(a => a.state === account.state && a.available && a.booked < a.capacity) || availableAgents[index % availableAgents.length] || AGENTS[0]
                return (
                  <div className="reserve-row" key={account.id}>
                    <div>
                      <div className="reserve-name">{account.name} - {agent.name}</div>
                      <div className="reserve-detail">{account.branch} - appointment {account.balance >= 500000 ? 'required' : 'optional'} - {account.dormancyYears}y dormant</div>
                    </div>
                    <div className="reserve-value">{fmt(account.balance)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="wf-card">
            <div className="wf-title">Booked Appointments</div>
            <div className="wf-sub">Sample appointment plan generated from highest-value dormant accounts.</div>
            <div className="appointment-list">
              {bookedAppointments.map(({ account, agent, time, status, requiresAppointment, destination }) => (
                <div className="appointment-row" key={account.id}>
                  <div className="appointment-time">{time}</div>
                  <div>
                    <div className="appointment-name">{account.name}</div>
                    <div className="appointment-detail">Going to {destination} - {account.dormancyYears} years dormant - {fmt(account.balance)}</div>
                  </div>
                  <div className="appointment-meta">
                    <div className="appointment-agent">{agent.name}</div>
                    <div className={`appt-pill${requiresAppointment ? ' needs' : ''}`}>{requiresAppointment ? 'Requires appointment' : status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
