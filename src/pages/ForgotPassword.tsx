import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/password/reset/', { email })
      setSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSent(false)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-block w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to login
        </Link>
        
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <AcademicCapIcon className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="you@school.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-6 border-t pt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
