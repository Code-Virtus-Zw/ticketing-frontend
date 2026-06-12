import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMessage, setPwMessage] = useState(null)
  const [pwError, setPwError] = useState(null)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    api.getDashboardStats()
      .then((data) => setStats(data.data || data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwMessage(null)
    setPwError(null)

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }

    setChanging(true)
    try {
      await api.changePassword(pwForm.currentPassword, pwForm.newPassword)
      setPwMessage('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message)
    } finally {
      setChanging(false)
    }
  }

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

      <div className="card password-section">
        <div className="card-title">Change Password</div>
        {pwMessage && <div className="alert alert-success">{pwMessage}</div>}
        {pwError && <div className="alert alert-error">{pwError}</div>}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password" className="form-control" placeholder="Enter your current password" required
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password" className="form-control" placeholder="At least 6 characters" required minLength={6}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password" className="form-control" placeholder="Repeat your new password" required minLength={6}
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={changing}>
            {changing ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
