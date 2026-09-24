import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [mode, setMode] = useState('signin')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { username } }
      })
      if (error) return setError(error.message)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return setError(error.message)
    }
    navigate('/')
  }

  return (
    <div className="page-center">
      <div className="auth-card">
        <h1>GT Battle-style Tournaments</h1>
        <p className="muted">Always free-entry tournaments</p>

        <button className="btn btn-google" onClick={handleGoogle}>Continue with Google</button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit} className="form">
          {mode === 'signup' && (
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit">
            {mode === 'signup' ? 'Create account' : 'Login'}
          </button>
        </form>

        <button className="link-btn" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? 'Already have an account? Login' : "New here? Create an account"}
        </button>
      </div>
    </div>
  )
}
