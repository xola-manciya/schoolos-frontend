import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User } from '../types'
import { useIsPlatformAdmin } from '../hooks/useFeatureFlags'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][]
  requirePlatformAdmin?: boolean
}

export default function ProtectedRoute({ children, allowedRoles, requirePlatformAdmin }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const isPlatformAdmin = useIsPlatformAdmin()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check platform admin requirement
  if (requirePlatformAdmin && !isPlatformAdmin) {
    return <Navigate to="/app" replace />
  }

  // Platform admins bypass role checks
  if (isPlatformAdmin) {
    return <>{children}</>
  }

  // Check if user's role is allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their dashboard
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
