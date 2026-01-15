import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import api from '../lib/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const key = searchParams.get('key')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!key) {
        setStatus('error')
        setMessage('Invalid verification link')
        return
      }

      try {
        await api.post('/auth/registration/verify-email/', { key })
        setStatus('success')
        setMessage('Your email has been verified successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error.response?.data?.detail || 
          'Email verification failed. The link may be invalid or expired.'
        )
      }
    }

    verifyEmail()
  }, [key, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to login page in 3 seconds...
              </p>
              <Link
                to="/login"
                className="inline-block w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                Go to Login Now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircleIcon className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="block w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                >
                  Try Registering Again
                </Link>
                <Link
                  to="/login"
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Back to Login
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Need help? Contact <a href="mailto:support@schoolos.co.za" className="text-primary-600 hover:text-primary-700">support@schoolos.co.za</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
