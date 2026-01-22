import { useState, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { AcademicCapIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { uid, token } = useParams<{ uid: string; token: string }>()

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) errors.push('at least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter')
    if (!/[0-9]/.test(password)) errors.push('one number')
    return errors
  }

  const passwordErrors = password ? validatePassword(password) : []
  const isPasswordValid = passwordErrors.length === 0
  const doPasswordsMatch = password === confirmPassword

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements')
      return
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post(`/auth/password/reset/confirm/${uid}/${token}/`, {
        new_password1: password,
        new_password2: confirmPassword,
      })
      
      toast.success('Password reset successful! You can now login.')
      navigate('/login')
    } catch (error: any) {
      console.error('Password reset error:', error.response?.data)
      const errorMessage = error.response?.data?.detail || 
                          (Array.isArray(error.response?.data?.detail) 
                            ? error.response?.data?.detail.join(' ') 
                            : 'Password reset failed. The link may be invalid or expired.')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <Link
          to="/login"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to login
        </Link>
        
        <div className="rounded-lg bg-white p-8 shadow-xl border border-gray-100">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 shadow-lg">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  required
                  minLength={8}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {[
                    { test: password.length >= 8, text: 'At least 8 characters' },
                    { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
                    { test: /[a-z]/.test(password), text: 'One lowercase letter' },
                    { test: /[0-9]/.test(password), text: 'One number' },
                  ].map((rule, index) => (
                    <p
                      key={index}
                      className={`text-xs flex items-center gap-1 ${
                        rule.test ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${rule.test ? 'bg-green-600' : 'bg-gray-400'}`} />
                      {rule.text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full rounded-md border px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 ${
                    confirmPassword && !doPasswordsMatch
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  required
                  minLength={8}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
              {confirmPassword && doPasswordsMatch && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-green-600" />
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch || !password || !confirmPassword}
              className="w-full rounded-md bg-primary-600 px-4 py-2.5 text-white font-medium shadow-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>🔒 Security Note:</strong> This link will expire in 1 hour. After resetting your password, you'll be redirected to the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
