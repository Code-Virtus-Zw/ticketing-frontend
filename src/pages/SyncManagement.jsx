import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function SyncManagement() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  function loadStatus() {
    setLoading(true)
    api.getSyncStatus()
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadStatus() }, [])

  async function triggerSync() {
    setSyncing(true)
    setMessage('')
    try {
      const data = await api.triggerSync()
      setMessage(data.message || 'Sync triggered.')
      setTimeout(loadStatus, 2000)
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return <div className="loading">Loading sync status...</div>

  const states = status?.sync_states || {}
  const lastSync = status?.last_sync || {}

  return (
    <div>
      <div className="page-header">
        <h2>Sync Management</h2>
        <p>Manage WordPress synchronization</p>
      </div>

      <div className="card">
        <div className="card-title">Synchronization Status</div>
        <div className={`sync-status ${status?.status || 'idle'}`}>
          {status?.status === 'syncing' ? '\u23F3 Syncing...' : '\u2713 System operational'}
        </div>
        <p><strong>Queue Items:</strong> {status?.queue_count ?? 0} pending</p>
      </div>

      <div className="card">
        <div className="card-title">Sync States</div>
        <table>
          <thead>
            <tr>
              <th>Entity Type</th>
              <th>Status</th>
              <th>Last Synced</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(states).map(([type, state]) => (
              <tr key={type}>
                <td>{type}</td>
                <td><span className={`status-badge status-${state.status === 'idle' ? 'issued' : state.status === 'syncing' ? 'pending' : 'error'}`}>{state.status}</span></td>
                <td>{state.last_synced_at || 'Never'}</td>
                <td style={{ color: 'var(--danger)' }}>{state.error || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title">Actions</div>
        <button className="btn btn-primary" onClick={triggerSync} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Trigger Full Sync'}
        </button>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  )
}
