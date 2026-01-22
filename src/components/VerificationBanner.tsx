import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface VerificationBannerProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  schoolName?: string
}

export default function VerificationBanner({ status, schoolName }: VerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show banner if approved or dismissed
  if (status === 'APPROVED' || isDismissed) {
    return null
  }

  const bannerConfig = {
    PENDING: {
      bgColor: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-900',
      iconColor: 'text-amber-500',
      icon: ClockIcon,
      title: 'CIPC Verification Pending',
      message: 'Your school registration is under review for CIPC (Companies and Intellectual Property Commission) compliance. You can access limited features while we verify your details. This typically takes 1-2 business days.',
      dismissable: true,
    },
    REJECTED: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
      iconColor: 'text-red-500',
      icon: ExclamationTriangleIcon,
      title: '❌ CIPC Verification Failed - School Not Registered',
      message: 'Your school could not be verified with CIPC (Companies and Intellectual Property Commission). Schools must be properly registered with CIPC to use this platform. Please register with CIPC first or contact support@schoolos.co.za if you believe this is an error.',
      dismissable: false,
    },
  }

  const config = bannerConfig[status]
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} border-b-2 ${config.textColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start gap-3">
          <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              {config.title}
            </p>
            <p className="text-sm mt-1">
              {config.message}
            </p>
            {status === 'PENDING' && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="font-medium">What happens next?</span>
                <span className="text-amber-700">
                  We'll verify your CIPC registration and contact you via email.
                </span>
              </div>
            )}
          </div>

          {config.dismissable && (
            <button
              onClick={() => setIsDismissed(true)}
              className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
              aria-label="Dismiss banner"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
