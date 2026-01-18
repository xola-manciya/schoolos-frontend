import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
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
} from '@heroicons/react/24/outline'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showGraceWarning, setShowGraceWarning] = useState(false)
  const [graceDaysRemaining, setGraceDaysRemaining] = useState(0)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

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
  const getNavigation = () => {
    if (user?.role === 'TEACHER') {
      return [
        { name: 'My Portal', href: '/app', icon: HomeIcon },
      ]
    }
    
    if (user?.role === 'PAYMENT_PROCESSOR') {
      // Payment Processor - Students + Payments only (full CRUD)
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon },
      ]
    }
    
    if (user?.role === 'CLERK') {
      // Clerk - Students and Payments access
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon },
      ]
    }
    
    if (user?.role === 'SUPPORT' || user?.role === 'ACCOUNTANT') {
      // Support/Accountant - limited access
      return [
        { name: 'Dashboard', href: '/app', icon: HomeIcon },
        { name: 'Students', href: '/app/students', icon: UserGroupIcon },
        { name: 'Payments', href: '/app/payments', icon: BanknotesIcon },
      ]
    }
    
    // Admin, Principal, HOD - full access
    const baseNav = [
      { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon },
      { name: 'Students', href: '/app/students', icon: UserGroupIcon },
      { name: 'Staff', href: '/app/staff', icon: UsersIcon },
      { name: 'Payments', href: '/app/payments', icon: BanknotesIcon },
      { name: 'Pictures', href: '/app/pictures', icon: PhotoIcon },
    ]

    // Only admins, principals, and HODs can manage users
    if (user?.role === 'ADMIN' || user?.role === 'PRINCIPAL' || user?.role === 'HOD') {
      baseNav.push({ name: 'Users', href: '/app/users', icon: UserCircleIcon })
      baseNav.push({ name: 'Permissions', href: '/app/permissions', icon: ShieldCheckIcon })
    }

    return baseNav
  }

  const navigation = getNavigation()

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:hidden">
        <h1 className="text-lg font-bold text-primary-600">School Mgmt</h1>
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
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary-600">SchoolOS</h1>
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
        {/* Grace Period Warning Banner */}
        {showGraceWarning && graceDaysRemaining > 0 && (
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
    </div>
  )
}
