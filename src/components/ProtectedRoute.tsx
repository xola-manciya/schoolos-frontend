import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user's role is allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their dashboard
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
