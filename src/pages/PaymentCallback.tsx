import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const [schoolData, setSchoolData] = useState<any>(null)
  const [isSubscription, setIsSubscription] = useState(false)

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    const isSubPayment = window.location.pathname.includes('payment-success')
    setIsSubscription(isSubPayment)
    
    if (!reference) {
      setStatus('error')
      setMessage('No payment reference found')
      return
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        // Use different endpoint based on payment type
        const endpoint = isSubPayment 
          ? '/api/v1/payments/verify-subscription/'
          : '/api/v1/general/verify-payment/'
        
        const response = await axios.post(endpoint, {
          reference
        })

        if (response.data.status === 'success') {
          setStatus('success')
          setMessage(response.data.message)
          setSchoolData(response.data.school)
          
          // Redirect based on context
          setTimeout(() => {
            if (isSubPayment && isAuthenticated) {
              // Reload to refresh school data and then redirect
              window.location.href = '/app/billing'
            } else {
              navigate('/login')
            }
          }, 3000)
        } else {
          setStatus('error')
          setMessage(response.data.message || 'Payment verification failed')
        }
      } catch (err: any) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Failed to verify payment')
      }
    }

    verifyPayment()
  }, [searchParams, navigate, isAuthenticated])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {status === 'verifying' && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
            </div>

            {schoolData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  {isSubscription ? 'Subscription Details' : 'School Details'}
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-blue-700 font-medium">Name:</dt>
                    <dd className="text-blue-900">{schoolData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700 font-medium">{isSubscription ? 'Plan' : 'Tier'}:</dt>
                    <dd className="text-blue-900">{schoolData.subscription_tier}</dd>
                  </div>
                  {isSubscription ? (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-blue-700 font-medium">Status:</dt>
                        <dd className="font-semibold text-green-600">{schoolData.subscription_status}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-blue-700 font-medium">Valid Until:</dt>
                        <dd className="text-blue-900">{new Date(schoolData.subscription_end).toLocaleDateString()}</dd>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <dt className="text-blue-700 font-medium">Trial Ends:</dt>
                      <dd className="text-blue-900">{new Date(schoolData.trial_end_date).toLocaleDateString()}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                <strong>Next Steps:</strong>
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                {isSubscription ? (
                  <>
                    <li>Check your email for the invoice and receipt</li>
                    <li>You'll be redirected to billing page in 3 seconds</li>
                    <li>Your subscription is now active and trial has ended</li>
                    <li>Access all features without limitations</li>
                  </>
                ) : (
                  <>
                    <li>Check your email for trial welcome message</li>
                    <li>You'll be redirected to login in 3 seconds</li>
                    <li>Use your school admin credentials to access the system</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/register-test')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
