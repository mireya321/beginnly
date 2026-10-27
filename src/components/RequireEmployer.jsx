import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function RequireEmployer({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="p-16 text-center text-sm text-muted">Loading…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}