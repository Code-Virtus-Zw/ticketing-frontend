import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Reports() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listEvents({ perPage: 100 })
      .then((data) => setEvents(data.items || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const totalCapacity = events.reduce((sum, e) => {
    const cap = e.stats?.total_capacity || 0
    return sum + cap
  }, 0)

  const totalSold = events.reduce((sum, e) => {
    const sold = e.stats?.sold || 0
    return sum + sold
  }, 0)

  const totalCheckedIn = events.reduce((sum, e) => {
    const used = e.stats?.used || 0
    return sum + used
  }, 0)

  if (loading) return <div className="loading">Loading reports...</div>

  return (
    <div>
      <div className="page-header">
        <h2>Reports</h2>
        <p>Sales and attendance reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCapacity}</div>
          <div className="stat-label">Total Capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalSold}</div>
          <div className="stat-label">Total Sold</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCheckedIn}</div>
          <div className="stat-label">Checked In</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0}%
          </div>
          <div className="stat-label">Sell-through Rate</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Per-Event Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Sold</th>
              <th>Checked In</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const stats = event.stats || {}
              return (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td><span className={`status-badge status-${event.status}`}>{event.status}</span></td>
                  <td>{stats.total_capacity || 0}</td>
                  <td>{stats.sold || 0}</td>
                  <td>{stats.used || 0}</td>
                  <td>{stats.remaining || 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
