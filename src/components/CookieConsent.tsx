import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowBanner(false)
    
    // Note: Essential cookies (authentication) will still work
    // but we won't store preferences or analytics
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-2xl border-2 border-primary-500">
        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-12 w-12 text-primary-600" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                We Value Your Privacy
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                We use <strong>essential cookies</strong> and browser storage (LocalStorage) to keep you logged in and secure your session. 
                We also use <strong>functional storage</strong> to remember your preferences and improve your experience.
              </p>

              <p className="text-xs text-gray-600 mb-4">
                We comply with <strong>POPIA</strong> (Protection of Personal Information Act) and respect your data rights. 
                Essential cookies are required for the platform to function and cannot be disabled. 
                Read our <Link to="/privacy-policy" className="text-primary-600 hover:underline font-medium">Privacy Policy</Link> for details.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Essential Only
                </button>
                <Link
                  to="/privacy-policy"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
