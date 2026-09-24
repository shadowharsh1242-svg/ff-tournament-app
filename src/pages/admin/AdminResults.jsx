import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { AdminNav } from '../../components/AdminNav'

export default function AdminResults() {
  const [tournaments, setTournaments] = useState([])
  const [selected, setSelected] = useState('')
  const [regs, setRegs] = useState([])
  const [results, setResults] = useState({})

  useEffect(() => {
    supabase.from('tournaments').select('*').order('match_datetime', { ascending: false })
      .then(({ data }) => setTournaments(data || []))
  }, [])

  useEffect(() => {
    if (!selected) return
    async function load() {
      const { data: regData } = await supabase
        .from('registrations').select('*').eq('tournament_id', selected)
      setRegs(regData || [])

      const { data: resData } = await supabase
        .from('results').select('*').eq('tournament_id', selected)
      const map = {}
      resData?.forEach(r => { map[r.user_id] = r })
      setResults(map)
    }
    load()
  }, [selected])

  function updateField(userId, field, value) {
    setResults(prev => ({
      ...prev,
      [userId]: { ...prev[userId], user_id: userId, tournament_id: selected, [field]: value }
    }))
  }

  async function saveRow(userId, lock = false) {
    const row = results[userId]
    const t = tournaments.find(t => t.id === selected)
    const kills = row?.kills || 0
    const points_earned = row?.points_earned ?? kills * (t?.per_kill_points || 0)

    await supabase.from('results').upsert({
      tournament_id: selected,
      user_id: userId,
      kills,
      placement: row?.placement || null,
      points_earned,
      locked: lock
    }, { onConflict: 'tournament_id,user_id' })
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Match Results</h1>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Select a tournament...</option>
          {tournaments.map(t => <option key={t.id} value={t.id}>{t.title} — {new Date(t.match_datetime).toLocaleDateString()}</option>)}
        </select>

        {selected && (
          <table className="admin-table">
            <thead><tr><th>FF IGN</th><th>Kills</th><th>Placement</th><th>Points</th><th></th></tr></thead>
            <tbody>
              {regs.map(r => {
                const row = results[r.user_id] || {}
                return (
                  <tr key={r.user_id}>
                    <td>{r.ff_ign}</td>
                    <td><input type="number" value={row.kills || 0} onChange={e => updateField(r.user_id, 'kills', +e.target.value)} /></td>
                    <td><input type="number" value={row.placement || ''} onChange={e => updateField(r.user_id, 'placement', +e.target.value)} /></td>
                    <td><input type="number" value={row.points_earned ?? ''} onChange={e => updateField(r.user_id, 'points_earned', +e.target.value)} /></td>
                    <td>
                      <button className="link-btn" onClick={() => saveRow(r.user_id, false)}>Save</button>
                      <button className="link-btn" disabled={row.locked} onClick={() => saveRow(r.user_id, true)}>
                        {row.locked ? 'Locked ✅' : 'Lock & Credit'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {regs.length === 0 && <tr><td colSpan={5} className="muted">No registrations for this tournament.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
