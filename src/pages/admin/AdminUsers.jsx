import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { AdminNav } from '../../components/AdminNav'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  async function load() {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('username', `%${search}%`)
    const { data } = await query
    setUsers(data || [])
  }

  useEffect(() => { load() }, [search])

  async function toggleSuspend(u) {
    await supabase.from('profiles').update({ suspended: !u.suspended }).eq('id', u.id)
    load()
  }

  async function adjustPoints(u) {
    const amount = prompt(`Adjust points for ${u.username} (use negative to deduct):`)
    const val = parseInt(amount, 10)
    if (!val) return
    await supabase.from('points_transactions').insert({
      user_id: u.id, type: 'admin_adjust', amount: val, description: 'Manual admin adjustment'
    })
    await supabase.from('profiles').update({ points_balance: u.points_balance + val }).eq('id', u.id)
    load()
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Users</h1>
        <input placeholder="Search by username..." value={search} onChange={e => setSearch(e.target.value)} />

        <table className="admin-table">
          <thead><tr><th>Username</th><th>Points</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.points_balance}</td>
                <td>{u.role}</td>
                <td>{u.suspended ? 'Suspended' : 'Active'}</td>
                <td>
                  <button className="link-btn" onClick={() => adjustPoints(u)}>Adjust Points</button>
                  <button className="link-btn danger" onClick={() => toggleSuspend(u)}>
                    {u.suspended ? 'Restore' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
