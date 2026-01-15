import { Link } from 'react-router-dom'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function EmailSent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Didn't receive the email?</strong>
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 transition-colors"
            >
              Go to Login
            </Link>
            <Link
              to="/"
              className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-gray-500">
            Need help? Contact <a href="mailto:support@schoolos.co.za" className="text-primary-600 hover:text-primary-700">support@schoolos.co.za</a>
          </p>
        </div>
      </div>
    </div>
  )
}
