import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { AdminNav } from '../../components/AdminNav'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, activeTournaments: 0, registrations: 0, matches: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: users }, { count: activeTournaments }, { count: registrations }, { count: matches }] =
        await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('tournaments').select('*', { count: 'exact', head: true }).in('status', ['upcoming', 'live']),
          supabase.from('registrations').select('*', { count: 'exact', head: true }),
          supabase.from('results').select('*', { count: 'exact', head: true })
        ])
      setStats({ users: users || 0, activeTournaments: activeTournaments || 0, registrations: registrations || 0, matches: matches || 0 })
    }
    load()
  }, [])

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card"><div className="label">Total Users</div><div className="big-number">{stats.users}</div></div>
          <div className="stat-card"><div className="label">Active Tournaments</div><div className="big-number">{stats.activeTournaments}</div></div>
          <div className="stat-card"><div className="label">Registrations</div><div className="big-number">{stats.registrations}</div></div>
          <div className="stat-card"><div className="label">Matches Logged</div><div className="big-number">{stats.matches}</div></div>
        </div>
        <p className="muted">Revenue/financial reporting is intentionally left out — this build runs on a non-cash points system.</p>
      </div>
    </div>
  )
}
