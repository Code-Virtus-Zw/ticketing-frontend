import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '\u2302' },
  { path: '/events', label: 'Events', icon: '\u2605' },
  { path: '/bookings', label: 'Bookings', icon: '\u2630' },
  { path: '/verifications', label: 'Verifications', icon: '\u2713' },
  { path: '/reports', label: 'Reports', icon: '\u2261' },
  { path: '/sync', label: 'Sync', icon: '\u21BB' },
  { path: '/settings', label: 'Settings', icon: '\u2699' },
]

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>HKD Admin</h1>
          <p>Super Admin Panel</p>
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/'}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <div className="user-name">{user?.display_name || user?.login}</div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  )
}
