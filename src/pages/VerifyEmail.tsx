import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()
  
  // Get email from state or URL params
  const email = searchParams.get('email') || location.state?.email || ''
  // Get code from URL params
  const urlCode = searchParams.get('code') || ''
  
  const [code, setCode] = useState(urlCode)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  // Auto-verify if both email and code are in URL
  useEffect(() => {
    if (email && urlCode) {
      handleVerification(email, urlCode)
    }
  }, [email, urlCode])

  const handleVerification = async (verifyEmail: string, verifyCode: string) => {
    setLoading(true)

    try {
      await api.post('/staff/verify-email/', {
        email: verifyEmail,
        code: verifyCode,
      })
      
      toast.success('Email verified successfully! Logging you in...')
      
      // Auto-login after successful verification
      // Note: The user needs to have their password, so we'll just redirect to login
      setTimeout(() => {
        navigate('/login', { state: { verified: true, email: verifyEmail } })
      }, 1500)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Verification failed'
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    handleVerification(email, code)
  }

  const handleResend = async () => {
    setResending(true)

    try {
      await api.post('/staff/resend-verification/', {
        email,
      })
      
      toast.success('Verification code sent! Check your email.')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to resend code'
      toast.error(errorMessage)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
           style={{backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-blue-700/90" />
        <div className="relative z-10 flex h-full flex-col justify-center items-center px-16 text-white text-center">
          <Link to="/" className="mb-16 inline-flex items-center hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="SchoolOS" className="h-32 w-auto drop-shadow-2xl" />
          </Link>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Verify Your Email
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto">
            We've sent a 6-digit verification code to your email address.
          </p>
        </div>
      </div>

      {/* Right side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Link
            to="/register"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group lg:hidden"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to registration</span>
          </Link>

          {/* Mobile Logo */}
          <Link to="/" className="mb-6 inline-flex items-center lg:hidden">
            <img src="/logo.png" alt="SchoolOS" className="h-20 w-auto" />
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Enter Verification Code
            </h2>
            <p className="text-gray-600 mb-8">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-semibold tracking-widest shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                Already verified? <span className="font-semibold">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
