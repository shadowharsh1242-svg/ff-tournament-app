import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext'
import { AdminNav } from '../../components/AdminNav'

export default function AdminSupport() {
  const { session } = useAuth()
  const [tickets, setTickets] = useState([])
  const [active, setActive] = useState(null)
  const [replies, setReplies] = useState([])
  const [reply, setReply] = useState('')

  async function load() {
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false })
    setTickets(data || [])
  }
  useEffect(() => { load() }, [])

  async function openTicket(t) {
    setActive(t)
    const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', t.id).order('created_at')
    setReplies(data || [])
  }

  async function sendReply(e) {
    e.preventDefault()
    await supabase.from('ticket_replies').insert({ ticket_id: active.id, sender_id: session.user.id, message: reply })
    await supabase.from('support_tickets').update({ status: 'answered' }).eq('id', active.id)
    setReply('')
    openTicket(active)
    load()
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content admin-split">
        <div className="ticket-list">
          <h1>Support Tickets</h1>
          {tickets.map(t => (
            <div key={t.id} className={`menu-item ${active?.id === t.id ? 'active' : ''}`} onClick={() => openTicket(t)}>
              <span>{t.subject}</span>
              <span className={`tag ${t.status === 'open' ? 'tag-muted' : 'tag-live'}`}>{t.status}</span>
            </div>
          ))}
        </div>

        {active && (
          <div className="ticket-thread">
            <h2>{active.subject}</h2>
            {replies.map(r => <div key={r.id} className="txn-row"><div>{r.message}</div></div>)}
            <form onSubmit={sendReply} className="form">
              <textarea placeholder="Reply..." value={reply} onChange={e => setReply(e.target.value)} required />
              <button className="btn btn-primary">Send Reply</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
