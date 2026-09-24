import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { NavBar } from '../components/NavBar'

export default function Points() {
  const { profile, session } = useAuth()
  const [txns, setTxns] = useState([])

  useEffect(() => {
    if (!session) return
    supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setTxns(data || []))
  }, [session])

  return (
    <div className="page">
      <header className="topbar"><h1>Points</h1></header>

      <div className="wallet-card">
        <div className="label">Total Balance</div>
        <div className="big-number">🪙 {profile?.points_balance ?? 0}</div>
        <div className="wallet-sub">
          <div>Bonus: {profile?.bonus_points ?? 0}</div>
        </div>
      </div>

      <h3>Recent Activity</h3>
      <div className="txn-list">
        {txns.map(tx => (
          <div key={tx.id} className="txn-row">
            <div>
              <div>{tx.description || tx.type}</div>
              <div className="muted small">{new Date(tx.created_at).toLocaleString()}</div>
            </div>
            <div className={tx.amount >= 0 ? 'positive' : 'negative'}>
              {tx.amount >= 0 ? '+' : ''}{tx.amount}
            </div>
          </div>
        ))}
        {txns.length === 0 && <p className="muted">No activity yet — join a tournament to start earning.</p>}
      </div>

      <NavBar />
    </div>
  )
}
