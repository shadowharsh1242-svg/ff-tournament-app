import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { NavBar } from '../components/NavBar'

export default function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="page">
      <header className="topbar"><h1>Profile</h1></header>

      <div className="profile-card">
        <div className="avatar-circle">{profile?.username?.[0]?.toUpperCase() || '?'}</div>
        <div>
          <div className="profile-name">{profile?.username}</div>
          <div className="muted small">FF UID: {profile?.ff_uid || 'Not set'}</div>
        </div>
      </div>

      <div className="menu-list">
        <Link to="/support" className="menu-item">🆘 Help & Support <span>→</span></Link>
        <a href="/privacy.html" className="menu-item">🔒 Privacy Policy <span>→</span></a>
        <a href="/terms.html" className="menu-item">📄 Terms & Conditions <span>→</span></a>
        <button className="menu-item danger" onClick={handleLogout}>🚪 Logout <span>→</span></button>
      </div>

      <NavBar />
    </div>
  )
}
