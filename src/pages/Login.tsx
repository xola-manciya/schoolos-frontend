import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AcademicCapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { User } from '../types'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<User['role']>('ADMIN')
  const [loading, setLoading] = useState(false)
  const { mockLogin } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock login - no backend call for now
      mockLogin(selectedRole)
      toast.success(`Logged in as ${selectedRole}!`)
      navigate('/app')
      
      // TODO: Uncomment when backend is ready
      // await login(username, password)
      // toast.success('Login successful!')
      // navigate('/app')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
        
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <AcademicCapIcon className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">Sign in to your SchoolOS account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Login as (Demo)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as User['role'])}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="TEACHER">Teacher</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="PAYMENT_PROCESSOR">Payment Processor</option>
                <option value="SUPPORT">Support Staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 border-t pt-6 text-center text-sm text-gray-600">
            <p>Need help? Contact support@schoolos.co.za</p>
          </div>
        </div>
      </div>
    </div>
  )
}
