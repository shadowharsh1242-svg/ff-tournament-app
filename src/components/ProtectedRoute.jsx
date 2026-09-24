import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export function ProtectedRoute({ children, adminOnly = false }) {
  const { session, profile, loading, isAdmin } = useAuth()

  if (loading) return <div className="page-center">Loading...</div>
  if (!session) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  if (profile?.suspended) return <div className="page-center">Your account has been suspended. Contact support.</div>

  return children
}
