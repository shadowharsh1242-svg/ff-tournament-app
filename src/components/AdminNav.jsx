import { NavLink } from 'react-router-dom'

export function AdminNav() {
  return (
    <nav className="admin-nav">
      <NavLink to="/admin" end>📊 Dashboard</NavLink>
      <NavLink to="/admin/tournaments">🏆 Tournaments</NavLink>
      <NavLink to="/admin/results">🎮 Results</NavLink>
      <NavLink to="/admin/users">👥 Users</NavLink>
      <NavLink to="/admin/support">🆘 Support</NavLink>
      <NavLink to="/">← Back to app</NavLink>
    </nav>
  )
}
