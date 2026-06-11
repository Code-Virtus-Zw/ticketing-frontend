import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { api } from './api/client'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Verifications from './pages/Verifications'
import Reports from './pages/Reports'
import SyncManagement from './pages/SyncManagement'
import Settings from './pages/Settings'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('hkd_admin_token')
    if (token) {
      api.getMe()
        .then((data) => {
          if (data.success) setUser(data.user)
          else localStorage.removeItem('hkd_admin_token')
        })
        .catch(() => localStorage.removeItem('hkd_admin_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading HKD Admin...</p>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />
  }

  return (
    <Layout user={user} onLogout={() => { localStorage.removeItem('hkd_admin_token'); setUser(null) }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<Events detail />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/verifications" element={<Verifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sync" element={<SyncManagement />} />
        <Route path="/settings" element={<Settings user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
