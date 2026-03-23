import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { AcademicCapIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is SchoolOS?',
          answer: 'SchoolOS is a comprehensive school administration platform designed specifically for South African schools. It helps manage students, staff, payments, and administrative tasks all in one place.',
        },
        {
          question: 'Who can use SchoolOS?',
          answer: 'SchoolOS is designed for school administrators, principals, teachers, and accountants. Each user role has specific permissions to access relevant features.',
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use industry-standard encryption, secure authentication, and regular backups to ensure your school data is always protected. We are compliant with South African data protection regulations.',
        },
      ],
    },
    {
      category: 'Students & Staff',
      questions: [
        {
          question: 'Can I import existing student records?',
          answer: 'Absolutely! SchoolOS supports bulk student imports via Excel or CSV files. You can upload hundreds of students at once with all their details, making migration from other systems easy.',
        },
        {
          question: 'How does staff leave management work?',
          answer: 'Staff members can submit leave applications directly through the platform. Administrators can approve or reject requests, and the system automatically tracks leave balances (annual and sick leave).',
        },
        {
          question: 'Can teachers see all students?',
          answer: 'No, teachers can only view students from the classes or grades they are assigned to. This ensures privacy and focuses teachers on their relevant students.',
        },
      ],
    },
    {
      category: 'Payments',
      questions: [
        {
          question: 'How does payment processing work?',
          answer: 'You can upload bank statements (CSV, Excel, or PDF), and SchoolOS automatically matches payments to students using intelligent fuzzy matching. The system tracks monthly payments for each student.',
        },
        {
          question: 'Can I see which months a student has paid?',
          answer: 'Yes! The payment dashboard shows a visual monthly calendar for each student, clearly indicating which months are paid and which are outstanding.',
        },
        {
          question: 'What payment methods are supported?',
          answer: 'SchoolOS tracks all payment methods including bank transfers, cash, card payments, mobile money, and cheques. All transactions are recorded with full audit trails.',
        },
      ],
    },
    {
      category: 'Reports & Exports',
      questions: [
        {
          question: 'Can I export data?',
          answer: 'Yes! Every table in SchoolOS can be exported to either Excel or CSV format. Choose your preferred format and download your data instantly.',
        },
        {
          question: 'What kind of reports are available?',
          answer: 'SchoolOS provides payment summaries, student enrollment reports, staff attendance tracking, and financial reports. Professional and Enterprise plans include advanced analytics.',
        },
      ],
    },
    {
      category: 'Pricing & Billing',
      questions: [
        {
          question: 'How much does SchoolOS cost?',
          answer: 'We offer three plans: Starter (R2,999/month for up to 200 students), Professional (R5,999/month for up to 500 students), and Enterprise (custom pricing for unlimited users). Check our pricing page for full details.',
        },
        {
          question: 'Is there a free trial?',
          answer: 'Yes! We offer a 30-day free trial for all plans. No credit card required to start.',
        },
        {
          question: 'Can I change plans later?',
          answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
        },
      ],
    },
    {
      category: 'Technical',
      questions: [
        {
          question: 'Is SchoolOS mobile-friendly?',
          answer: 'Yes! SchoolOS is fully responsive and works seamlessly on phones, tablets, and desktop computers. Access your school data anywhere, anytime.',
        },
        {
          question: 'Do I need to install software?',
          answer: 'No installation needed! SchoolOS is a cloud-based platform accessible through any modern web browser. Just log in and start using it.',
        },
        {
          question: 'What if I need help?',
          answer: 'We offer email support on all plans, with phone support on Professional plans and 24/7 dedicated support on Enterprise plans. We also provide comprehensive documentation and video tutorials.',
        },
      ],
    },
    {
      category: 'Privacy & Security (POPIA)',
      questions: [
        {
          question: 'Is SchoolOS compliant with South African data protection laws?',
          answer: 'Yes! SchoolOS is fully compliant with POPIA (Protection of Personal Information Act, 2013) and PAIA (Promotion of Access to Information Act, 2000). We are registered with the Information Regulator and have appointed an Information Officer as required by law.',
        },
        {
          question: 'How is student data protected?',
          answer: 'Student data is classified as "special personal information" under POPIA Section 26 because it concerns children. We use AES-256 encryption at rest, TLS 1.3 encryption in transit, role-based access controls, school data isolation, and comprehensive audit logging. All data is stored securely with ISO 27001 certified providers.',
        },
        {
          question: 'Where is my school data stored?',
          answer: 'Your data is primarily stored in South Africa (AWS Cape Town region via Neon.tech database). Some third-party services process data internationally (EU, USA) but only with Standard Contractual Clauses (SCCs) and POPIA-equivalent safeguards. You can request 100% South African data localization by contacting our Information Officer.',
        },
        {
          question: 'What are my rights under POPIA?',
          answer: 'You have the right to: (1) Access your personal information, (2) Request correction of inaccurate data, (3) Request deletion (subject to legal retention), (4) Object to processing for marketing, (5) Receive data in portable format (CSV/Excel export), and (6) Lodge a complaint with the Information Regulator. Contact privacy@schoolos.co.za to exercise these rights.',
        },
        {
          question: 'What cookies and browser storage does SchoolOS use?',
          answer: 'We use essential cookies and LocalStorage for authentication (JWT tokens with 1-hour expiry for access tokens, 7-day expiry for refresh tokens). We also store subscription status and user preferences. All essential storage is required for the platform to function. See our Privacy Policy for full details.',
        },
        {
          question: 'Do you share our data with third parties?',
          answer: 'We do NOT sell your data. We only share with trusted service providers necessary to operate the platform: Paystack (payment processing), Render.com (hosting), Neon.tech (database), and Cloudflare (CDN/storage). All processors have Data Processing Agreements (DPAs) and are ISO 27001 / SOC 2 certified.',
        },
        {
          question: 'How long do you keep our data?',
          answer: 'Payment records and audit logs: 7 years (SARS compliance). Student records: Until graduation + 5 years. Staff records: Employment + 3 years. Bank statements: 90 days after processing (auto-deleted). Session logs: 90 days. Inactive accounts: 2 years before deletion. See our full retention policy in the Privacy Policy.',
        },
        {
          question: 'What happens if there is a data breach?',
          answer: 'We have an incident response plan. In the unlikely event of a breach, we will notify the Information Regulator within 72 hours and notify affected schools immediately. We will provide details of the breach, potential impact, and remedial actions taken.',
        },
      ],
    },
  ]

  // const allQuestions = faqs.flatMap((category, catIndex) =>
  //   category.questions.map((q, qIndex) => ({
  //     ...q,
  //     category: category.category,
  //     globalIndex: catIndex * 100 + qIndex,
  //   }))
  // )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <SEO 
        title="FAQ - Frequently Asked Questions About SchoolOS"
        description="Get answers to common questions about SchoolOS school management software. Learn about features, pricing, implementation, security, and support. Find everything you need to know."
        keywords="school management FAQ, SchoolOS questions, school software help, education software FAQ, school management support"
        canonical="https://schoolos.co.za/faq"
      />
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SchoolOS</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-600">
                Pricing
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
                <XMarkIcon className="h-6 w-6" />
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
                  to="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 px-4 py-2"
                >
                  Pricing
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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about SchoolOS
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-12 space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, qIndex) => {
                    const globalIndex = catIndex * 100 + qIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <div
                        key={qIndex}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50"
                        >
                          <span className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </span>
                          <ChevronDownIcon
                            className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-gray-200 bg-gray-50 p-6">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Still have questions?</h2>
            <p className="mt-2 text-primary-100">
              Our team is here to help you get started
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:support@schoolos.co.za"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 hover:bg-gray-100"
              >
                Email Support
              </a>
              <a
                href="tel:+27736439458"
                className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
