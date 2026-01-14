import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 11, 2026 | Effective Date: January 11, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-8 prose prose-slate max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using SchoolOS ("the Service", "the Platform", "we", "us", "our"), operated by SchoolOS (Pty) Ltd, 
              you ("Customer", "School", "you", "your") agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-3">
              SchoolOS provides a cloud-based school management system including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Student and staff management</li>
              <li>Payment tracking and invoicing</li>
              <li>Class scheduling and timetables</li>
              <li>Announcements and communications</li>
              <li>School media gallery</li>
              <li>Subscription management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Trial Period</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>New customers receive a <strong>14-day free trial</strong> upon registration</li>
              <li>Credit card or payment method required at registration (not charged during trial)</li>
              <li>Trial converts to paid subscription automatically after 14 days unless cancelled</li>
              <li><strong>One trial per organization</strong> - email address, school name, and phone number are tracked to prevent abuse</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Account Information</h3>
            <p className="text-gray-700 mb-3">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Plans and Pricing</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Available Plans</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">Starter Plan</h4>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li>Up to 200 students</li>
                  <li>Up to 10 staff members</li>
                  <li>5GB cloud storage</li>
                  <li>Basic features</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900">Professional Plan</h4>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li>Up to 500 students</li>
                  <li>Up to 30 staff members</li>
                  <li>20GB cloud storage</li>
                  <li>Advanced features including analytics and parent portal</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">Enterprise Plan</h4>
                <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
                  <li>Unlimited students and staff</li>
                  <li>100GB cloud storage</li>
                  <li>All features including API access and custom branding</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Price Increases</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">⚠️ IMPORTANT:</p>
              <p className="text-gray-700">
                We reserve the right to increase subscription fees by up to <strong>10% annually</strong> to account 
                for inflation, operational costs, and service improvements.
              </p>
            </div>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Price increases will be communicated via email <strong>at least 30 days in advance</strong></li>
              <li>New pricing takes effect at your next renewal date (not mid-subscription)</li>
              <li>You may cancel your subscription before the price increase takes effect</li>
              <li>Continued use of the Service after notification constitutes acceptance of new pricing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Billing and Payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Payment Authorization</h3>
            <p className="text-gray-700 mb-3">By providing payment information, you authorize us to charge your payment method:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>After your 14-day trial ends (first charge)</li>
              <li>Monthly on your subscription renewal date</li>
              <li>For any applicable taxes, fees, or charges</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Payment Processing</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Payments are processed through <strong>Paystack</strong>, a third-party payment processor</li>
              <li>We do not store your full credit card information</li>
              <li>You agree to Paystack's terms and conditions</li>
              <li>All payments are in South African Rand (ZAR)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Failed Payments</h3>
            <p className="text-gray-700 mb-3">If a payment fails:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You will receive email notification</li>
              <li>Your account enters a <strong>7-day grace period</strong> during which access continues</li>
              <li>We will attempt to charge your payment method up to <strong>3 times</strong></li>
              <li>After 3 failed attempts, your account will be <strong>suspended</strong></li>
              <li>Access is restored immediately upon successful payment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Trial Period</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>No charges apply during the 14-day trial period</li>
              <li>Cancel anytime during trial to avoid charges</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Paid Subscriptions</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>No refunds</strong> for partial months or unused service</li>
              <li><strong>No refunds</strong> if your account is suspended or terminated due to violation of these Terms</li>
              <li>Refunds may be issued at our sole discretion in cases of service outage exceeding 48 consecutive hours, 
                  billing errors, or other exceptional circumstances</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Ownership and Privacy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Your Data</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You retain all rights to data you input into the Service ("Customer Data")</li>
              <li>Customer Data includes: student records, staff information, financial data, documents, images</li>
              <li>We do not own, control, or claim any rights to your Customer Data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4 Data Retention</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Active accounts: Data retained indefinitely while subscription is active</li>
              <li>Cancelled accounts: Data retained for <strong>30 days</strong> after cancellation</li>
              <li>Suspended accounts: Data retained for <strong>30 days</strong> after suspension</li>
              <li>After retention period: Data is permanently deleted and cannot be recovered</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.5 Data Export</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You may export your data at any time via the dashboard</li>
              <li>Upon cancellation, you have 30 days to export your data</li>
              <li>Export formats: CSV, Excel, PDF</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1 Prohibited Activities</h3>
            <p className="text-gray-700 mb-3">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Use the Service for any illegal activities</li>
              <li>Store or transmit illegal, harmful, or offensive content</li>
              <li>Attempt to gain unauthorized access to the Service or other accounts</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to scrape or data mine the Service</li>
              <li>Resell, sublicense, or redistribute the Service</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <div className="bg-gray-100 border-l-4 border-gray-400 p-4 my-4">
              <p className="text-gray-700 font-semibold mb-2">Disclaimer:</p>
              <p className="text-gray-700 text-sm">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
            </div>
            <p className="text-gray-700 mb-3">
              To the maximum extent permitted by law, our total liability to you for any claims arising from these Terms 
              or the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. POPIA Compliance (South African Privacy Law)</h2>
            <p className="text-gray-700 mb-3">
              We process personal information in accordance with the Protection of Personal Information Act (POPIA).
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Subject Rights</h3>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of information (subject to legal retention requirements)</li>
              <li>Object to processing</li>
              <li>Lodge complaints with the Information Regulator</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Student Data Protection</h2>
            <p className="text-gray-700 mb-3">
              Student records contain sensitive information including minors' data. We implement additional safeguards:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Access limited to authorized school personnel only</li>
              <li>Audit logs of all data access</li>
              <li>Multi-tenant isolation ensures schools cannot access other schools' data</li>
              <li>Encryption of sensitive fields (ID numbers, medical information)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-3">
              We reserve the right to modify these Terms at any time. Changes will be:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Posted on our website with "Last Updated" date</li>
              <li>Communicated via email for material changes</li>
              <li>Effective 30 days after notification</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Continued use of the Service after changes take effect constitutes acceptance of modified Terms. 
              If you do not agree, you must cancel your subscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">For questions about these Terms:</p>
              <div className="space-y-1 text-gray-700 text-sm">
                <p><strong>Email:</strong> legal@schoolos.co.za</p>
                <p><strong>Phone:</strong> +27 21 123 4567</p>
                <p><strong>Support:</strong> support@schoolos.co.za</p>
                <p><strong>Address:</strong> 123 Education Street, Cape Town, 8001, South Africa</p>
              </div>
            </div>
          </section>

          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 italic">
              By clicking "I Agree" or using the Service, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
            <div className="mt-6 text-center">
              <p className="text-gray-700 font-semibold">SchoolOS (Pty) Ltd</p>
              <p className="text-sm text-gray-500">Version 1.0 - January 11, 2026</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Previous Page
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 SchoolOS (Pty) Ltd. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="/privacy-policy" className="hover:text-gray-700">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
              <a href="/contact" className="hover:text-gray-700">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
