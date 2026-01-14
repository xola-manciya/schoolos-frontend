import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { 
  ShieldCheckIcon, 
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import TwoFactorSetup from '../components/TwoFactorSetup'

interface TwoFactorStatus {
  enabled: boolean
  devices: Array<{
    id: number
    name: string
    created: string | null
  }>
}

export default function TwoFactorSettings() {
  const [showSetup, setShowSetup] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([])
  
  const queryClient = useQueryClient()

  // Query 2FA status
  const { data: status, isLoading } = useQuery<TwoFactorStatus>({
    queryKey: ['2fa-status'],
    queryFn: async () => {
      const response = await api.get('/staff/2fa/status/')
      return response.data
    }
  })

  // Disable 2FA mutation
  const disableMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/staff/2fa/disable/', { password })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] })
      setShowDisableConfirm(false)
      setPassword('')
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to disable 2FA')
    }
  })

  // Regenerate backup codes mutation
  const regenerateMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await api.post('/staff/2fa/regenerate_backup_codes/', { password })
      return response.data
    },
    onSuccess: (data) => {
      setNewBackupCodes(data.backup_codes)
      setShowRegenerateConfirm(false)
      setPassword('')
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to regenerate codes')
    }
  })

  const handleDisable = (e: React.FormEvent) => {
    e.preventDefault()
    disableMutation.mutate(password)
  }

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault()
    regenerateMutation.mutate(password)
  }

  const copyBackupCodes = () => {
    const codesText = newBackupCodes.join('\n')
    navigator.clipboard.writeText(codesText)
  }

  if (showSetup) {
    return (
      <TwoFactorSetup
        onComplete={() => {
          setShowSetup(false)
          queryClient.invalidateQueries({ queryKey: ['2fa-status'] })
        }}
        onCancel={() => setShowSetup(false)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
          <p className="mt-1 text-sm text-gray-500">
            Protect your account with an additional layer of security
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-full ${status?.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <ShieldCheckIcon className={`h-6 w-6 ${status?.enabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Two-Factor Authentication
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  {status?.enabled ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Enabled</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Disabled</span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {status?.enabled 
                    ? 'Your account is protected with two-factor authentication'
                    : 'Secure your account by requiring a code from your phone in addition to your password'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {!status?.enabled ? (
              <button
                onClick={() => setShowSetup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Enable Two-Factor Authentication
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRegenerateConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Regenerate Backup Codes</span>
                </button>
                <button
                  onClick={() => setShowDisableConfirm(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Disable 2FA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Devices */}
        {status?.enabled && status.devices.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Devices</h3>
            <div className="space-y-3">
              {status.devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{device.name}</p>
                      {device.created && (
                        <p className="text-xs text-gray-500">
                          Added {new Date(device.created).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">How Two-Factor Authentication Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>After entering your password, you'll be asked for a code from your phone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The code changes every 30 seconds and can only be used once</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep your backup codes in a safe place in case you lose your phone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You can use apps like Google Authenticator or Microsoft Authenticator</span>
            </li>
          </ul>
        </div>

        {/* Disable Confirmation Modal */}
        {showDisableConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disable Two-Factor Authentication?</h3>
              <p className="text-sm text-gray-600 mb-6">
                This will make your account less secure. Enter your password to confirm.
              </p>
              
              <form onSubmit={handleDisable} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisableConfirm(false)
                      setPassword('')
                      setError('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={disableMutation.isPending}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                  >
                    {disableMutation.isPending ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Regenerate Confirmation Modal */}
        {showRegenerateConfirm && !newBackupCodes.length && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regenerate Backup Codes?</h3>
              <p className="text-sm text-gray-600 mb-6">
                This will invalidate all your existing backup codes. Enter your password to confirm.
              </p>
              
              <form onSubmit={handleRegenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegenerateConfirm(false)
                      setPassword('')
                      setError('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={regenerateMutation.isPending}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    {regenerateMutation.isPending ? 'Generating...' : 'Regenerate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Backup Codes Modal */}
        {newBackupCodes.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Backup Codes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save these codes in a secure location. Each code can only be used once.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                  {newBackupCodes.map((code, index) => (
                    <div key={index} className="bg-white px-3 py-2 rounded border border-gray-200">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyBackupCodes}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Copy Codes
                </button>
                <button
                  onClick={() => setNewBackupCodes([])}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
