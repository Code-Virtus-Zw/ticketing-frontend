import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboardStats()
      .then((data) => setStats(data.data || data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your HKD Events system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.total_events ?? stats?.events ?? '-'}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.total_attendees ?? stats?.attendees ?? '-'}</div>
          <div className="stat-label">Total Attendees</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.today_checkins ?? stats?.today_verifications ?? '-'}</div>
          <div className="stat-label">Today Check-ins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.pending_sync ?? stats?.pending_sync_items ?? '-'}</div>
          <div className="stat-label">Pending Sync</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick Actions</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/events" className="btn btn-primary">Manage Events</a>
          <a href="/bookings" className="btn btn-outline">View Bookings</a>
          <a href="/sync" className="btn btn-outline">Check Sync Status</a>
          <a href="/reports" className="btn btn-outline">View Reports</a>
        </div>
      </div>
    </div>
  )
}
