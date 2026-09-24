import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext'
import { AdminNav } from '../../components/AdminNav'

const empty = {
  title: '', mode: 'Solo', map: 'Bermuda', max_slots: 100,
  prize_pool_points: 100, per_kill_points: 0, match_datetime: '',
  room_id: '', room_password: '', rules: '', status: 'upcoming'
}

export default function AdminTournaments() {
  const { session } = useAuth()
  const [list, setList] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    const { data } = await supabase.from('tournaments').select('*').order('match_datetime', { ascending: false })
    setList(data || [])
  }
  useEffect(() => { load() }, [])

  function edit(t) {
    setEditingId(t.id)
    setForm({ ...t, match_datetime: t.match_datetime?.slice(0, 16) })
  }

  function resetForm() {
    setEditingId(null)
    setForm(empty)
  }

  async function save(e) {
    e.preventDefault()
    const payload = { ...form, created_by: session.user.id }
    if (editingId) {
      await supabase.from('tournaments').update(payload).eq('id', editingId)
    } else {
      await supabase.from('tournaments').insert(payload)
    }
    resetForm()
    load()
  }

  async function remove(id) {
    if (!confirm('Delete this tournament?')) return
    await supabase.from('tournaments').delete().eq('id', id)
    load()
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <h1>Tournaments</h1>

        <form onSubmit={save} className="form admin-form">
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <div className="form-row">
            <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
              <option>Solo</option><option>Duo</option><option>Squad</option>
            </select>
            <input placeholder="Map" value={form.map} onChange={e => setForm({ ...form, map: e.target.value })} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="upcoming">upcoming</option>
              <option value="live">live</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div className="form-row">
            <input type="number" placeholder="Max slots" value={form.max_slots} onChange={e => setForm({ ...form, max_slots: +e.target.value })} />
            <input type="number" placeholder="Prize pool (points)" value={form.prize_pool_points} onChange={e => setForm({ ...form, prize_pool_points: +e.target.value })} />
            <input type="number" placeholder="Per kill (points)" value={form.per_kill_points} onChange={e => setForm({ ...form, per_kill_points: +e.target.value })} />
          </div>
          <input type="datetime-local" value={form.match_datetime} onChange={e => setForm({ ...form, match_datetime: e.target.value })} required />
          <div className="form-row">
            <input placeholder="Room ID" value={form.room_id || ''} onChange={e => setForm({ ...form, room_id: e.target.value })} />
            <input placeholder="Room Password" value={form.room_password || ''} onChange={e => setForm({ ...form, room_password: e.target.value })} />
          </div>
          <textarea placeholder="Rules" value={form.rules || ''} onChange={e => setForm({ ...form, rules: e.target.value })} />
          <div className="form-row">
            <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Create'} Tournament</button>
            {editingId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <table className="admin-table">
          <thead><tr><th>Title</th><th>Status</th><th>Slots</th><th>Match Time</th><th></th></tr></thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.status}</td>
                <td>{t.filled_slots}/{t.max_slots}</td>
                <td>{new Date(t.match_datetime).toLocaleString()}</td>
                <td>
                  <button className="link-btn" onClick={() => edit(t)}>Edit</button>
                  <button className="link-btn danger" onClick={() => remove(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
