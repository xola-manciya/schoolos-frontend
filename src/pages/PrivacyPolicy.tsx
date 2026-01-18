import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { AcademicCapIcon, ShieldCheckIcon, LockClosedIcon, GlobeAltIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Privacy Policy - POPIA & PAIA Compliant | SchoolOS"
        description="SchoolOS Privacy Policy. Learn how we collect, use, protect, and share your data in compliance with POPIA and PAIA. Your privacy is our priority."
        keywords="privacy policy, POPIA compliance, PAIA, data protection, school data privacy, South Africa privacy laws"
        canonical="https://schoolos.co.za/privacy-policy"
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">SchoolOS</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600">Home</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-600">Pricing</Link>
              <Link to="/faq" className="text-gray-700 hover:text-primary-600">FAQ</Link>
              <Link to="/login" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldCheckIcon className="h-16 w-16 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-600">
              POPIA & PAIA Compliant | Last Updated: January 18, 2026
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <span>POPIA Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                <span>PAIA Registered</span>
              </div>
              <div className="flex items-center gap-1">
                <LockClosedIcon className="h-5 w-5 text-purple-600" />
                <span>ISO 27001 Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              SchoolOS (Pty) Ltd ("we", "us", "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our school management platform.
            </p>
            <p className="text-gray-700 mb-4">
              We are registered with the Information Regulator of South Africa and comply with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Protection of Personal Information Act, 2013 (POPIA)</strong> - Act No. 4 of 2013</li>
              <li><strong>Promotion of Access to Information Act, 2000 (PAIA)</strong> - Act No. 2 of 2000</li>
              <li><strong>Electronic Communications and Transactions Act, 2002 (ECTA)</strong> - Act No. 25 of 2002</li>
              <li><strong>Children's Act, 2005</strong> - Sections 129-133 (Protection of children's personal information)</li>
            </ul>
          </section>

          {/* Information Officer */}
          <section className="mb-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Officer (POPIA Requirement)</h2>
            <p className="text-gray-700 mb-3">
              As required by Section 55 of POPIA, we have appointed an Information Officer responsible for ensuring compliance with data protection laws:
            </p>
            <div className="bg-white p-4 rounded border border-blue-300">
              <p className="text-gray-900 font-semibold">SchoolOS Information Officer</p>
              <p className="text-gray-700">Email: <a href="mailto:privacy@schoolos.co.za" className="text-primary-600 hover:underline">privacy@schoolos.co.za</a></p>
              <p className="text-gray-700">Address: [Your Physical Address], South Africa</p>
              <p className="text-gray-700">Phone: [Your Contact Number]</p>
            </div>
          </section>

          {/* What Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 School Administrator Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full name, email address, phone number</li>
              <li>School name, registration number, physical address</li>
              <li>Job title, role, and permissions</li>
              <li>Login credentials (encrypted passwords)</li>
              <li>IP addresses, device information, session logs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Student Information (Special Personal Information - POPIA Section 26)</h3>
            <p className="text-gray-700 mb-3">
              <strong>Note:</strong> Student data is classified as "special personal information" under POPIA because it concerns children. We collect only the minimum necessary information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Student ID, full name, date of birth, grade/class</li>
              <li>Guardian/parent contact information</li>
              <li>Payment records and financial transactions</li>
              <li>Attendance and academic records</li>
              <li>Emergency contact details</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Staff Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full name, ID number, contact details</li>
              <li>Qualifications, employment history</li>
              <li>Leave records, performance evaluations</li>
              <li>Banking details (for payroll processing)</li>
              <li>Subject assignments and teaching schedules</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.4 Financial Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Bank statements (processed and deleted per retention policy)</li>
              <li>Payment transactions (amount, date, method, reference)</li>
              <li>Subscription and billing information</li>
              <li>Payment processor data (Paystack - third-party processor)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.5 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Cookies:</strong> Authentication tokens, session IDs, preferences</li>
              <li><strong>LocalStorage:</strong> Access tokens (JWT), refresh tokens, subscription status</li>
              <li><strong>Server Logs:</strong> IP addresses, timestamps, API requests, error logs</li>
              <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information (Lawful Processing - POPIA Section 11)</h2>
            
            <p className="text-gray-700 mb-4">We process personal information only for lawful purposes:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Contractual Necessity (POPIA Section 11(1)(b))</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide school management software services as per subscription agreement</li>
              <li>Process payments and maintain financial records</li>
              <li>Send service notifications and support communications</li>
              <li>Manage user accounts and access controls</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Legitimate Interests (POPIA Section 11(1)(f))</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Improve platform performance and user experience</li>
              <li>Detect, prevent, and investigate security incidents</li>
              <li>Analyze usage patterns for product development</li>
              <li>Conduct internal research and analytics (anonymized data)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Legal Obligations (POPIA Section 11(1)(c))</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Comply with court orders and legal processes</li>
              <li>Report to the Information Regulator when required</li>
              <li>Maintain audit trails for financial transactions</li>
              <li>Respond to law enforcement requests (with valid warrants)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.4 Consent (POPIA Section 11(1)(a))</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Send marketing communications (you can opt-out anytime)</li>
              <li>Use cookies for analytics (see Cookie Consent banner)</li>
              <li>Share anonymized data for research (with your consent)</li>
            </ul>
          </section>

          {/* LocalStorage and Cookies */}
          <section className="mb-12 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LockClosedIcon className="h-6 w-6 text-yellow-600" />
              5. Cookies & LocalStorage (Your Consent Required)
            </h2>
            
            <p className="text-gray-700 mb-4">
              We use browser storage technologies to provide essential functionality and improve your experience:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">5.1 Essential Cookies & Storage (No Consent Needed)</h3>
            <p className="text-gray-700 mb-3">
              These are strictly necessary for the platform to function and cannot be disabled:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Authentication Tokens (LocalStorage):</strong> JWT access tokens (1 hour expiry) and refresh tokens (7 days)</li>
              <li><strong>Session Management:</strong> Your login state and user role</li>
              <li><strong>Security:</strong> CSRF tokens, device fingerprints for fraud prevention</li>
              <li><strong>Purpose:</strong> Keep you logged in and secure your session</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Functional Storage (Requires Consent)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>User Preferences:</strong> Dashboard layout, theme settings, language preference</li>
              <li><strong>Trial/Subscription Status:</strong> Grace period warnings, subscription expiry notices</li>
              <li><strong>Data:</strong> trial_expired, grace_days_remaining, subscription_expired flags</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Your Control Over Storage</h3>
            <div className="bg-white p-4 rounded border border-yellow-300">
              <p className="text-gray-700 mb-2">✅ <strong>Clear Storage:</strong> Log out to remove all tokens and data</p>
              <p className="text-gray-700 mb-2">✅ <strong>Browser Settings:</strong> Clear cookies/storage via browser settings</p>
              <p className="text-gray-700 mb-2">✅ <strong>Automatic Cleanup:</strong> Tokens expire automatically (access: 1 hour, refresh: 7 days)</p>
              <p className="text-gray-700">⚠️ <strong>Note:</strong> Disabling essential storage will prevent login and core functionality</p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security & Protection Measures</h2>
            
            <p className="text-gray-700 mb-4">
              We implement industry-leading security measures to protect your data:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.1 Encryption & Transport Security</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>HTTPS/TLS 1.3:</strong> All data transmitted over encrypted connections</li>
              <li><strong>Database Encryption:</strong> Data encrypted at rest using AES-256</li>
              <li><strong>Password Hashing:</strong> PBKDF2 with SHA-256 (600,000 iterations)</li>
              <li><strong>JWT Tokens:</strong> Short-lived, signed, and rotated regularly</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Access Controls</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Role-Based Access (RBAC):</strong> Users see only data relevant to their role</li>
              <li><strong>School Data Isolation:</strong> Each school's data is completely separate</li>
              <li><strong>Multi-Factor Authentication (2FA):</strong> Available for all administrator accounts</li>
              <li><strong>Session Management:</strong> Max 3 concurrent sessions, automatic timeout</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.3 Infrastructure Security</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Hosting:</strong> Render.com (ISO 27001 certified, SOC 2 Type II compliant)</li>
              <li><strong>Database:</strong> Neon.tech PostgreSQL (encrypted backups, point-in-time recovery)</li>
              <li><strong>File Storage:</strong> Cloudflare R2 (S3-compatible, server-side encryption)</li>
              <li><strong>DDoS Protection:</strong> Cloudflare CDN with rate limiting</li>
              <li><strong>Web Application Firewall (WAF):</strong> Blocks malicious traffic and SQL injection attempts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.4 Audit Logging & Monitoring</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Payment Audit Logs:</strong> Every payment change tracked (who, what, when, why)</li>
              <li><strong>Subscription History:</strong> All plan changes, upgrades, cancellations logged</li>
              <li><strong>User Session Tracking:</strong> IP addresses, device fingerprints, login times</li>
              <li><strong>Security Logs:</strong> Failed login attempts, API abuse, suspicious activity</li>
              <li><strong>Retention:</strong> Audit logs retained for 7 years (SARS compliance)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.5 Automated Security Scanning</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Dependency Scanning:</strong> Snyk, npm audit, pnpm audit (weekly automated scans)</li>
              <li><strong>Code Analysis:</strong> Bandit (Python), ESLint (TypeScript), CodeQL</li>
              <li><strong>Secret Detection:</strong> TruffleHog prevents credential leaks</li>
              <li><strong>Vulnerability Alerts:</strong> GitHub Dependabot monitors 3rd-party libraries</li>
            </ul>
          </section>

          {/* Cross-Border Data Transfers */}
          <section className="mb-12 bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              7. Cross-Border Data Transfers (POPIA Section 72)
            </h2>
            
            <p className="text-gray-700 mb-4">
              <strong>Your data is primarily stored in South Africa.</strong> However, some third-party services process data internationally. We only use providers with adequate data protection safeguards:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">7.1 Data Processing Locations</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded border border-purple-300">
                <p className="font-semibold text-gray-900">🇿🇦 South Africa (Primary)</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm mt-2">
                  <li><strong>Neon.tech Database:</strong> Primary PostgreSQL instance (AWS Cape Town)</li>
                  <li><strong>Render Backend:</strong> API servers (EU/US regions with SA latency optimization)</li>
                  <li><strong>Paystack:</strong> Payment processing (Nigeria-based, PCI-DSS certified)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-purple-300">
                <p className="font-semibold text-gray-900">🇪🇺 European Union</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm mt-2">
                  <li><strong>Cloudflare:</strong> CDN, file storage, DDoS protection (GDPR compliant)</li>
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> EU Commission-approved data transfer agreements</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-purple-300">
                <p className="font-semibold text-gray-900">🇺🇸 United States</p>
                <ul className="list-disc pl-6 text-gray-700 text-sm mt-2">
                  <li><strong>AWS Infrastructure:</strong> Backup storage (encrypted, isolated to Cape Town region)</li>
                  <li><strong>GitHub:</strong> Code repository (not used for student/school data)</li>
                  <li><strong>Safeguards:</strong> SOC 2, ISO 27001, contractual data protection obligations</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.2 Safeguards for Cross-Border Transfers</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>✅ Standard Contractual Clauses (SCCs) with all international processors</li>
              <li>✅ Data Processing Agreements (DPAs) requiring POPIA-equivalent protections</li>
              <li>✅ ISO 27001 and SOC 2 Type II certifications mandatory for all vendors</li>
              <li>✅ Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>✅ Right to data localization: Contact us to keep 100% of data in South Africa</li>
              <li>✅ Annual vendor audits and compliance reviews</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">7.3 Your Right to Object</h3>
            <p className="text-gray-700">
              If you object to cross-border data transfers, you may request South Africa-only data processing. Contact our Information Officer at <a href="mailto:privacy@schoolos.co.za" className="text-primary-600 hover:underline">privacy@schoolos.co.za</a> to discuss options.
            </p>
          </section>

          {/* Your Rights (POPIA) */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights Under POPIA</h2>
            
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Access (Section 23)</h3>
                <p className="text-gray-700 text-sm">Request a copy of all personal information we hold about you.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Correction (Section 24)</h3>
                <p className="text-gray-700 text-sm">Request correction of inaccurate or incomplete data.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Deletion/Erasure (Section 15)</h3>
                <p className="text-gray-700 text-sm">Request deletion of your data (subject to legal retention requirements).</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Object (Section 11(3))</h3>
                <p className="text-gray-700 text-sm">Object to processing for direct marketing or legitimate interests.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Restriction (Section 11)</h3>
                <p className="text-gray-700 text-sm">Request temporary restriction of processing in certain circumstances.</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Data Portability (Section 16)</h3>
                <p className="text-gray-700 text-sm">Receive your data in a structured, machine-readable format (CSV/Excel export available).</p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Right to Lodge a Complaint (Section 74)</h3>
                <p className="text-gray-700 text-sm">File a complaint with the Information Regulator of South Africa.</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">How to Exercise Your Rights:</h3>
              <p className="text-gray-700 text-sm mb-2">Email: <a href="mailto:privacy@schoolos.co.za" className="text-primary-600 hover:underline">privacy@schoolos.co.za</a></p>
              <p className="text-gray-700 text-sm mb-2">Response Time: Within 30 days (as per PAIA Section 25)</p>
              <p className="text-gray-700 text-sm">Fee: Free for first request; subsequent requests may incur reasonable administrative fees</p>
            </div>
          </section>

          {/* PAIA (Access to Information) */}
          <section className="mb-12 bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. PAIA (Promotion of Access to Information Act)</h2>
            
            <p className="text-gray-700 mb-4">
              In terms of PAIA, you have the right to request access to records held by SchoolOS. We maintain a <strong>PAIA Manual</strong> describing:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Categories of records we hold</li>
              <li>How to submit access requests (Form A - Section 18)</li>
              <li>Processing fees and payment methods</li>
              <li>Grounds for refusing access (Section 63-69)</li>
              <li>Internal appeal procedures (Section 74)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.1 Categories of Records</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Statutory Records:</strong> Company registration, tax clearance, BEE certificates</li>
              <li><strong>Financial Records:</strong> Invoices, bank statements, payment histories</li>
              <li><strong>Operational Records:</strong> User agreements, subscription contracts, SLAs</li>
              <li><strong>Personnel Records:</strong> Staff employment contracts, performance reviews</li>
              <li><strong>Student Records:</strong> Enrollment data, payment records (school-specific)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.2 How to Request Access</h3>
            <div className="bg-white p-4 rounded border border-green-300">
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Download Form A from the Department of Justice website or email us</li>
                <li>Complete the form describing the records you need</li>
                <li>Submit to: <a href="mailto:paia@schoolos.co.za" className="text-primary-600 hover:underline">paia@schoolos.co.za</a></li>
                <li>Pay prescribed fee (if applicable) - R50 request fee + R1.10 per A4 page</li>
                <li>Receive records within 30 days (Section 25)</li>
              </ol>
            </div>

            <p className="text-gray-700 mt-4">
              <strong>Full PAIA Manual:</strong> Available at <a href="https://schoolos.co.za/paia-manual" className="text-primary-600 hover:underline">https://schoolos.co.za/paia-manual</a>
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention Periods</h2>
            
            <p className="text-gray-700 mb-4">
              We retain personal information only as long as necessary for the purposes collected or as required by law:
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Retention Period</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Payment Records</td>
                    <td className="border border-gray-300 px-4 py-2">7 years</td>
                    <td className="border border-gray-300 px-4 py-2">SARS (Tax Administration Act)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Audit Logs</td>
                    <td className="border border-gray-300 px-4 py-2">7 years</td>
                    <td className="border border-gray-300 px-4 py-2">Financial records retention</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Student Records</td>
                    <td className="border border-gray-300 px-4 py-2">Until graduation + 5 years</td>
                    <td className="border border-gray-300 px-4 py-2">Educational records law</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Staff Records</td>
                    <td className="border border-gray-300 px-4 py-2">Employment + 3 years</td>
                    <td className="border border-gray-300 px-4 py-2">Labour Relations Act</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Bank Statements</td>
                    <td className="border border-gray-300 px-4 py-2">90 days after processing</td>
                    <td className="border border-gray-300 px-4 py-2">Business practice (auto-deleted)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Session Logs</td>
                    <td className="border border-gray-300 px-4 py-2">90 days</td>
                    <td className="border border-gray-300 px-4 py-2">Security monitoring</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Marketing Consent</td>
                    <td className="border border-gray-300 px-4 py-2">Until opt-out</td>
                    <td className="border border-gray-300 px-4 py-2">Consent-based processing</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Inactive Accounts</td>
                    <td className="border border-gray-300 px-4 py-2">2 years of inactivity</td>
                    <td className="border border-gray-300 px-4 py-2">POPIA minimization principle</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Data Sharing & Third Parties</h2>
            
            <p className="text-gray-700 mb-4">
              We do <strong>not sell</strong> your personal information. We only share data with trusted third-party processors necessary to provide our services:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <h3 className="font-semibold text-gray-900">Paystack (Payment Processor)</h3>
                <p className="text-gray-700 text-sm">Purpose: Process subscription payments</p>
                <p className="text-gray-700 text-sm">Data Shared: School name, email, billing amount, payment method</p>
                <p className="text-gray-700 text-sm">Location: Nigeria (PCI-DSS Level 1 certified)</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <h3 className="font-semibold text-gray-900">Render.com (Hosting Provider)</h3>
                <p className="text-gray-700 text-sm">Purpose: Host backend servers and APIs</p>
                <p className="text-gray-700 text-sm">Data Shared: All application data (encrypted)</p>
                <p className="text-gray-700 text-sm">Location: USA (ISO 27001, SOC 2 Type II)</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <h3 className="font-semibold text-gray-900">Neon.tech (Database Provider)</h3>
                <p className="text-gray-700 text-sm">Purpose: PostgreSQL database hosting</p>
                <p className="text-gray-700 text-sm">Data Shared: All structured data (encrypted at rest)</p>
                <p className="text-gray-700 text-sm">Location: AWS Cape Town, South Africa</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <h3 className="font-semibold text-gray-900">Cloudflare (CDN & Storage)</h3>
                <p className="text-gray-700 text-sm">Purpose: File storage, DDoS protection, CDN</p>
                <p className="text-gray-700 text-sm">Data Shared: Files, images, documents (encrypted)</p>
                <p className="text-gray-700 text-sm">Location: Global network (GDPR compliant)</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">11.1 No Sharing Without Consent</h3>
            <p className="text-gray-700">
              We will <strong>never</strong> share your data with third parties for their marketing purposes without your explicit consent. We will notify you if we add new data processors.
            </p>
          </section>

          {/* Children's Data */}
          <section className="mb-12 bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Children's Personal Information (POPIA Section 35)</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> SchoolOS processes personal information of children (students under 18). We comply with Section 35 of POPIA:
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>✅ <strong>Parental Consent:</strong> Schools must obtain consent from parents/guardians before registering students</li>
              <li>✅ <strong>Minimum Data Collection:</strong> We collect only information necessary for school administration</li>
              <li>✅ <strong>No Direct Marketing to Children:</strong> We never send marketing to students</li>
              <li>✅ <strong>Enhanced Security:</strong> Extra safeguards protect children's data (encryption, access controls)</li>
              <li>✅ <strong>No Third-Party Sharing:</strong> Student data never shared outside school administrators</li>
              <li>✅ <strong>Parent Access Rights:</strong> Parents can request, correct, or delete their child's data</li>
            </ul>

            <p className="text-gray-700 mt-4">
              <strong>School Responsibility:</strong> Schools using SchoolOS are data controllers for student information and must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>Obtain written consent from parents/guardians</li>
              <li>Inform parents about data processing practices</li>
              <li>Provide parents with access to student records</li>
              <li>Ensure data accuracy and update records regularly</li>
            </ul>
          </section>

          {/* Security Breach Notification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Data Breach Notification (POPIA Section 22)</h2>
            
            <p className="text-gray-700 mb-4">
              In the unlikely event of a data breach that poses a risk to your rights and freedoms, we will:
            </p>

            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Notify the Information Regulator <strong>within 72 hours</strong></li>
              <li>Notify affected schools and users <strong>without undue delay</strong></li>
              <li>Provide details of the breach (what data, how many users, potential impact)</li>
              <li>Describe measures taken to mitigate harm</li>
              <li>Offer remedial actions (password resets, credit monitoring if applicable)</li>
            </ol>

            <p className="text-gray-700 mt-4">
              <strong>Breach Response Plan:</strong> We maintain an incident response plan with designated roles, communication templates, and forensic procedures.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to This Privacy Policy</h2>
            
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When we make material changes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We will update the "Last Updated" date at the top</li>
              <li>We will notify you via email (for significant changes)</li>
              <li>We will display a prominent notice on the platform</li>
              <li>You will have 30 days to review and accept changes</li>
            </ul>

            <p className="text-gray-700 mt-4">
              <strong>Your continued use of SchoolOS after changes constitutes acceptance of the updated policy.</strong>
            </p>
          </section>

          {/* Contact & Complaints */}
          <section className="mb-12 bg-primary-50 p-6 rounded-lg border border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us & Complaints</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">SchoolOS Information Officer</h3>
            <div className="bg-white p-4 rounded border border-primary-300 mb-4">
              <p className="text-gray-700">Email: <a href="mailto:privacy@schoolos.co.za" className="text-primary-600 hover:underline font-semibold">privacy@schoolos.co.za</a></p>
              <p className="text-gray-700">PAIA Requests: <a href="mailto:paia@schoolos.co.za" className="text-primary-600 hover:underline font-semibold">paia@schoolos.co.za</a></p>
              <p className="text-gray-700">Phone: [Your Phone Number]</p>
              <p className="text-gray-700">Address: [Your Physical Address], South Africa</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Information Regulator of South Africa</h3>
            <div className="bg-white p-4 rounded border border-primary-300">
              <p className="text-gray-700">If you are not satisfied with our response to your complaint, you may lodge a complaint with:</p>
              <p className="text-gray-700 mt-2">Email: <a href="mailto:inforeg@justice.gov.za" className="text-primary-600 hover:underline">inforeg@justice.gov.za</a></p>
              <p className="text-gray-700">Phone: 010 023 5200</p>
              <p className="text-gray-700">Website: <a href="https://www.justice.gov.za/inforeg/" className="text-primary-600 hover:underline" target="_blank" rel="noopener">www.justice.gov.za/inforeg/</a></p>
              <p className="text-gray-700">Address: JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="mb-12 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Acceptance of This Policy</h2>
            <p className="text-gray-700">
              By using SchoolOS, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree, please discontinue use of the platform immediately.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>&copy; 2026 SchoolOS (Pty) Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-primary-600">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-600">Terms of Service</Link>
              <Link to="/paia-manual" className="hover:text-primary-600">PAIA Manual</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
