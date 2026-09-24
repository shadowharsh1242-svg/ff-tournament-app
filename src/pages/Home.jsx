import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { TournamentCard } from '../components/TournamentCard'
import { NavBar } from '../components/NavBar'

export default function Home() {
  const { profile } = useAuth()
  const [tournaments, setTournaments] = useState([])

  useEffect(() => {
    supabase
      .from('tournaments')
      .select('*')
      .in('status', ['upcoming', 'live'])
      .order('match_datetime', { ascending: true })
      .limit(5)
      .then(({ data }) => setTournaments(data || []))
  }, [])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">🎮 FF Tournament App</div>
        <div className="points-pill">🪙 {profile?.points_balance ?? 0}</div>
      </header>

      <section>
        <h2>Upcoming & Live Tournaments</h2>
        <div className="grid">
          {tournaments.map(t => <TournamentCard key={t.id} t={t} />)}
          {tournaments.length === 0 && <p className="muted">No tournaments right now — check back soon.</p>}
        </div>
        <Link to="/tournaments" className="link-btn">See all tournaments →</Link>
      </section>

      <NavBar />
    </div>
  )
}
