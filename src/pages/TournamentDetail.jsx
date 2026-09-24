import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function TournamentDetail() {
  const { id } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [t, setT] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [ffIgn, setFfIgn] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data: tour } = await supabase.from('tournaments').select('*').eq('id', id).single()
    setT(tour)
    if (session) {
      const { data: reg } = await supabase
        .from('registrations').select('*')
        .eq('tournament_id', id).eq('user_id', session.user.id).maybeSingle()
      setRegistration(reg)
    }
  }

  useEffect(() => { load() }, [id, session])

  async function joinTournament(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('registrations').insert({
      tournament_id: id, user_id: session.user.id, ff_ign: ffIgn
    })
    if (error) return setError(error.message)
    load()
  }

  if (!t) return <div className="page-center">Loading...</div>

  const full = t.filled_slots >= t.max_slots

  return (
    <div className="page">
      <button className="link-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1>{t.title}</h1>
      <div className="card-tags">
        <span className="tag tag-purple">{t.mode}</span>
        <span className="tag tag-orange">{t.map}</span>
        <span className="tag tag-muted">{t.status}</span>
      </div>

      <div className="detail-grid">
        <div><span className="label">Match Time</span><div>{new Date(t.match_datetime).toLocaleString()}</div></div>
        <div><span className="label">Prize Pool</span><div>{t.prize_pool_points} pts</div></div>
        <div><span className="label">Per Kill</span><div>{t.per_kill_points} pts</div></div>
        <div><span className="label">Slots</span><div>{t.filled_slots}/{t.max_slots}</div></div>
      </div>

      {t.rules && <><h3>Rules</h3><p>{t.rules}</p></>}

      {!session && <p className="muted">Log in to join this tournament.</p>}

      {session && !registration && (
        <form onSubmit={joinTournament} className="form">
          <input
            placeholder="Your Free Fire in-game name"
            value={ffIgn}
            onChange={e => setFfIgn(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={full || t.status !== 'upcoming'}>
            {full ? 'Tournament Full' : 'Join Free'}
          </button>
        </form>
      )}

      {registration && (
        <div className="room-box">
          <h3>You're registered ✅</h3>
          <p>FF IGN: {registration.ff_ign}</p>
          {t.room_id ? (
            <>
              <p><strong>Room ID:</strong> {t.room_id}</p>
              <p><strong>Password:</strong> {t.room_password}</p>
            </>
          ) : (
            <p className="muted">Room ID & password will appear here closer to match time.</p>
          )}
        </div>
      )}
    </div>
  )
}
