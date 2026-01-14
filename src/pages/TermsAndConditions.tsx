import { Link } from 'react-router-dom'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

export default function TermsAndConditions() {
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
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-gray-500">Last Updated: January 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-8 rounded-lg bg-white p-8 shadow-sm">
            {/* 1. Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to SchoolOS. These Terms and Conditions ("Terms") govern your access to and use of the SchoolOS platform, 
                services, and software (collectively, the "Service"). By accessing or using our Service, you agree to be bound by 
                these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* 2. Service Description */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Service Description</h2>
              <p className="mb-3 text-gray-700">
                SchoolOS is a comprehensive school administration platform designed for South African educational institutions. 
                Our Service provides tools for:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Student and staff management</li>
                <li>Payment processing and tracking</li>
                <li>Timetable and class management</li>
                <li>School photo gallery management</li>
                <li>Communication and announcements</li>
                <li>Reporting and analytics</li>
              </ul>
            </section>

            {/* 3. Subscription and Billing */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">3. Subscription and Billing</h2>
              
              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.1 Subscription Plans</h3>
              <p className="mb-3 text-gray-700">
                We offer three subscription tiers: Starter, Professional, and Enterprise. Each plan has specific features, 
                user limits, and pricing as detailed on our Pricing page.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.2 Billing Cycle</h3>
              <p className="mb-3 text-gray-700">
                Subscriptions are billed monthly in South African Rand (ZAR). Billing occurs on the same day each month 
                as your subscription start date. Payment is due at the beginning of each billing cycle.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.3 Annual Price Increases</h3>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="font-semibold text-amber-900">⚠️ Important Notice:</p>
                <p className="mt-2 text-amber-800">
                  <strong>Subscription prices are subject to an annual increase</strong> to account for inflation, 
                  infrastructure costs, and service improvements. Price increases will:
                </p>
                <ul className="ml-6 mt-2 list-disc space-y-1 text-amber-800">
                  <li>Occur once per calendar year (typically in January)</li>
                  <li>Not exceed 10% of your current subscription rate</li>
                  <li>Be communicated to you at least 30 days in advance via email</li>
                  <li>Take effect from your next billing cycle after the notice period</li>
                </ul>
                <p className="mt-3 text-amber-800">
                  If you do not accept the price increase, you may cancel your subscription before the new rate takes effect 
                  without penalty.
                </p>
              </div>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.4 Payment Methods</h3>
              <p className="mb-3 text-gray-700">
                We accept payment via bank transfer, credit/debit card, and other methods as specified in your account. 
                You authorize us to charge your chosen payment method on each billing cycle.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.5 Failed Payments</h3>
              <p className="mb-3 text-gray-700">
                If payment fails, your account will enter a 7-day grace period during which the Service remains accessible. 
                If payment is not received within this period, your account will be suspended. After 30 days of suspension, 
                your account and data may be permanently deleted.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">3.6 Refund Policy</h3>
              <p className="mb-3 text-gray-700">
                Subscriptions are non-refundable. If you cancel your subscription, you will retain access to the Service 
                until the end of your current billing period. No refunds will be provided for partial months.
              </p>
            </section>

            {/* 4. Free Trial */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Free Trial</h2>
              <p className="mb-3 text-gray-700">
                We offer a 30-day free trial for new customers. No credit card is required to start your trial. 
                At the end of the trial period, you must subscribe to a paid plan to continue using the Service. 
                Trial accounts may have limited features compared to paid subscriptions.
              </p>
            </section>

            {/* 5. Account Registration */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Account Registration and Security</h2>
              <p className="mb-3 text-gray-700">
                To use SchoolOS, you must register an account. You agree to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Maintain the security of your account credentials</li>
                <li>Immediately notify us of any unauthorized access to your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            {/* 6. Data Privacy and Protection */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Data Privacy and Protection</h2>
              <p className="mb-3 text-gray-700">
                We are committed to protecting your data and complying with the Protection of Personal Information Act (POPIA). 
                Our data practices include:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Compliance with South African data protection laws</li>
                <li>Limited access to personal data (need-to-know basis)</li>
                <li>Option to export or delete your data upon request</li>
              </ul>
              <p className="mt-3 text-gray-700">
                For more details, please review our Privacy Policy.
              </p>
            </section>

            {/* 7. Acceptable Use */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Acceptable Use Policy</h2>
              <p className="mb-3 text-gray-700">
                You agree not to use the Service to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful code, viruses, or malware</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Resell or redistribute the Service without authorization</li>
              </ul>
            </section>

            {/* 8. Intellectual Property */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Intellectual Property</h2>
              <p className="mb-3 text-gray-700">
                The SchoolOS platform, including its software, design, content, and trademarks, is owned by SchoolOS and 
                protected by copyright, trademark, and other intellectual property laws. You are granted a limited, 
                non-exclusive, non-transferable license to use the Service during your subscription period.
              </p>
              <p className="text-gray-700">
                You retain ownership of any content you upload to SchoolOS (student data, images, etc.). By uploading 
                content, you grant us a license to store, process, and display that content as necessary to provide the Service.
              </p>
            </section>

            {/* 9. Service Availability */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Service Availability and Support</h2>
              <p className="mb-3 text-gray-700">
                We strive to maintain 99.5% uptime but cannot guarantee uninterrupted access to the Service. Scheduled 
                maintenance will be communicated in advance when possible. Support levels vary by subscription tier:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li><strong>Starter:</strong> Email support (48-hour response time)</li>
                <li><strong>Professional:</strong> Email and phone support (24-hour response time)</li>
                <li><strong>Enterprise:</strong> 24/7 dedicated support with priority response</li>
              </ul>
            </section>

            {/* 10. Termination */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Termination</h2>
              
              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">10.1 By You</h3>
              <p className="mb-3 text-gray-700">
                You may cancel your subscription at any time through your account settings. Cancellation takes effect at 
                the end of your current billing period. You will continue to have access until that date.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">10.2 By Us</h3>
              <p className="mb-3 text-gray-700">
                We reserve the right to suspend or terminate your account if you violate these Terms, fail to pay fees, 
                or engage in fraudulent activity. We will provide notice when possible, but immediate termination may occur 
                in cases of serious violations.
              </p>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900">10.3 Data Retention</h3>
              <p className="mb-3 text-gray-700">
                Upon termination, you have 30 days to export your data. After 30 days, your data may be permanently deleted. 
                We may retain certain information as required by law or for legitimate business purposes.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">11. Limitation of Liability</h2>
              <p className="mb-3 text-gray-700">
                To the maximum extent permitted by law, SchoolOS shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including loss of profits, data, or goodwill. Our total liability shall 
                not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
              <p className="text-gray-700">
                We provide the Service "as is" without warranties of any kind, either express or implied. We do not warrant 
                that the Service will be error-free or uninterrupted.
              </p>
            </section>

            {/* 12. Changes to Terms */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">12. Changes to These Terms</h2>
              <p className="mb-3 text-gray-700">
                We may update these Terms from time to time. Changes will be communicated via email and posted on our website. 
                Continued use of the Service after changes take effect constitutes acceptance of the new Terms. Material changes 
                will be communicated at least 30 days in advance.
              </p>
            </section>

            {/* 13. Governing Law */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">13. Governing Law and Disputes</h2>
              <p className="mb-3 text-gray-700">
                These Terms are governed by the laws of South Africa. Any disputes arising from these Terms or your use of 
                the Service shall be resolved in the courts of South Africa.
              </p>
            </section>

            {/* 14. Contact Information */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">14. Contact Information</h2>
              <p className="mb-3 text-gray-700">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@schoolos.co.za<br />
                  <strong>Support:</strong> support@schoolos.co.za<br />
                  <strong>Phone:</strong> +27 11 123 4567
                </p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="border-t pt-6">
              <p className="text-sm text-gray-600">
                By using SchoolOS, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
