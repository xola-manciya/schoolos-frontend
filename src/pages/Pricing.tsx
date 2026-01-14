import { Link } from 'react-router-dom'
import { CheckIcon, XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'R2,999',
      period: '/month',
      description: 'Perfect for small schools getting started',
      features: [
        { name: 'Up to 200 students', included: true },
        { name: 'Up to 10 staff members', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Basic reporting', included: true },
        { name: 'Email support', included: true },
        { name: 'Monthly payment tracking', included: true },
        { name: 'Staff leave management', included: true },
        { name: 'Excel/CSV exports', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: 'R5,999',
      period: '/month',
      description: 'Ideal for growing educational institutions',
      features: [
        { name: 'Up to 500 students', included: true },
        { name: 'Up to 30 staff members', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Advanced reporting', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Monthly payment tracking', included: true },
        { name: 'Staff leave management', included: true },
        { name: 'Excel/CSV exports', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Phone support', included: true },
        { name: 'API access', included: false },
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large schools with advanced needs',
      features: [
        { name: 'Unlimited students', included: true },
        { name: 'Unlimited staff members', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Advanced reporting', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Monthly payment tracking', included: true },
        { name: 'Staff leave management', included: true },
        { name: 'Excel/CSV exports', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'API access', included: true },
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SchoolOS</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link
                to="/login"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Choose the perfect plan for your school. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-8 shadow-lg ${
                  plan.popular
                    ? 'border-primary-600 ring-4 ring-primary-100'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
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
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className={`mb-8 rounded-lg px-6 py-3 text-center font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:shadow-xl'
                      : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Get Started
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      )}
                      <span
                        className={
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Link */}
          <div className="mt-16 text-center">
            <p className="text-gray-600">
              Have questions?{' '}
              <Link to="/faq" className="font-semibold text-primary-600 hover:text-primary-700">
                Check our FAQ
              </Link>{' '}
              or contact us at sales@schoolos.co.za
            </p>
            <p className="mt-3 text-sm text-gray-600">
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                View Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
