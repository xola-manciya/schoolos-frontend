import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import {
  AcademicCapIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UsersIcon,
  DocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const features = [
    {
      name: 'Student Management',
      description: 'Comprehensive student records, enrollment tracking, and profile management with bulk import capabilities.',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Staff Management',
      description: 'Track staff profiles, leave management, and monitor who is on leave or active in real-time.',
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Payment Processing',
      description: 'Automated payment matching, bank statement uploads, and detailed monthly payment tracking per student.',
      icon: BanknotesIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Analytics & Reports',
      description: 'Real-time dashboards, payment analytics, and comprehensive reports for better decision making.',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
    {
      name: 'Secure & Reliable',
      description: 'Role-based access control, data encryption, and secure authentication to protect sensitive information.',
      icon: ShieldCheckIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Time Saving',
      description: 'Automate repetitive tasks, bulk operations, and streamlined workflows to save hours of manual work.',
      icon: ClockIcon,
      color: 'bg-indigo-500',
    },
  ]

  const benefits = [
    'Reduce administrative workload by up to 70%',
    'Real-time payment status tracking',
    'Automated payment matching from bank statements',
    'Comprehensive monthly payment reports',
    'Staff leave monitoring at a glance',
    'Bulk student enrollment via Excel',
    'Mobile-responsive design for on-the-go access',
    'Intuitive user interface requiring minimal training',
  ]

  const stats = [
    { label: 'Students Managed', value: '10,000+' },
    { label: 'Payments Processed', value: 'R50M+' },
    { label: 'Time Saved', value: '1000+ hrs' },
    { label: 'User Satisfaction', value: '99%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <SEO 
        title="SchoolOS - Modern School Management Platform for South African Schools"
        description="Streamline your school operations with SchoolOS. Comprehensive management system for students, staff, payments, and reporting. Starting at R350/month with 1-month free trial. Trusted by 500+ schools in South Africa."
        keywords="school management system, student management software, staff management, school administration, education software, South Africa school software, payment tracking, school ERP, student records, SchoolOS"
        canonical="https://schoolos.pages.dev/"
      />
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SchoolOS</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="hidden text-gray-700 hover:text-primary-600 sm:block">
                Features
              </a>
              <Link to="/pricing" className="hidden text-gray-700 hover:text-primary-600 sm:block">
                Pricing
              </Link>
              <Link to="/faq" className="hidden text-gray-700 hover:text-primary-600 sm:block">
                FAQ
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-100 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
              <SparklesIcon className="h-4 w-4" />
              <span>Complete School Administration Platform</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Manage Your School
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
              Streamline student management, staff tracking, and payment processing all in one powerful platform. 
              Built for South African schools with local payment integration.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-primary-700 sm:w-auto"
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:border-primary-600 hover:text-primary-600 sm:w-auto"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white p-4 shadow-md">
                  <div className="text-2xl font-bold text-primary-600 sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Run Your School
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed specifically for educational institutions
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
              >
                <div className={`mb-4 inline-flex rounded-lg ${feature.color} p-3 text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-gradient-to-r from-primary-600 to-blue-600 transition-transform group-hover:scale-x-100"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-br from-primary-50 to-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Why Choose SchoolOS?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Built with modern technology and designed specifically for South African schools, 
                SchoolOS helps you focus on education while we handle the administration.
              </p>
              
              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-primary-100 p-3">
                    <DocumentCheckIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Ready to Transform?</h3>
                    <p className="text-gray-600">Get started in minutes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                      1
                    </div>
                    <span className="text-gray-700">Create your account</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                      2
                    </div>
                    <span className="text-gray-700">Import your students via Excel</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                      3
                    </div>
                    <span className="text-gray-700">Start managing effortlessly</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 px-6 py-3 text-white shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your School Administration?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join hundreds of schools already using SchoolOS
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-medium text-primary-600 shadow-lg hover:bg-gray-50 sm:w-auto"
            >
              Sign In Now
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">SchoolOS</span>
              </div>
              <p className="mt-4 text-gray-600">
                The complete school administration platform for South African educational institutions. 
                Streamline operations, save time, and focus on what matters most - education.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Platform</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-primary-600">Features</a></li>
                <li><a href="#benefits" className="hover:text-primary-600">Benefits</a></li>
                <li><Link to="/pricing" className="hover:text-primary-600">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-primary-600">FAQ</Link></li>
                <li><Link to="/login" className="hover:text-primary-600">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/terms-of-service" className="hover:text-primary-600">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-600">Subscription Terms</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Support: support@schoolos.co.za</li>
                <li>Sales: sales@schoolos.co.za</li>
                <li>Phone: +27 11 123 4567</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} SchoolOS. All rights reserved. Built for South African schools.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
