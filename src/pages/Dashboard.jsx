import { useState, useEffect } from 'react'
import { api } from '../api/client'

function EyeIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <path d="M1 1l22 22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  )
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder, minLength, autoComplete }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="password-input">
        <input
          type={show ? 'text' : 'password'}
          className="form-control" placeholder={placeholder} required
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
        <button type="button" className="password-toggle" onClick={onToggle}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}>
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
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
          <PasswordField
            label="Current Password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            show={showPw.current}
            onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
            placeholder="Enter your current password"
            autoComplete="current-password"
          />
          <PasswordField
            label="New Password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            show={showPw.new}
            onToggle={() => setShowPw({ ...showPw, new: !showPw.new })}
            placeholder="At least 6 characters"
            minLength={6}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm New Password"
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            show={showPw.confirm}
            onToggle={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
            placeholder="Repeat your new password"
            minLength={6}
            autoComplete="new-password"
          />
          <button type="submit" className="btn btn-primary" disabled={changing}>
            {changing ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
