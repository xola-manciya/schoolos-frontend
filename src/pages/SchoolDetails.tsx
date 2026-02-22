import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

export default function SchoolDetails() {
  const [formData, setFormData] = useState({
    schoolName: '',
    companyRegistrationNumber: '',
    emisNumber: '',
    directorIdNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { fetchUser } = useAuthStore()
  const [searchParams] = useSearchParams()

  // Check for tokens in URL (from email verification)
  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    
    if (access && refresh) {
      // Save tokens to localStorage
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      // Clean up URL first
      window.history.replaceState({}, '', '/school-details')
      
      // Fetch user data after a small delay to ensure tokens are set
      setTimeout(() => {
        fetchUser().then(() => {
          toast.success('✓ Email verified successfully!')
        }).catch((err) => {
          console.error('Failed to fetch user:', err)
          toast.error('Failed to load user data. Please try logging in again.')
        })
      }, 100)
    }
  }, [searchParams, fetchUser])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const accessToken = localStorage.getItem('access_token')
    
    if (!accessToken) {
      toast.error('You must be logged in to complete registration')
      navigate('/login')
      return
    }

    try {
      const response = await api.post('/auth/complete-registration/', {
        school_name: formData.schoolName,
        company_registration_number: formData.companyRegistrationNumber,
        emis_number: formData.emisNumber,
        director_id_number: formData.directorIdNumber,
      })
      
      // Refresh user data to include the new school association
      await fetchUser()
      
      toast.success(
        response.data.verification_status === 'PENDING' 
          ? '✓ School registered! Your account is pending verification. You\'ll be notified once approved.' 
          : 'School details submitted successfully!'
      )
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/app')
      }, 1500)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { school_name?: string[]; company_registration_number?: string[]; non_field_errors?: string[]; detail?: string }; status?: number } }
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
        return
      }
      
      const errorMessage = err.response?.data?.school_name?.[0] || 
                          err.response?.data?.company_registration_number?.[0] ||
                          err.response?.data?.non_field_errors?.[0] ||
                          err.response?.data?.detail ||
                          'Failed to submit school details'
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-blue-700/90" />
        <div className="relative z-10 flex h-full flex-col justify-center items-center px-16 text-white text-center">
          <Link to="/" className="mb-16 inline-flex items-center hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="SchoolOS" className="h-32 w-auto drop-shadow-2xl" />
          </Link>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Almost there!
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto mb-12">
            Complete your school registration to get started with your free 1-month trial.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">CIPC verification required</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">Secure & compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">Start trial immediately</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                School Information
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Register your school with CIPC verification
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Enter your school name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Director ID Number
                </label>
                <input
                  type="text"
                  value={formData.directorIdNumber}
                  onChange={(e) => setFormData({ ...formData, directorIdNumber: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g., 8501015800080"
                  required
                  pattern="[0-9]{13}"
                  title="13-digit SA ID number"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your ID number will be verified against CIPC director records
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CIPC Company Registration Number
                </label>
                <input
                  type="text"
                  value={formData.companyRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, companyRegistrationNumber: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g., 2024/123456/07"
                  required
                  pattern="[0-9]{4}/[0-9]{6}/[0-9]{2}"
                  title="Format: YYYY/NNNNNN/NN (e.g., 2024/123456/07)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your school must be registered with CIPC. Only directors can register.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EMIS Number
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.emisNumber}
                  onChange={(e) => setFormData({ ...formData, emisNumber: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g., 1234567890"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Education Management Information System number from the Department of Education
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 px-4 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
            
            <div className="mt-6 border-t pt-6 text-center text-sm">
              <p className="text-gray-500 text-xs">
                Need help? Contact support@schoolos.co.za
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
