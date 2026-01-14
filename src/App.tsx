import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
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

function App() {
  const { isAuthenticated, user } = useAuthStore()

  const getDefaultDashboard = () => {
    if (user?.role === 'TEACHER') return <TeacherPortal />
    if (user?.role === 'SUPPORT' || user?.role === 'ACCOUNTANT' || user?.role === 'PAYMENT_PROCESSOR') return <ClerkDashboard />
    return <Dashboard />
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
      
      {isAuthenticated ? (
        <Route path="/app" element={<Layout />}>
          <Route index element={getDefaultDashboard()} />
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
        </Route>
      ) : (
        <Route path="/app/*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

export default App
