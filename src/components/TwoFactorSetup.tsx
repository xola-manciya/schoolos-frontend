import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  QrCodeIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'

interface TwoFactorSetupProps {
  onComplete?: () => void
  onCancel?: () => void
}

interface SetupResponse {
  qr_code: string
  secret: string
  backup_codes: string[]
  device_id: number
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup'>('intro')
  const [setupData, setSetupData] = useState<SetupResponse | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [copiedCodes, setCopiedCodes] = useState(false)

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/staff/2fa/setup/')
      return response.data
    },
    onSuccess: (data: SetupResponse) => {
      setSetupData(data)
      setStep('qr')
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to setup 2FA')
    }
  })

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post('/staff/2fa/verify/', {
        token: code,
        device_id: setupData?.device_id
      })
      return response.data
    },
    onSuccess: () => {
      setStep('backup')
      setError('')
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Invalid verification code')
    }
  })

  const handleSetup = () => {
    setupMutation.mutate()
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length === 6) {
      verifyMutation.mutate(verificationCode)
    }
  }

  const copyBackupCodes = () => {
    if (setupData?.backup_codes) {
      const codesText = setupData.backup_codes.join('\n')
      navigator.clipboard.writeText(codesText)
      setCopiedCodes(true)
      setTimeout(() => setCopiedCodes(false), 2000)
    }
  }

  const downloadBackupCodes = () => {
    if (setupData?.backup_codes) {
      const codesText = setupData.backup_codes.join('\n')
      const blob = new Blob([codesText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '2fa-backup-codes.txt'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro Step */}
      {step === 'intro' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enable Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">1</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
                <p className="text-sm text-gray-600">Use your authenticator app to scan the QR code</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">2</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verify Setup</h3>
                <p className="text-sm text-gray-600">Enter the 6-digit code from your app to confirm</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold">3</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Save Backup Codes</h3>
                <p className="text-sm text-gray-600">Store backup codes in a safe place</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Recommended Apps</h3>
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSetup}
              disabled={setupMutation.isPending}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {setupMutation.isPending ? 'Setting up...' : 'Get Started'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* QR Code Step */}
      {step === 'qr' && setupData && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <QrCodeIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Scan QR Code</h2>
            </div>
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
              <img 
                src={setupData.qr_code} 
                alt="QR Code" 
                className="w-64 h-64"
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Can't scan? Enter this code manually:
              </p>
              <div className="bg-gray-50 px-4 py-2 rounded font-mono text-sm">
                {setupData.secret}
              </div>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              I've Scanned the Code
            </button>
          </div>
        </div>
      )}

      {/* Verify Step */}
      {step === 'verify' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <KeyIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Verify Setup</h2>
            </div>
            <span className="text-sm text-gray-500">Step 2 of 3</span>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your authenticator app
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setVerificationCode(value)
                  setError('')
                }}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-widest font-mono px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep('qr')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={verificationCode.length !== 6 || verifyMutation.isPending}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Backup Codes Step */}
      {step === 'backup' && setupData && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">2FA Enabled Successfully!</h2>
                <p className="text-sm text-gray-500">Save your backup codes</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Step 3 of 3</span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important!</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Save these backup codes in a secure location. You can use them to access your account if you lose your phone.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                {setupData.backup_codes.map((code, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded border border-gray-200">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              onClick={copyBackupCodes}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <DocumentDuplicateIcon className="h-5 w-5" />
              <span>{copiedCodes ? 'Copied!' : 'Copy Codes'}</span>
            </button>
            <button
              onClick={downloadBackupCodes}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Finish Setup
          </button>
        </div>
      )}
    </div>
  )
}
