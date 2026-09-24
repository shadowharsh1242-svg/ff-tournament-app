import { Link } from 'react-router-dom'

export function TournamentCard({ t }) {
  const spotsLeft = t.max_slots - t.filled_slots
  const when = new Date(t.match_datetime).toLocaleString()

  return (
    <div className="card">
      <div className="card-tags">
        <span className="tag tag-purple">{t.mode}</span>
        <span className="tag tag-orange">{t.map}</span>
        <span className={`tag ${t.status === 'live' ? 'tag-live' : 'tag-muted'}`}>{t.status}</span>
      </div>
      <h3>{t.title}</h3>
      <div className="card-row">
        <div>
          <div className="label">Match Time</div>
          <div>{when}</div>
        </div>
        <div>
          <div className="label">Prize Pool</div>
          <div className="highlight">{t.prize_pool_points} pts</div>
        </div>
        <div>
          <div className="label">Per Kill</div>
          <div>{t.per_kill_points} pts</div>
        </div>
      </div>
      <div className="card-row">
        <div className="slots-bar">
          <div className="slots-fill" style={{ width: `${(t.filled_slots / t.max_slots) * 100}%` }} />
        </div>
        <span>{spotsLeft} spots left</span>
      </div>
      <Link className="btn btn-primary" to={`/tournaments/${t.id}`}>View / Join</Link>
    </div>
  )
}
