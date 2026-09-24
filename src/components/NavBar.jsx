import { NavLink } from 'react-router-dom'

export function NavBar() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>🏠<span>Home</span></NavLink>
      <NavLink to="/tournaments">🏆<span>Tournaments</span></NavLink>
      <NavLink to="/points">🪙<span>Points</span></NavLink>
      <NavLink to="/profile">👤<span>Profile</span></NavLink>
    </nav>
  )
}
