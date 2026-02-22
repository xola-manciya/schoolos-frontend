import { useState, useEffect, useMemo, useCallback } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useFeatureFlags } from '../hooks/useFeatureFlags'
import api from '../lib/api'
import VerificationBanner from './VerificationBanner'
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PhotoIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  FlagIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showGraceWarning, setShowGraceWarning] = useState(false)
  const [graceDaysRemaining, setGraceDaysRemaining] = useState(0)
  const [showCanceledDialog, setShowCanceledDialog] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null)
  const [schoolName, setSchoolName] = useState<string>('')
  const { user, logout } = useAuthStore()
  // Use user from store directly instead of hook to avoid timing issues
  const isPlatformAdmin = user?.is_platform_admin === true
  const { isFeatureEnabled } = useFeatureFlags()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user needs to complete school setup
  useEffect(() => {
    if (user?.needs_school_setup && !isPlatformAdmin) {
      navigate('/school-details', { replace: true })
    }
  }, [user, isPlatformAdmin, navigate])

  // Check for subscription cancellation on mount
  useEffect(() => {
    const justCanceled = localStorage.getItem('subscription_just_canceled')
    if (justCanceled === 'true') {
      setShowCanceledDialog(true)
    }
  }, [])

  // Fetch school verification status
  useEffect(() => {
    const fetchSchoolStatus = async () => {
      // Platform admins don't have schools
      if (isPlatformAdmin) {
        setSchoolName('Platform Administration')
        return
      }
      
      try {
        const response = await api.get('/general/schools/me/', {
          // Suppress error logging for 404s on this endpoint
          validateStatus: (status) => status < 500
        })
        
        if (response.status === 404) {
          setSchoolName('Pending Setup')
          return
        }
        
        setVerificationStatus(response.data.verification_status)
        setSchoolName(response.data.name)
      } catch (error: any) {
        // Only log unexpected errors (not 404)
        if (error.response?.status !== 404) {
          console.error('Failed to fetch school status:', error)
        }
        setSchoolName('Pending Setup')
      }
    }

    if (user && !isPlatformAdmin) {
      fetchSchoolStatus()
    } else if (isPlatformAdmin) {
      setSchoolName('Platform Administration')
    }
  }, [user, isPlatformAdmin])

  // Check for trial expiration warning
  useEffect(() => {
    const checkTrialStatus = () => {
      const trialExpired = sessionStorage.getItem('trial_expired')
      const graceDays = sessionStorage.getItem('grace_days_remaining')
      
      if (trialExpired === 'true' && graceDays) {
        setShowGraceWarning(true)
        setGraceDaysRemaining(parseInt(graceDays))
      }
    }

    checkTrialStatus()
    // Check every minute
    const interval = setInterval(checkTrialStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation based on user role
  const getNavigation = useCallback(() => {
    // Platform Admin gets special navigation
    if (isPlatformAdmin) {
      return [
        { name: 'Dashboard', href: '/app/platform-admin', icon: HomeIcon, featureKey: null },
        { name: 'School Review', href: '/app/school-review', icon: ShieldCheckIcon, featureKey: null },
        { name: 'All Schools', href: '/app/all-schools', icon: BuildingOfficeIcon, featureKey: null },
        { name: 'All Users', href: '/app/all-users', icon: UsersIcon, featureKey: null },
        { name: 'Feature Flags', href: '/app/feature-flags', icon: FlagIcon, featureKey: null },
      ]
    }
    
    if (user?.role === 'TEACHER') {
      return [
        { name: 'My Portal', href: '/app', icon: HomeIcon, featureKey: null },
      ]
    }
    
    if (user?.role === 'PAYMENT_PROCESSOR') {
      // Payment Processor - Students + Payments only (full CRUD)
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon, featureKey: null },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon, featureKey: 'students' },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon, featureKey: 'payments' },
        { name: 'Pending Payments', href: '/app/pending-payments', icon: ExclamationTriangleIcon, featureKey: 'payments' },
        { name: 'Payment Report', href: '/app/payment-report', icon: DocumentChartBarIcon, featureKey: null },
      ]
    }
    
    if (user?.role === 'CLERK') {
      // Clerk - Students and Payments access
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon, featureKey: null },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon, featureKey: 'students' },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon, featureKey: 'payments' },
        { name: 'Pending Payments', href: '/app/pending-payments', icon: ExclamationTriangleIcon, featureKey: 'payments' },
        { name: 'Payment Report', href: '/app/payment-report', icon: DocumentChartBarIcon, featureKey: null },
      ]
    }
    
    if (user?.role === 'SUPPORT' || user?.role === 'ACCOUNTANT') {
      // Support/Accountant - limited access
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon, featureKey: null },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon, featureKey: 'students' },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon, featureKey: 'payments' },
        { name: 'Pending Payments', href: '/app/pending-payments', icon: ExclamationTriangleIcon, featureKey: 'payments' },
        { name: 'Payment Report', href: '/app/payment-report', icon: DocumentChartBarIcon, featureKey: null },
      ]
    }
    
    // Admin, Principal, HOD - full access
    const baseNav = [
      { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon, featureKey: null },
      { name: 'Students', href: '/app/students', icon: UserGroupIcon, featureKey: 'students' },
      { name: 'Staff', href: '/app/staff', icon: UsersIcon, featureKey: 'staff' },
      { name: 'Payments', href: '/app/payments', icon: BanknotesIcon, featureKey: 'payments' },
      { name: 'Pending Payments', href: '/app/pending-payments', icon: ExclamationTriangleIcon, featureKey: 'payments' },
      { name: 'Payment Report', href: '/app/payment-report', icon: DocumentChartBarIcon, featureKey: null },
      { name: 'Pictures', href: '/app/pictures', icon: PhotoIcon, featureKey: 'school_pictures' },
    ]

    if (user?.role === 'ADMIN' || user?.role === 'PRINCIPAL' || user?.role === 'HOD') {
      baseNav.push({ name: 'Users', href: '/app/users', icon: UserCircleIcon, featureKey: 'users' })
      baseNav.push({ name: 'Permissions', href: '/app/permissions', icon: ShieldCheckIcon, featureKey: null })
    }

    return baseNav
  }, [isPlatformAdmin, user?.role])

  // Only generate navigation when user is available
  const navigation = useMemo(() => {
    if (!user) return []
    
    return getNavigation()
      .filter(item => {
        // Platform admins see everything
        if (isPlatformAdmin) return true
        // If no feature key, always show
        if (!item.featureKey) return true
        // Check if feature is enabled
        return isFeatureEnabled(item.featureKey)
      })
  }, [user, isPlatformAdmin, isFeatureEnabled, getNavigation])

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app'
    return location.pathname.startsWith(path)
  }

  // Show loading state if user isn't loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:hidden">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-primary-600">SchoolOS</h1>
          {schoolName && !isPlatformAdmin && (
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{schoolName}</p>
          )}
          {isPlatformAdmin && (
            <p className="text-xs text-purple-600 font-medium">Platform Admin</p>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 flex-col items-center justify-center border-b px-4">
          <h1 className="text-xl font-bold text-primary-600">SchoolOS</h1>
          {schoolName && !isPlatformAdmin && (
            <p className="text-xs text-gray-500 truncate max-w-full text-center">{schoolName}</p>
          )}
          {isPlatformAdmin && (
            <p className="text-xs text-purple-600 font-semibold">Platform Admin</p>
          )}
        </div>

        <nav className="mt-6 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          {(user?.role === 'ADMIN' || user?.role === 'PRINCIPAL' || user?.role === 'HOD') && (
            <Link
              to="/app/billing"
              onClick={() => setSidebarOpen(false)}
              className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 mb-2 ${
                isActive('/app/billing')
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCardIcon className="h-5 w-5" />
              <span className="text-sm">Billing</span>
            </Link>
          )}
          <Link
            to="/app/security/2fa"
            onClick={() => setSidebarOpen(false)}
            className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 mb-2 ${
              isActive('/app/security/2fa')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LockClosedIcon className="h-5 w-5" />
            <span className="text-sm">2FA Settings</span>
          </Link>
          <Link
            to="/app/profile"
            className={`mb-2 flex items-center gap-2 rounded-lg px-4 py-2 ${
              location.pathname === '/app/profile'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCircleIcon className="h-5 w-5" />
            <span className="text-sm">My Profile</span>
          </Link>
          {/* Only show School Settings for non-platform admins */}
          {!user?.is_platform_admin && (
            <Link
              to="/app/school-settings"
              className={`mb-2 flex items-center gap-2 rounded-lg px-4 py-2 ${
                location.pathname === '/app/school-settings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BuildingOfficeIcon className="h-5 w-5" />
              <span className="text-sm">School Settings</span>
            </Link>
          )}
          <div className="mb-2 text-sm text-gray-600">
            <p className="font-medium truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-16 lg:ml-64 lg:pt-0">
        {/* Verification Status Banner - not shown for platform admins */}
        {verificationStatus && !isPlatformAdmin && (
          <VerificationBanner status={verificationStatus} schoolName={schoolName} />
        )}

        {/* Grace Period Warning Banner - not shown for platform admins */}
        {showGraceWarning && graceDaysRemaining > 0 && !isPlatformAdmin && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-900">
                  Trial Expired - Grace Period Active
                </h3>
                <p className="text-sm text-orange-800 mt-1">
                  Your trial has ended. You have <strong>{graceDaysRemaining} day{graceDaysRemaining !== 1 ? 's' : ''}</strong> remaining in your grace period.
                  After that, your account will be suspended.
                </p>
                <Link
                  to="/app/billing"
                  className="inline-block mt-2 text-sm font-medium text-orange-900 underline hover:text-orange-700"
                >
                  Subscribe Now to Continue →
                </Link>
              </div>
              <button
                onClick={() => setShowGraceWarning(false)}
                className="text-orange-500 hover:text-orange-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* Post-Cancellation Dialog - Non-dismissable, shown globally, not for platform admins */}
      {showCanceledDialog && !isPlatformAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 mb-4">
                  <svg className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Subscription Canceled</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your subscription has been canceled successfully. You now have <span className="font-bold text-orange-600">30 days of access</span> remaining.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 w-full">
                  <p className="text-xs text-yellow-800">
                    <span className="font-semibold">Important:</span> After your access expires, you won't be able to use the system without a valid subscription. Your data will be preserved for 30 days.
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  To continue using the system, you'll need to subscribe to a plan.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-center rounded-b-lg">
              <button
                onClick={() => {
                  localStorage.removeItem('subscription_just_canceled')
                  setShowCanceledDialog(false)
                  navigate('/app/billing')
                }}
                className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                View Subscription Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
