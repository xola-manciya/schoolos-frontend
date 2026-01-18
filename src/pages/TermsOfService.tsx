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
            Last Updated: January 18, 2026 | Effective Date: January 18, 2026
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
              <li>New customers receive a <strong>1-month (30-day) free trial</strong> upon registration</li>
              <li>No credit card required during trial period</li>
              <li>Export features (Excel/CSV) are disabled during trial</li>
              <li>Trial converts to paid subscription automatically after 30 days unless cancelled</li>
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

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Data Storage and Location</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">⚠️ IMPORTANT - DATA STORAGE OUTSIDE SOUTH AFRICA:</p>
              <p className="text-gray-700 mb-2">
                Your data is stored on cloud infrastructure that <strong>may be located outside the Republic of South Africa</strong>. 
                By using this Service, you explicitly consent to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>The transfer of your data to servers located outside South Africa</li>
                <li>Processing and storage of data in jurisdictions that may have different privacy laws</li>
                <li>Cross-border data transfers as necessary for service delivery</li>
              </ul>
            </div>
            <p className="text-gray-700 mb-3">
              We utilize industry-leading cloud providers (Cloudflare R2, AWS, Brevo) to ensure:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Data redundancy</strong> across multiple geographic locations for disaster recovery</li>
              <li><strong>99.9% uptime</strong> and service availability</li>
              <li><strong>Enterprise-grade security</strong> with encryption in transit and at rest</li>
              <li><strong>Compliance</strong> with international data protection standards (GDPR-compliant infrastructure)</li>
              <li><strong>Regular backups</strong> to prevent data loss</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Data Security Measures</h3>
            <p className="text-gray-700 mb-3">We implement the following security measures:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Encryption:</strong> AES-256 encryption for data at rest, TLS 1.3 for data in transit</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC) with least privilege principle</li>
              <li><strong>Authentication:</strong> Multi-factor authentication (MFA) available for all users</li>
              <li><strong>Audit Logging:</strong> Comprehensive logs of all data access and modifications</li>
              <li><strong>Network Security:</strong> Firewall protection, DDoS mitigation, intrusion detection</li>
              <li><strong>Data Isolation:</strong> Multi-tenant architecture ensuring schools cannot access each other's data</li>
              <li><strong>Regular Security Audits:</strong> Periodic vulnerability assessments and penetration testing</li>
              <li><strong>Incident Response:</strong> 24/7 monitoring and rapid response to security incidents</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4 Data Retention</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Active accounts: Data retained indefinitely while subscription is active</li>
              <li>Cancelled accounts: Data retained for <strong>30 days</strong> after cancellation for recovery</li>
              <li>Suspended accounts: Data retained for <strong>30 days</strong> after suspension</li>
              <li>After retention period: Data is <strong>permanently and irreversibly deleted</strong> from all systems including backups</li>
              <li>Legal holds: Data may be retained longer if required by law or court order</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.5 Data Export and Portability</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You may export your data at any time via the dashboard (excluding trial accounts)</li>
              <li>Upon cancellation, you have <strong>30 days</strong> to export your data before permanent deletion</li>
              <li>Export formats: CSV, Excel (.xlsx), PDF</li>
              <li>Export includes: student records, staff information, payment history, documents</li>
              <li>We will assist with data export for a reasonable fee if you require custom formats or assistance</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.6 Data Breach Notification</h3>
            <p className="text-gray-700 mb-3">In the event of a data breach affecting your data:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>We will notify you <strong>within 72 hours</strong> of discovering the breach</li>
              <li>Notification will include: nature of breach, data affected, steps taken, recommended actions</li>
              <li>We will report to the Information Regulator as required by POPIA</li>
              <li>We will cooperate fully with regulatory investigations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. POPIA Compliance (Protection of Personal Information Act)</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">🇿🇦 South African Privacy Law Compliance</p>
              <p className="text-gray-700">
                We process personal information in strict accordance with the Protection of Personal Information Act, 2013 (POPIA).
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1 Lawful Processing</h3>
            <p className="text-gray-700 mb-3">We process personal information based on:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Consent:</strong> Your acceptance of these Terms constitutes consent for data processing</li>
              <li><strong>Contractual necessity:</strong> Processing required to provide the Service</li>
              <li><strong>Legitimate interests:</strong> Service improvement, security, fraud prevention</li>
              <li><strong>Legal obligation:</strong> Compliance with South African laws (Tax, FICA, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.2 Data Subject Rights (Your Rights)</h3>
            <p className="text-gray-700 mb-3">Under POPIA, you and your data subjects have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Access:</strong> Request copies of personal information we hold</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion (subject to legal retention requirements)</li>
              <li><strong>Objection:</strong> Object to processing for direct marketing or legitimate interests</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Data Portability:</strong> Receive personal information in a structured, machine-readable format</li>
              <li><strong>Lodge Complaints:</strong> File complaints with the Information Regulator of South Africa</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, contact our Information Officer at: <strong>privacy@schoolos.co.za</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.3 Information Officer Details</h3>
            <div className="bg-gray-50 border border-gray-200 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">Information Officer (POPIA Compliance):</p>
              <div className="space-y-1 text-gray-700 text-sm">
                <p><strong>Name:</strong> [TO BE APPOINTED]</p>
                <p><strong>Email:</strong> privacy@schoolos.co.za</p>
                <p><strong>Phone:</strong> +27 21 123 4567</p>
                <p><strong>Address:</strong> 123 Education Street, Cape Town, 8001, South Africa</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.4 Children's Data Protection</h3>
            <p className="text-gray-700 mb-3">
              This Service processes personal information of minors (under 18). Special protections apply:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Parental Consent:</strong> Schools must obtain consent from parents/guardians before submitting minor's data</li>
              <li><strong>Restricted Processing:</strong> Children's data used only for educational administration purposes</li>
              <li><strong>No Marketing:</strong> We never use children's data for marketing or third-party advertising</li>
              <li><strong>Enhanced Security:</strong> Additional safeguards for sensitive minor information</li>
              <li><strong>Right to Be Forgotten:</strong> Parents may request deletion of their child's data (subject to legal retention)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.5 Special Personal Information</h3>
            <p className="text-gray-700 mb-3">
              We may process special categories of personal information (race, health, biometric data) with explicit consent:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Medical Information:</strong> Only if provided for emergency or accommodation purposes</li>
              <li><strong>Racial Data:</strong> Only if required for statutory reporting (e.g., EMIS reporting)</li>
              <li><strong>Photographs:</strong> Only with consent for identification or school activities</li>
              <li><strong>Minimization:</strong> We collect only what is necessary for service provision</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.6 Information Regulator Contact</h3>
            <p className="text-gray-700 mb-2">
              If you are unsatisfied with our handling of your complaint, you may escalate to:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">Information Regulator (South Africa):</p>
              <div className="space-y-1 text-gray-700 text-sm">
                <p><strong>Website:</strong> www.justice.gov.za/inforeg</p>
                <p><strong>Email:</strong> inforeg@justice.gov.za</p>
                <p><strong>Phone:</strong> +27 12 406 4818</p>
                <p><strong>Address:</strong> JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Student Data Protection and Educational Records</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Sensitive Student Information</h3>
            <p className="text-gray-700 mb-3">
              Student records contain highly sensitive information. We implement additional safeguards:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Access Control:</strong> Limited to authorized school personnel with need-to-know only</li>
              <li><strong>Role-Based Permissions:</strong> Principals, HODs, Teachers, Clerks have different access levels</li>
              <li><strong>Audit Trails:</strong> All access to student records is logged with timestamp and user identity</li>
              <li><strong>Field-Level Encryption:</strong> ID numbers, medical records, financial data encrypted separately</li>
              <li><strong>Multi-Tenant Isolation:</strong> Schools cannot access other schools' data (technical + contractual guarantees)</li>
              <li><strong>No Third-Party Sharing:</strong> We never sell, rent, or share student data with third parties</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 School Responsibilities</h3>
            <p className="text-gray-700 mb-3">As the customer, you (the school) are the responsible party for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Lawful Collection:</strong> Obtaining proper consent from parents/guardians before uploading student data</li>
              <li><strong>Data Accuracy:</strong> Ensuring information uploaded is accurate and up to date</li>
              <li><strong>Access Management:</strong> Assigning appropriate roles and permissions to staff members</li>
              <li><strong>User Training:</strong> Training staff on proper use of the system and data protection</li>
              <li><strong>Incident Reporting:</strong> Notifying us immediately of suspected unauthorized access</li>
              <li><strong>Compliance:</strong> Ensuring your use complies with South African Schools Act and other educational regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 Educational Records Retention</h3>
            <p className="text-gray-700 mb-3">
              We acknowledge schools may have legal obligations to retain educational records:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Export your data regularly for your own archival purposes</li>
              <li>We are <strong>not responsible</strong> for maintaining records beyond the 30-day cancellation period</li>
              <li>You remain the custodian of educational records per the South African Schools Act</li>
              <li>We recommend maintaining separate backups for regulatory compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 Prohibited Activities</h3>
            <p className="text-gray-700 mb-3">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Use the Service for any illegal activities or purposes</li>
              <li>Store or transmit illegal, harmful, defamatory, or offensive content</li>
              <li>Violate any South African laws including Cybercrimes Act, 2020</li>
              <li>Attempt to gain unauthorized access to the Service, other accounts, or systems</li>
              <li>Interfere with or disrupt the Service, servers, or networks</li>
              <li>Use automated systems (bots, scrapers) to access or data mine the Service</li>
              <li>Resell, sublicense, redistribute, or timeshare the Service</li>
              <li>Reverse engineer, decompile, disassemble, or derive source code from the Service</li>
              <li>Remove, obscure, or alter any copyright, trademark, or proprietary notices</li>
              <li>Upload viruses, malware, or any malicious code</li>
              <li>Share your login credentials with unauthorized persons</li>
              <li>Use the Service to spam, harass, or threaten individuals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Consequences of Violation</h3>
            <p className="text-gray-700 mb-3">Violations may result in:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Immediate suspension or termination of your account</li>
              <li>Forfeiture of all fees paid (no refund)</li>
              <li>Legal action and reporting to law enforcement</li>
              <li>Liability for damages and legal fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 Our Intellectual Property</h3>
            <p className="text-gray-700 mb-3">
              The Service, including all software, code, algorithms, designs, trademarks, and content is owned by 
              SchoolOS (Pty) Ltd and protected by:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Copyright Act 98 of 1978 (South Africa)</li>
              <li>Trademarks Act 194 of 1993 (South Africa)</li>
              <li>International intellectual property treaties</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You receive a limited, non-exclusive, non-transferable license to use the Service. All rights not 
              expressly granted are reserved.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Your Content License to Us</h3>
            <p className="text-gray-700 mb-3">
              By uploading content to the Service (photos, documents, announcements), you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Store, process, and transmit your content to provide the Service</li>
              <li>Backup and archive content for disaster recovery</li>
              <li>Display content to authorized users within your school</li>
            </ul>
            <p className="text-gray-700 mt-3">
              <strong>We will NOT:</strong> Use your content for marketing, training AI models, or any purpose beyond service provision 
              without explicit written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Services and Integrations</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Payment Processing</h3>
            <p className="text-gray-700 mb-3">
              Payments are processed by <strong>Paystack (Pty) Ltd</strong>, a third-party payment service provider:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You agree to Paystack's Terms of Service and Privacy Policy</li>
              <li>We do not store your full credit card details</li>
              <li>Paystack is PCI DSS Level 1 compliant</li>
              <li>Payment disputes should be directed to Paystack support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Email Service Provider</h3>
            <p className="text-gray-700 mb-3">
              Email notifications are sent via <strong>Brevo (formerly Sendinblue)</strong>:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Email addresses are shared with Brevo for delivery</li>
              <li>Brevo is GDPR-compliant and has servers in EU and globally</li>
              <li>Email content may include: password resets, payment notifications, system alerts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Cloud Storage Providers</h3>
            <p className="text-gray-700 mb-3">
              File storage utilizes <strong>Cloudflare R2</strong> and/or <strong>AWS S3</strong>:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Files (photos, documents) may be stored outside South Africa</li>
              <li>All files are encrypted at rest (AES-256)</li>
              <li>Access is restricted through secure authentication</li>
              <li>These providers are ISO 27001 certified</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.4 Analytics and Monitoring</h3>
            <p className="text-gray-700 mb-3">
              We use analytics tools to improve service performance:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Google Analytics:</strong> For usage statistics (anonymized)</li>
              <li><strong>Error Tracking:</strong> To identify and fix bugs</li>
              <li><strong>Performance Monitoring:</strong> To ensure service reliability</li>
            </ul>
            <p className="text-gray-700 mt-3">
              <strong>Important:</strong> We do NOT share personally identifiable student data with analytics providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Limitation of Liability and Disclaimers</h2>
            
            <div className="bg-gray-100 border-l-4 border-gray-500 p-4 my-4">
              <p className="text-gray-700 font-semibold mb-2">DISCLAIMER OF WARRANTIES:</p>
              <p className="text-gray-700 text-sm">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                NON-INFRINGEMENT, OR UNINTERRUPTED/ERROR-FREE OPERATION.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.1 Service Availability</h3>
            <p className="text-gray-700 mb-3">
              While we strive for 99.9% uptime, we do not guarantee uninterrupted access. We are not liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Service interruptions due to maintenance, updates, or technical issues</li>
              <li>Internet connectivity problems (ISP, network infrastructure)</li>
              <li>Force majeure events (natural disasters, wars, pandemics, riots, strikes)</li>
              <li>Third-party service failures (hosting, payment processors, email providers)</li>
              <li>Cyberattacks, DDoS attacks, or malicious third-party actions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.2 Limitation of Liability</h3>
            <p className="text-gray-700 mb-3">
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY SOUTH AFRICAN LAW:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Our total liability for any claims arising from these Terms or the Service shall not exceed 
                  <strong> the amount you paid us in the 12 months preceding the claim</strong></li>
              <li>We are NOT liable for indirect, incidental, consequential, special, or punitive damages</li>
              <li>We are NOT liable for lost profits, revenue, data, or business opportunities</li>
              <li>We are NOT liable for reputational damage or emotional distress</li>
              <li>We are NOT liable for third-party actions or content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.3 Your Responsibilities</h3>
            <p className="text-gray-700 mb-3">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You are responsible for maintaining backups of your critical data</li>
              <li>You are responsible for compliance with educational regulations (South African Schools Act, EMIS reporting, etc.)</li>
              <li>You are responsible for accuracy of data entered into the system</li>
              <li>You are responsible for obtaining necessary consents from parents/guardians</li>
              <li>You use the Service at your own risk</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.4 Indemnification</h3>
            <p className="text-gray-700 mb-3">
              You agree to indemnify, defend, and hold harmless SchoolOS (Pty) Ltd, its directors, officers, employees, 
              and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Your violation of these Terms</li>
              <li>Your violation of any law or regulation</li>
              <li>Your violation of third-party rights (privacy, intellectual property, etc.)</li>
              <li>Your negligent or willful misconduct</li>
              <li>Unauthorized access to your account due to your failure to safeguard credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Termination and Suspension</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Termination by You</h3>
            <p className="text-gray-700 mb-3">
              You may cancel your subscription at any time:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You will retain access until the paid period expires</li>
              <li>No refunds for unused time</li>
              <li>You have 30 days to export your data after cancellation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Suspension by Us</h3>
            <p className="text-gray-700 mb-3">
              We may suspend your account immediately without notice if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Payment fails after multiple attempts (see Section 5.4)</li>
              <li>You violate these Terms or Acceptable Use Policy</li>
              <li>Your account is subject to legal investigation or court order</li>
              <li>We suspect fraudulent activity or security breach</li>
              <li>Your usage threatens system stability or other customers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 Termination by Us</h3>
            <p className="text-gray-700 mb-3">
              We may terminate your account with 30 days' notice if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>We discontinue the Service entirely</li>
              <li>Required by law or regulatory authority</li>
              <li>You repeatedly violate these Terms</li>
            </ul>
            <p className="text-gray-700 mt-3">
              We may terminate immediately without notice for material breach or illegal activity.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.4 Effects of Termination</h3>
            <p className="text-gray-700 mb-3">
              Upon termination or expiration:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Your access to the Service ceases immediately</li>
              <li>Your data is retained for 30 days for recovery</li>
              <li>After 30 days, data is permanently deleted</li>
              <li>Outstanding payment obligations remain due</li>
              <li>Provisions regarding liability, indemnification, and dispute resolution survive termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Dispute Resolution and Governing Law</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.1 Governing Law</h3>
            <p className="text-gray-700 mb-3">
              These Terms are governed by the laws of the <strong>Republic of South Africa</strong>, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Protection of Personal Information Act, 2013 (POPIA)</li>
              <li>Electronic Communications and Transactions Act, 2002 (ECTA)</li>
              <li>Consumer Protection Act, 2008 (CPA)</li>
              <li>Cybercrimes Act, 2020</li>
              <li>Copyright Act 98 of 1978</li>
              <li>National Credit Act, 2005 (where applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.2 Jurisdiction</h3>
            <p className="text-gray-700 mb-3">
              You irrevocably submit to the non-exclusive jurisdiction of the <strong>High Court of South Africa, Western Cape Division, Cape Town</strong> 
              for any disputes arising from these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.3 Dispute Resolution Process</h3>
            <p className="text-gray-700 mb-3">
              Before initiating legal proceedings, parties agree to:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Informal Resolution (30 days):</strong> Contact us at <strong>legal@schoolos.co.za</strong> describing the dispute. 
                We will attempt good-faith resolution.
              </li>
              <li>
                <strong>Mediation (30 days):</strong> If unresolved, parties agree to mediation by a mutually agreed mediator 
                or one appointed by the Arbitration Foundation of Southern Africa (AFSA).
              </li>
              <li>
                <strong>Arbitration:</strong> If mediation fails, disputes shall be resolved by binding arbitration under AFSA rules.
              </li>
              <li>
                <strong>Court Proceedings:</strong> Only after exhausting above steps may parties proceed to court.
              </li>
            </ol>
            <p className="text-gray-700 mt-3">
              <strong>Exception:</strong> We may seek immediate injunctive relief in court for intellectual property violations 
              or breach of confidentiality without prior mediation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.4 Class Action Waiver</h3>
            <p className="text-gray-700 mb-3">
              You agree that disputes will be resolved individually, not as part of a class action. Each party waives the right to 
              participate in class actions or class-wide arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 mb-3">
              We reserve the right to modify these Terms at any time. Changes will be:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Posted on our website with updated "Last Updated" date</li>
              <li>Communicated via email for material changes (e.g., pricing, data handling, liability)</li>
              <li>Effective <strong>30 days</strong> after notification for material changes</li>
              <li>Effective immediately for minor changes (typo corrections, clarifications)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Continued use of the Service after changes take effect constitutes acceptance of modified Terms. 
              If you do not agree, you must cancel your subscription before the effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Miscellaneous Provisions</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.1 Entire Agreement</h3>
            <p className="text-gray-700 mb-3">
              These Terms, together with our Privacy Policy and any order forms, constitute the entire agreement between you and SchoolOS (Pty) Ltd 
              regarding the Service, superseding all prior agreements, understandings, and communications.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.2 Severability</h3>
            <p className="text-gray-700 mb-3">
              If any provision is found unenforceable, the remaining provisions remain in full force. The unenforceable provision 
              shall be modified to the minimum extent necessary to make it enforceable.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.3 No Waiver</h3>
            <p className="text-gray-700 mb-3">
              Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.4 Assignment</h3>
            <p className="text-gray-700 mb-3">
              You may not assign or transfer these Terms without our prior written consent. We may assign these Terms 
              to an affiliate or in connection with a merger, acquisition, or sale of assets.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.5 Force Majeure</h3>
            <p className="text-gray-700 mb-3">
              Neither party is liable for failure to perform due to causes beyond reasonable control, including: 
              natural disasters, wars, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, 
              accidents, pandemics, strikes, or shortages of transportation, fuel, energy, labor, or materials.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.6 Notices</h3>
            <p className="text-gray-700 mb-3">
              Legal notices must be sent to:
            </p>
            <ul className="list-none pl-0 text-gray-700 space-y-1">
              <li><strong>For SchoolOS:</strong> legal@schoolos.co.za | 123 Education Street, Cape Town, 8001</li>
              <li><strong>For You:</strong> The email address associated with your account</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Notices are effective upon receipt (email) or 3 business days after mailing (postal).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.7 Language</h3>
            <p className="text-gray-700 mb-3">
              These Terms are drafted in English. Any translation is provided for convenience only. In case of conflict, 
              the English version prevails.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">17.8 Survival</h3>
            <p className="text-gray-700 mb-3">
              The following sections survive termination: Data Ownership, Intellectual Property, Limitation of Liability, 
              Indemnification, Dispute Resolution, and any obligations accrued prior to termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contact Information</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-3">For questions, concerns, or requests regarding these Terms:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                <div>
                  <p className="font-semibold mb-2">General Inquiries:</p>
                  <p><strong>Email:</strong> info@schoolos.co.za</p>
                  <p><strong>Phone:</strong> +27 21 123 4567</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Legal & Compliance:</p>
                  <p><strong>Email:</strong> legal@schoolos.co.za</p>
                  <p><strong>Privacy:</strong> privacy@schoolos.co.za</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Technical Support:</p>
                  <p><strong>Email:</strong> support@schoolos.co.za</p>
                  <p><strong>Portal:</strong> help.schoolos.co.za</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Billing & Payments:</p>
                  <p><strong>Email:</strong> billing@schoolos.co.za</p>
                  <p><strong>Phone:</strong> +27 21 123 4567</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="font-semibold mb-2">Registered Office:</p>
                <p>SchoolOS (Pty) Ltd</p>
                <p>123 Education Street</p>
                <p>Cape Town, Western Cape, 8001</p>
                <p>South Africa</p>
                <p className="mt-2"><strong>Company Registration:</strong> [TO BE REGISTERED]</p>
                <p><strong>VAT Number:</strong> [TO BE REGISTERED]</p>
              </div>
            </div>
          </section>

          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-800 font-semibold mb-2">⚠️ IMPORTANT ACKNOWLEDGMENTS:</p>
              <ul className="list-disc pl-6 text-red-700 text-sm space-y-1">
                <li>You acknowledge that data may be stored outside South Africa</li>
                <li>You acknowledge cross-border data transfer risks and consent to such transfers</li>
                <li>You acknowledge the limitation of liability provisions</li>
                <li>You acknowledge responsibility for obtaining parental/guardian consents</li>
                <li>You acknowledge responsibility for maintaining your own data backups</li>
                <li>You acknowledge that continued use after material changes constitutes acceptance</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600 italic mb-4">
              By clicking "I Agree", registering an account, or using the Service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service in their entirety, including all notices, 
              disclaimers, and limitations of liability.
            </p>
            
            <div className="mt-6 text-center">
              <p className="text-gray-700 font-semibold">SchoolOS (Pty) Ltd</p>
              <p className="text-sm text-gray-500">Registered in South Africa</p>
              <p className="text-sm text-gray-500">Version 2.0 - January 18, 2026</p>
              <p className="text-xs text-gray-400 mt-2">
                These Terms were prepared in compliance with POPIA, ECTA, CPA, and other applicable South African laws
              </p>
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
