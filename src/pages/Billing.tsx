import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

type School = {
  id: number
  name: string
  subscription_start: string
  subscription_end: string
  subscription_active: boolean
  plan: 'FREE' | 'BASIC' | 'STANDARD' | 'PREMIUM'
}

type PaymentPlan = {
  id: string
  name: string
  price: number
  features: string[]
  recommended?: boolean
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 600,
    features: [
      'Up to 200 students',
      'Up to 10 staff members',
      'Payment processing',
      'Basic reporting',
      'Email support',
      'Monthly payment tracking',
      'Staff leave management',
      'Excel/CSV exports'
    ]
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: 1500,
    features: [
      'Up to 500 students',
      'Up to 30 staff members',
      'Payment processing',
      'Advanced reporting',
      'Priority email support',
      'Monthly payment tracking',
      'Staff leave management',
      'Excel/CSV exports',
      'Advanced analytics',
      'Custom branding',
      'Phone support'
    ],
    recommended: true
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 0,
    features: [
      'Unlimited students',
      'Unlimited staff members',
      'Payment processing',
      'Advanced reporting',
      '24/7 dedicated support',
      'Monthly payment tracking',
      'Staff leave management',
      'Excel/CSV exports',
      'Advanced analytics',
      'Custom branding',
      'Dedicated account manager',
      'API access'
    ],
    recommended: false
  }
]

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('PROFESSIONAL')
  const [processingPayment, setProcessingPayment] = useState(false)
  const { user } = useAuthStore()

  // Check if redirected due to expired subscription
  useEffect(() => {
    const subscriptionExpired = localStorage.getItem('subscription_expired')
    if (subscriptionExpired === 'true') {
      toast.error('Your subscription has expired. Please subscribe to continue.', {
        duration: 6000
      })
      localStorage.removeItem('subscription_expired')
    }
  }, [])

  const { data: school, isLoading } = useQuery<School>({
    queryKey: ['school-subscription'],
    queryFn: async () => {
      const response = await api.get('/general/schools/me/')
      return response.data
    },
  })

  // Check if trial has ended
  useEffect(() => {
    if (school && !school.subscription_active) {
      const trialEndDate = new Date(school.subscription_end)
      const now = new Date()
      if (trialEndDate < now) {
        toast.error('Your trial has ended. Please subscribe to continue using the system.', {
          duration: 5000
        })
      }
    }
  }, [school])

  const getDaysRemaining = () => {
    if (!school) return 0
    const endDate = new Date(school.subscription_end)
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const initializePayment = useMutation({
    mutationFn: async (plan: string) => {
      const response = await api.post('/payments/initialize/', {
        plan: plan,
        email: user?.email
      })
      return response.data
    },
    onSuccess: (data) => {
      // Redirect to Paystack payment page
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        toast.error('Failed to initialize payment')
        setProcessingPayment(false)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to initialize payment')
      setProcessingPayment(false)
    }
  })

  const handleSubscribe = (planId: string) => {
    setProcessingPayment(true)
    setSelectedPlan(planId)
    initializePayment.mutate(planId)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-gray-600">Loading subscription details...</div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining()
  const isTrialActive = daysRemaining > 0 && school?.plan === 'FREE'
  const isSubscriptionExpired = daysRemaining <= 0 && !school?.subscription_active

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Subscription Status Banner */}
      {isTrialActive && (
        <div className="mb-8 rounded-lg bg-blue-50 p-6 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Free Trial Active</h3>
              <p className="mt-1 text-sm text-blue-700">
                You have <span className="font-bold">{daysRemaining} days</span> remaining in your free trial.
                Subscribe now to ensure uninterrupted access to your school management system.
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {daysRemaining} days left
              </span>
            </div>
          </div>
        </div>
      )}

      {isSubscriptionExpired && (
        <div className="mb-8 rounded-lg bg-red-50 p-6 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900">Trial Expired</h3>
              <p className="mt-1 text-sm text-red-700">
                Your trial has ended. Please subscribe to a plan to continue using the system.
              </p>
            </div>
          </div>
        </div>
      )}

      {school?.subscription_active && !isTrialActive && (
        <div className="mb-8 rounded-lg bg-green-50 p-6 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Active Subscription</h3>
              <p className="mt-1 text-sm text-green-700">
                Your <span className="font-bold">{school.plan}</span> plan is active until{' '}
                {new Date(school.subscription_end).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
        <p className="mt-2 text-gray-600">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PAYMENT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border-2 bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
              plan.recommended
                ? 'border-primary-500 ring-2 ring-primary-500'
                : 'border-gray-200'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-sm font-semibold text-white">
                Recommended
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                {plan.price > 0 ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">R{plan.price.toLocaleString()}</span>
                    <span className="ml-2 text-gray-600">/month</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">Custom Pricing</span>
                )}
              </div>
            </div>

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="mr-2 h-5 w-5 flex-shrink-0 text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.price === 0 ? (
              <a
                href="mailto:sales@schoolos.co.za"
                className="w-full rounded-lg px-4 py-3 font-semibold transition-colors bg-gray-900 text-white hover:bg-gray-800 block text-center"
              >
                Contact Sales
              </a>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingPayment || (school?.plan === plan.id && school?.subscription_active)}
                className={`w-full rounded-lg px-4 py-3 font-semibold transition-colors ${
                school?.plan === plan.id && school?.subscription_active
                  ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                  : plan.recommended
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } disabled:opacity-50`}
            >
              {processingPayment && selectedPlan === plan.id ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : school?.plan === plan.id && school?.subscription_active ? (
                'Current Plan'
              ) : (
                'Subscribe Now'
              )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Information */}
      <div className="mt-12 rounded-lg bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>✓ Secure payment processing through Paystack</p>
          <p>✓ Cancel or change plan anytime</p>
          <p>✓ 30-day money-back guarantee</p>
          <p>✓ All prices in South African Rand (ZAR)</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Can I change my plan later?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What happens when my trial ends?</h4>
            <p className="mt-1 text-sm text-gray-600">
              When your 30-day trial ends, you'll need to subscribe to a paid plan to continue accessing your data. Your data will be preserved for 30 days after trial expiration.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">How do I cancel my subscription?</h4>
            <p className="mt-1 text-sm text-gray-600">
              You can cancel your subscription at any time from this page. You'll continue to have access until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
