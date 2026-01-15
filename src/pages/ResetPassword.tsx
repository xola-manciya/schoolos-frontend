import { useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { uid, token } = useParams<{ uid: string; token: string }>()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/password/reset/confirm/', {
        uid,
        token,
        new_password1: password,
        new_password2: confirmPassword,
      })
      
      toast.success('Password reset successful! You can now login.')
      navigate('/login')
    } catch (error: any) {
      const errorMessage = error.response?.data?.new_password1?.[0] || 
                          error.response?.data?.token?.[0] ||
                          error.response?.data?.detail ||
                          'Password reset failed. The link may be invalid or expired.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
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
              Reset Password
            </h2>
            <p className="mt-2 text-gray-600">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
