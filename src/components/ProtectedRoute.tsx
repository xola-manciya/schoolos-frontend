import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User } from '../types'
import { useIsPlatformAdmin, useFeatureFlags } from '../hooks/useFeatureFlags'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User['role'][]
  requirePlatformAdmin?: boolean
  featureKey?: string
}

export default function ProtectedRoute({ children, allowedRoles, requirePlatformAdmin, featureKey }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  const isPlatformAdmin = useIsPlatformAdmin()
  const { isFeatureEnabled } = useFeatureFlags()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user needs to complete school registration (unless they're a platform admin)
  if (!requirePlatformAdmin && user?.needs_school_setup && !isPlatformAdmin) {
    return <Navigate to="/complete-registration" replace />
  }

  // Check platform admin requirement
  if (requirePlatformAdmin && !isPlatformAdmin) {
    return <Navigate to="/app" replace />
  }

  // Platform admins bypass feature flag checks and role checks
  if (isPlatformAdmin) {
    return <>{children}</>
  }

  // Check if feature is enabled (if featureKey is provided)
  if (featureKey && !isFeatureEnabled(featureKey)) {
    return <Navigate to="/app" replace />
  }

  // Check if user's role is allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their dashboard
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
