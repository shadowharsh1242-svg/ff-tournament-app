import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { TournamentCard } from '../components/TournamentCard'
import { NavBar } from '../components/NavBar'

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([])
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    let query = supabase.from('tournaments').select('*').order('match_datetime', { ascending: true })
    if (filter !== 'all') query = query.eq('status', filter)
    query.then(({ data }) => setTournaments(data || []))
  }, [filter])

  return (
    <div className="page">
      <header className="topbar">
        <h1>Tournaments</h1>
      </header>

      <div className="filter-row">
        {['upcoming', 'live', 'completed', 'all'].map(f => (
          <button key={f} className={`chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid">
        {tournaments.map(t => <TournamentCard key={t.id} t={t} />)}
        {tournaments.length === 0 && <p className="muted">No tournaments in this filter.</p>}
      </div>

      <NavBar />
    </div>
  )
}
