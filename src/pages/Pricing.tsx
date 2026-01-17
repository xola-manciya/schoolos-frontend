import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { useState } from 'react'
import { CheckIcon, XMarkIcon, AcademicCapIcon, Bars3Icon, XMarkIcon as XIcon } from '@heroicons/react/24/outline'

export default function Pricing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const plans = [
    {
      name: 'Starter',
      price: 'R350',
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
      price: 'R750',
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
      name: 'Premium',
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
      <SEO 
        title="Pricing Plans - Affordable School Management Software"
        description="Choose the perfect SchoolOS plan for your school. Starting at R350/month with 1-month free trial. Flexible pricing for schools of all sizes. No hidden fees, cancel anytime."
        keywords="school management pricing, education software cost, school software pricing, affordable school management, SchoolOS pricing, South Africa school software prices"
        canonical="https://schoolos.co.za/pricing"
      />
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="SchoolOS" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">SchoolOS</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link to="/faq" className="text-gray-700 hover:text-primary-600">
                FAQ
              </Link>
              <Link
                to="/login"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign In
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 px-4 py-2"
                >
                  Home
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 px-4 py-2"
                >
                  FAQ
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mx-4 rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
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

          {/* Pricing FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-3 text-lg text-gray-600">Everything you need to know about our pricing</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* FAQ Items */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit and debit cards, EFT, and bank transfers through our secure payment gateway powered by Paystack.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is there a free trial available?
                </h3>
                <p className="text-gray-600">
                  Yes, we offer a 1-month free trial on all plans. No credit card required to start your trial. Note: Export features are disabled during the trial period.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What happens if I exceed my plan limits?
                </h3>
                <p className="text-gray-600">
                  We'll notify you when you're approaching your limits. You can upgrade to a higher plan or we'll work with you to find a custom solution.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you offer discounts for annual payments?
                </h3>
                <p className="text-gray-600">
                  Yes! Pay annually and save 10% on all plans. Contact us for a custom quote for your school.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is my school's data secure?
                </h3>
                <p className="text-gray-600">
                  Absolutely. We use bank-level encryption and comply with South African data protection regulations. Your data is backed up daily.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What support do I get?
                </h3>
                <p className="text-gray-600">
                  All plans include email support. Professional plans get priority support, and Enterprise includes a dedicated account manager with 24/7 availability.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. No cancellation fees. Your data remains accessible for 30 days after cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center bg-primary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you choose the right plan for your school
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:sales@schoolos.co.za"
                className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
              >
                Contact Sales
              </a>
              <Link
                to="/faq"
                className="inline-block rounded-lg border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 hover:bg-primary-50"
              >
                View Full FAQ
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                View Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-primary-600">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-primary-600">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-primary-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@schoolos.co.za" className="text-gray-600 hover:text-primary-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-primary-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-600 hover:text-primary-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary-600">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-600">
              &copy; 2026 SchoolOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
