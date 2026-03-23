import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FileText, Download, Mail, Phone, MapPin, Clock, Shield, Info } from 'lucide-react'

export default function PAIAManual() {
  return (
    <>
      <Helmet>
        <title>PAIA Manual - Promotion of Access to Information Act | SchoolOS</title>
        <meta
          name="description"
          content="SchoolOS PAIA Manual in compliance with the Promotion of Access to Information Act, 2000 (Act No. 2 of 2000). Access to records and information request procedures."
        />
        <meta name="keywords" content="PAIA manual, access to information, PAIA South Africa, information requests, school records access" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  SchoolOS
                </span>
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-primary-100 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  PAIA Manual
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Promotion of Access to Information Act, 2000 (Act No. 2 of 2000)
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="w-4 h-4 mr-2" />
                    PAIA Compliant
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Info className="w-4 h-4 mr-2" />
                    Last Updated: January 19, 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-800 font-medium">
                This manual is prepared in terms of Section 51 of the Promotion of Access to Information Act, 2000 (Act No. 2 of 2000).
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <a
              href="mailto:paia@schoolos.co.za"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Submit PAIA Request</h3>
                  <p className="text-gray-600 text-sm">paia@schoolos.co.za</p>
                </div>
              </div>
            </a>

            <button
              onClick={() => window.print()}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">Download Manual</h3>
                  <p className="text-gray-600 text-sm">Print or save as PDF</p>
                </div>
              </div>
            </button>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1: Introduction */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  SchoolOS (Pty) Ltd is committed to transparency and promoting access to information in accordance with the 
                  <strong> Promotion of Access to Information Act, 2000 (PAIA)</strong>.
                </p>
                <p className="text-gray-700 mb-4">
                  This manual is intended to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Assist requesters in obtaining access to records held by SchoolOS</li>
                  <li>Outline the procedures for making PAIA requests</li>
                  <li>Describe the categories of records maintained by SchoolOS</li>
                  <li>Provide contact details for submitting requests</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Company Details */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Registered Name</h3>
                    <p className="text-gray-700">SchoolOS (Pty) Ltd</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Registration Number</h3>
                    <p className="text-gray-700">2024/123456/07</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Physical Address</h3>
                    <div className="flex items-start space-x-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <p>123 Education Street</p>
                        <p>Johannesburg, Gauteng, 2000</p>
                        <p>South Africa</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Postal Address</h3>
                    <p className="text-gray-700">P.O. Box 12345</p>
                    <p className="text-gray-700">Johannesburg, 2000</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Phone className="w-5 h-5 text-primary-600" />
                        <span>+27 73 643 9458</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-5 h-5 text-primary-600" />
                        <span>info@schoolos.co.za</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: PAIA Officer */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Officer</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Name</h3>
                    <p className="text-gray-700">Chief Information Officer</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:paia@schoolos.co.za" className="text-primary-600 hover:underline font-medium">
                      paia@schoolos.co.za
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telephone</h3>
                    <p className="text-gray-700">+27 736439458</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm pt-2">
                    <Clock className="w-4 h-4" />
                    <span>Business Hours: Monday - Friday, 08:00 - 17:00 (SAST)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Records Categories */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Categories of Records</h2>
              <p className="text-gray-700 mb-6">
                SchoolOS maintains the following categories of records in accordance with applicable legislation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Company Registration Documents',
                  'Financial Records & Accounts',
                  'Tax Records & SARS Compliance',
                  'School Subscription Records',
                  'Payment Processing Records',
                  'Student Information (Limited Access)',
                  'Staff & Employee Records',
                  'IT Systems & Security Logs',
                  'Contracts & Agreements',
                  'Policies & Procedures',
                  'Marketing & Communications',
                  'Legal & Compliance Documents'
                ].map((category, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{category}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Access to certain records may be restricted in terms of PAIA exemptions (Chapters 4 and 5) 
                  to protect personal information, trade secrets, or confidential third-party information.
                </p>
              </div>
            </section>

            {/* Section 5: Request Procedure */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How to Make a PAIA Request</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Complete Form</h3>
                  <p className="text-gray-700 mb-3">
                    Use the prescribed <strong>PAIA Request Form</strong> (Form A or Form C) available from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>South African Human Rights Commission: <a href="https://www.sahrc.org.za" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.sahrc.org.za</a></li>
                    <li>Email us at: <a href="mailto:paia@schoolos.co.za" className="text-primary-600 hover:underline">paia@schoolos.co.za</a> to request the form</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Provide Details</h3>
                  <p className="text-gray-700 mb-2">Your request must include:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Your full name and contact details</li>
                    <li>Identity document or proof of identity</li>
                    <li>Specific description of the record(s) requested</li>
                    <li>Preferred form of access (inspection, copy, etc.)</li>
                    <li>Reason for the request (if personal information of third party)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Submit Request</h3>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2 font-medium">Send your completed form to:</p>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Email:</strong> <a href="mailto:paia@schoolos.co.za" className="text-primary-600 hover:underline">paia@schoolos.co.za</a></p>
                      <p><strong>Postal:</strong> P.O. Box 12345, Johannesburg, 2000</p>
                      <p><strong>Physical:</strong> 123 Education Street, Johannesburg, 2000</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 4: Wait for Response</h3>
                  <div className="flex items-start space-x-3 bg-green-50 rounded-lg p-4">
                    <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700 mb-2">
                        We will respond within <strong>30 days</strong> as required by PAIA Section 25.
                      </p>
                      <p className="text-gray-700 text-sm">
                        You will receive either approval, partial approval, or reasons for refusal. You have the right to 
                        appeal any refusal to the courts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Fees */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prescribed Fees</h2>
              <p className="text-gray-700 mb-4">
                Fees may be charged in accordance with the regulations published under PAIA:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-700">Request Fee (Personal Requests)</span>
                    <span className="font-semibold text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-700">Request Fee (Other Requests)</span>
                    <span className="font-semibold text-gray-900">R50.00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-700">Photocopy (per A4 page)</span>
                    <span className="font-semibold text-gray-900">R1.10</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-700">Printed copy (per A4 page)</span>
                    <span className="font-semibold text-gray-900">R0.75</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-700">Electronic copy (email/disk)</span>
                    <span className="font-semibold text-gray-900">R60.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Search & preparation (per hour)</span>
                    <span className="font-semibold text-gray-900">R30.00</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                * Fees are subject to change in accordance with government regulations.
              </p>
            </section>

            {/* Section 7: Remedies */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Remedies & Appeals</h2>
              <p className="text-gray-700 mb-4">
                If your PAIA request is refused or you are dissatisfied with the response, you have the right to:
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Internal Appeal</h3>
                  <p className="text-gray-700 text-sm">
                    Submit an internal appeal to the Head of SchoolOS within 60 days of the decision.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Court Application</h3>
                  <p className="text-gray-700 text-sm">
                    Apply to the High Court within 180 days for a review of the decision (PAIA Section 82).
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">SAHRC Complaint</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Lodge a complaint with the South African Human Rights Commission:
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Email:</strong> PAIA@sahrc.org.za | <strong>Tel:</strong> 011 877 3600
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Related Legislation */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Related Legislation</h2>
              <p className="text-gray-700 mb-4">
                This PAIA Manual complies with and references the following South African legislation:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Promotion of Access to Information Act, 2000 (Act No. 2 of 2000)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Protection of Personal Information Act, 2013 (Act No. 4 of 2013)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>Companies Act, 2008 (Act No. 71 of 2008)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                  <span>South African Schools Act, 1996 (Act No. 84 of 1996)</span>
                </li>
              </ul>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
              <p className="mb-6 text-primary-100">
                Our Information Officer is available to assist with PAIA requests and queries.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="mailto:paia@schoolos.co.za"
                  className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-primary-100">paia@schoolos.co.za</p>
                  </div>
                </a>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                  <Phone className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-primary-100">+27 736439458</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <Link to="/privacy-policy" className="hover:text-primary-600">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-600">Terms & Conditions</Link>
              <Link to="/" className="hover:text-primary-600">Home</Link>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              © 2026 SchoolOS (Pty) Ltd. All rights reserved. | PAIA Compliant
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
