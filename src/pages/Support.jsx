import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function Support() {
  const { session } = useAuth()
  const [subject, setSubject] = useState('')
  const [tickets, setTickets] = useState([])
  const [msg, setMsg] = useState('')

  async function load() {
    const { data } = await supabase
      .from('support_tickets').select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    setTickets(data || [])
  }

  useEffect(() => { if (session) load() }, [session])

  async function submit(e) {
    e.preventDefault()
    await supabase.from('support_tickets').insert({ user_id: session.user.id, subject })
    setSubject('')
    setMsg('Ticket submitted — our team will reply soon.')
    load()
  }

  return (
    <div className="page">
      <h1>Help & Support</h1>
      <form onSubmit={submit} className="form">
        <input placeholder="What do you need help with?" value={subject} onChange={e => setSubject(e.target.value)} required />
        <button className="btn btn-primary">Submit Ticket</button>
      </form>
      {msg && <p className="muted">{msg}</p>}

      <h3>Your Tickets</h3>
      {tickets.map(t => (
        <div key={t.id} className="menu-item">
          <span>{t.subject}</span>
          <span className={`tag ${t.status === 'open' ? 'tag-muted' : 'tag-live'}`}>{t.status}</span>
        </div>
      ))}
    </div>
  )
}
