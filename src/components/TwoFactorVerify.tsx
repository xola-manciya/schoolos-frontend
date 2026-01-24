import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface TwoFactorVerifyProps {
  onSuccess: () => void
  onCancel?: () => void
  deviceId?: number
}

export default function TwoFactorVerify({ onSuccess, onCancel, deviceId }: TwoFactorVerifyProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [error, setError] = useState('')

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      if (useBackupCode) {
        const response = await api.post('/staff/2fa/verify_backup/', { code })
        return response.data
      } else {
        const response = await api.post('/staff/2fa/verify/', { 
          token: code,
          device_id: deviceId 
        })
        return response.data
      }
    },
    onSuccess: (data) => {
      if (data.warning) {
        // Show warning for backup code usage
        toast(data.warning, { icon: '⚠️' })
      }
      onSuccess()
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Invalid code')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length >= 6) {
      verifyMutation.mutate(verificationCode)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500">Enter your verification code</p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {useBackupCode ? 'Backup Code' : 'Authentication Code'}
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = useBackupCode 
                    ? e.target.value.replace(/\s/g, '').slice(0, 8)
                    : e.target.value.replace(/\D/g, '').slice(0, 6)
                  setVerificationCode(value)
                  setError('')
                }}
                placeholder={useBackupCode ? '12345678' : '000000'}
                className="w-full text-center text-2xl tracking-widest font-mono px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={useBackupCode ? 8 : 6}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                {useBackupCode 
                  ? 'Enter one of your backup codes'
                  : 'Enter the 6-digit code from your authenticator app'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                verificationCode.length < (useBackupCode ? 8 : 6) || 
                verifyMutation.isPending
              }
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            </button>

            {/* Toggle Backup Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode)
                  setVerificationCode('')
                  setError('')
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {useBackupCode 
                  ? '← Use authenticator app instead'
                  : "Can't access your app? Use backup code →"
                }
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <span className="text-lg text-gray-400 flex-shrink-0 mt-0.5">🔑</span>
              <div className="text-xs text-gray-500">
                <p className="font-medium text-gray-700 mb-1">Lost your device?</p>
                <p>
                  Contact your administrator or use one of your backup codes to regain access to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
