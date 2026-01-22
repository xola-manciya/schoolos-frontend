import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { CheckIcon } from '@heroicons/react/24/outline'

type School = {
  id: number
  name: string
  subscription_start: string
  subscription_end: string
  subscription_tier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  is_trial: boolean
  has_ever_subscribed: boolean
  payment_months_per_year: number
  payment_start_month: number
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  cipc_verified: boolean
  company_registration_number: string | null
  emis_number: string | null
  address?: string
  phone?: string
  email: string
}

type PaymentPlan = {
  id: string
  name: string
  priceMonthly: string
  priceAnnual: string
  description: string
  features: string[]
  example: (billingCycle: 'monthly' | 'annual') => string
  recommended?: boolean
  isEnterprise?: boolean
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    priceMonthly: 'R12',
    priceAnnual: 'R10',
    description: 'Simple, transparent pricing that scales with your school',
    features: [
      'Unlimited learners (up to 1,000)',
      'Unlimited staff members',
      'Payment processing & tracking',
      'Advanced reporting & analytics',
      'Excel/CSV exports (even on trial)',
      'Staff leave management',
      'Parent portal access',
      'Email & SMS notifications',
      'Custom branding',
      'Priority email support',
      'Monthly payment tracking',
      'API access'
    ],
    example: (billingCycle) => billingCycle === 'monthly' 
      ? '500 learners = R6,000/month' 
      : '500 learners = R5,000/month (save R12,000/year)',
    recommended: true
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    description: 'For schools with 1,000+ learners',
    features: [
      '1,000+ learners',
      'Volume discounts available',
      'All Starter features included',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integrations',
      'Advanced security features',
      'Custom training & onboarding',
      'Service level agreement (SLA)',
      'Multi-campus support',
      'Dedicated infrastructure',
      'White-label options'
    ],
    example: () => 'Contact us for custom pricing',
    isEnterprise: true
  }
]

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState<string>('STARTER')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCanceledDialog, setShowCanceledDialog] = useState(false)
  const [canceling, setCanceling] = useState(false)
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

  const { data: school, isLoading, error } = useQuery<School>({
    queryKey: ['school-subscription'],
    queryFn: async () => {
      const response = await api.get('/general/schools/me/')
      return response.data
    },
    retry: 1
  })

  // Check if trial has ended
  useEffect(() => {
    if (school && school.is_trial) {
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
        billing_cycle: billingCycle,
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
      const errorMessage = error.response?.data?.error || 'Failed to initialize payment'
      toast.error(errorMessage)
      setProcessingPayment(false)
    }
  })

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      const response = await api.post('/payments/cancel-subscription/')
      return response.data
    },
    onSuccess: (data) => {
      setShowCancelDialog(false)
      setCanceling(false)
      // Store cancellation state in localStorage to show dialog on all pages
      localStorage.setItem('subscription_just_canceled', 'true')
      setShowCanceledDialog(true)
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to cancel subscription'
      toast.error(errorMessage)
      setCanceling(false)
    }
  })

  const updatePaymentMethod = useMutation({
    mutationFn: async () => {
      const response = await api.post('/payments/update-payment-method/')
      return response.data
    },
    onSuccess: (data) => {
      // Redirect to Paystack for payment method update
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        toast.error('Failed to initialize payment method update')
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to update payment method'
      toast.error(errorMessage)
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

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 shadow">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-900">Unable to Load Billing Information</h3>
              <p className="mt-2 text-sm text-red-800">
                {(error as any)?.response?.data?.error || 'Failed to fetch school details. Please contact support.'}
              </p>
              <p className="mt-2 text-sm text-red-700">
                This usually means your account is not properly associated with a school. Please contact support@schoolos.co.za for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining()
  const isTrialActive = school?.is_trial && daysRemaining > 0
  const isSubscriptionExpired = daysRemaining <= 0 && school?.is_trial
  // User has active subscription if they're not on trial
  const hasActiveSubscription = school && !school.is_trial
  
  // If user has an active subscription, show billing details instead of plans
  if (hasActiveSubscription) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Active Subscription Banner */}
        <div className="mb-8 rounded-lg bg-green-50 border-2 border-green-200 p-6 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">✓ Active Subscription</h3>
              <p className="mt-1 text-sm text-green-700">
                Your <span className="font-bold">{school.subscription_tier || 'Starter'}</span> plan is active until{' '}
                {new Date(school.subscription_end).toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Current Plan Details */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Billing & Subscription</h2>
          <p className="mt-2 text-gray-600">
            Manage your subscription and view payment history
          </p>
        </div>

        {/* Subscription Details Card */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Subscription Details</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Current Plan</label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {school.subscription_tier || 'Starter'} Plan
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  Active
                </span>
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Subscription Started</label>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(school.subscription_start).toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Next Billing Date</label>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(school.subscription_end).toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing</h4>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">R12</span> per learner/month (or R10/month when billed annually)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Simple, transparent pricing. Pay only for active learners.
            </p>
          </div>
        </div>

        {/* Payment History Card */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment History</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="font-medium text-gray-900">
                  {school.subscription_tier || 'Starter'} Plan - Monthly Subscription
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(school.subscription_start).toLocaleDateString('en-ZA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">Per learner</p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Paid
                </span>
              </div>
            </div>

            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Additional payment history will appear here as payments are processed.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => toast.info('Please contact support@schoolos.co.za to change your plan')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Change Plan
          </button>
          
          <button
            onClick={() => updatePaymentMethod.mutate()}
            disabled={updatePaymentMethod.isPending}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {updatePaymentMethod.isPending ? 'Processing...' : 'Update Payment Method'}
          </button>
          
          <button
            onClick={() => setShowCancelDialog(true)}
            className="rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>

        {/* Cancel Subscription Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Are you sure you want to cancel your subscription? You will lose access to premium features and your data will be preserved for 30 days.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={canceling}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => {
                    setCanceling(true)
                    cancelSubscription.mutate()
                  }}
                  disabled={canceling}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {canceling ? 'Canceling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Support Info */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
          <p className="mt-2 text-sm text-blue-700">
            For billing inquiries, subscription changes, or any questions, contact our support team at{' '}
            <a href="mailto:support@schoolos.co.za" className="font-medium underline">
              support@schoolos.co.za
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Subscription Status Banner */}
      {isTrialActive && (
        <div className={`mb-8 rounded-lg p-6 shadow ${school.has_ever_subscribed ? 'bg-orange-50 border-2 border-orange-300' : 'bg-blue-50'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${school.has_ever_subscribed ? 'text-orange-900' : 'text-blue-900'}`}>
                {school.has_ever_subscribed ? '⚠️ Grace Period Active' : 'Free Trial Active'}
              </h3>
              <p className={`mt-1 text-sm ${school.has_ever_subscribed ? 'text-orange-700' : 'text-blue-700'}`}>
                {school.has_ever_subscribed ? (
                  <>
                    Your subscription was canceled. You have <span className="font-bold">{daysRemaining} days</span> of access remaining.
                    Subscribe to continue using the system after this period.
                  </>
                ) : (
                  <>
                    You have <span className="font-bold">{daysRemaining} days</span> remaining in your free trial.
                    Subscribe now to ensure uninterrupted access to your school management system.
                  </>
                )}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                school.has_ever_subscribed ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
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

      {hasActiveSubscription && (
        <div className="mb-8 rounded-lg bg-green-50 p-6 shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">Active Subscription</h3>
              <p className="mt-1 text-sm text-green-700">
                Your <span className="font-bold">{school.subscription_tier}</span> plan is active until{' '}
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
          Simple, transparent per-learner pricing. Pay only for active learners.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          style={{ backgroundColor: billingCycle === 'annual' ? '#2563eb' : '#d1d5db' }}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
          Annual <span className="text-sm text-green-600 font-semibold">(Save 17%)</span>
        </span>
      </div>

      {/* Pricing Plans */}
      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">{PAYMENT_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 bg-white p-8 shadow-lg transition-all hover:shadow-xl ${
              plan.recommended
                ? 'border-primary-600 ring-4 ring-primary-100'
                : 'border-gray-200'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-primary-600 to-blue-600 px-4 py-1 text-sm font-semibold text-white">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-gray-600">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  {billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual}
                </span>
                {!plan.isEnterprise && (
                  <span className="ml-1 text-xl text-gray-600">
                    /learner/month{billingCycle === 'annual' && ' (billed annually)'}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600">{plan.example(billingCycle)}</p>
            </div>

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.isEnterprise ? (
              <a
                href="mailto:sales@schoolos.co.za?subject=Enterprise Plan Inquiry"
                className="w-full rounded-lg px-4 py-3 font-semibold transition-colors bg-gray-900 text-white hover:bg-gray-800 block text-center"
              >
                Contact Sales
              </a>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingPayment || (school?.subscription_tier === plan.id && !school?.is_trial)}
                className={`w-full rounded-lg px-4 py-3 font-semibold transition-colors ${
                  school?.subscription_tier === plan.id && !school?.is_trial
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
                ) : school?.subscription_tier === plan.id && !school?.is_trial ? (
                  'Current Plan'
                ) : (
                  `Subscribe ${billingCycle === 'monthly' ? 'Monthly' : 'Annually'}`
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
          <p>✓ 30-day free trial - No credit card required</p>
          <p>✓ Pay only for active learners</p>
          <p>✓ All prices in South African Rand (ZAR)</p>
          <p>✓ Volume discounts available for 1,000+ learners</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">How does per-learner pricing work?</h4>
            <p className="mt-1 text-sm text-gray-600">
              You pay R12 per active learner per month (or R10 if billed annually). For example, if you have 500 learners, 
              you pay R6,000/month or R5,000/month when billed annually. Simple and transparent.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Can I switch between monthly and annual billing?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Yes! You can switch at any time. Annual billing saves you 17% (2 months free) and can be changed during your next billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What happens when my trial ends?</h4>
            <p className="mt-1 text-sm text-gray-600">
              When your 30-day trial ends, you'll need to subscribe to continue accessing your data. Your data will be preserved for 30 days after trial expiration.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What if I have more than 1,000 learners?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Contact our sales team for Enterprise pricing with volume discounts, dedicated support, and custom integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
