import { Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { DialogProvider } from './contexts/DialogContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import CookieConsent from './components/CookieConsent'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EmailSent from './pages/EmailSent'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Staff from './pages/Staff'
import Payments from './pages/Payments'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import TeacherPortal from './pages/TeacherPortal'
import ClerkDashboard from './pages/ClerkDashboard'
import Users from './pages/Users'
import RolePermissions from './pages/RolePermissions'
import TwoFactorSettings from './pages/TwoFactorSettings'
import UnsubscribePage from './pages/UnsubscribePage'
import SchoolPictures from './pages/SchoolPictures'
import TermsAndConditions from './pages/TermsAndConditions'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import PAIAManual from './pages/PAIAManual'
import PaymentCallback from './pages/PaymentCallback'
import Billing from './pages/Billing'
import Profile from './pages/Profile'
import PlatformAdmin from './pages/PlatformAdmin'
import SchoolReview from './pages/SchoolReview'
import AllSchools from './pages/AllSchools'
import AllUsers from './pages/AllUsers'
import FeatureFlags from './pages/FeatureFlags'

function App() {
  const { isAuthenticated, user, fetchUser, logout } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  // Validate token on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token')
      
      if (token && isAuthenticated) {
        try {
          // Verify token is still valid by fetching user
          await fetchUser()
        } catch (error) {
          // Token is invalid, clear auth state
          logout()
        }
      }
      
      setIsInitialized(true)
    }

    initializeAuth()
  }, [])

  const getDefaultDashboard = () => {
    // Platform admin goes to platform admin page
    if (user?.is_platform_admin) return <PlatformAdmin />
    if (user?.role === 'TEACHER') return <TeacherPortal />
    if (user?.role === 'SUPPORT' || user?.role === 'ACCOUNTANT' || user?.role === 'PAYMENT_PROCESSOR') return <ClerkDashboard />
    return <Dashboard />
  }

  // Show loading state while validating token
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <DialogProvider>
        <CookieConsent />
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/email-sent" element={<EmailSent />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/paia-manual" element={<PAIAManual />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/onboarding/payment-callback" element={<PaymentCallback />} />
        
        {isAuthenticated ? (
          <Route path="/app" element={<Layout />}>
          <Route index element={getDefaultDashboard()} />
          <Route path="payment-success" element={<PaymentCallback />} />
          <Route 
            path="platform-admin" 
            element={
              <ProtectedRoute requirePlatformAdmin>
                <PlatformAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="school-review" 
            element={
              <ProtectedRoute requirePlatformAdmin>
                <SchoolReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="all-schools" 
            element={
              <ProtectedRoute requirePlatformAdmin>
                <AllSchools />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="all-users" 
            element={
              <ProtectedRoute requirePlatformAdmin>
                <AllUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="feature-flags" 
            element={
              <ProtectedRoute requirePlatformAdmin>
                <FeatureFlags />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="students" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PAYMENT_PROCESSOR']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL', 'ACCOUNTANT']}>
                <Staff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="payments" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'PAYMENT_PROCESSOR']}>
                <Payments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="pictures" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'SUPPORT']}>
                <SchoolPictures />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="teacher" 
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="permissions" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL']}>
                <RolePermissions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="security/2fa" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER', 'SUPPORT']}>
                <TwoFactorSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="billing" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PRINCIPAL']}>
                <Billing />
              </ProtectedRoute>
            } 
          />
          <Route path="profile" element={<Profile />} />
        </Route>
        ) : (
          <Route path="/app/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
      </DialogProvider>
    </HelmetProvider>
  )
}

export default App
