import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface PasswordStrengthProps {
  password: string
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Contains special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const metRequirements = requirements.filter(req => req.test(password)).length
  const strengthPercentage = (metRequirements / requirements.length) * 100

  const getStrengthLabel = () => {
    if (metRequirements === 0) return { label: 'Very Weak', color: 'text-gray-400' }
    if (metRequirements <= 2) return { label: 'Weak', color: 'text-red-600' }
    if (metRequirements === 3) return { label: 'Fair', color: 'text-orange-500' }
    if (metRequirements === 4) return { label: 'Good', color: 'text-yellow-500' }
    return { label: 'Strong', color: 'text-green-600' }
  }

  const getStrengthBarColor = () => {
    if (metRequirements <= 2) return 'bg-red-500'
    if (metRequirements === 3) return 'bg-orange-500'
    if (metRequirements === 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const strength = getStrengthLabel()

  if (!password) return null

  return (
    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthBarColor()} transition-all duration-300`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600 mb-2">Password must contain:</p>
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password)
          return (
            <div key={index} className="flex items-center gap-2">
              {isMet ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
              )}
              <span className={`text-xs ${isMet ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                {requirement.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
