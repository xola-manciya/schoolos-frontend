import { useState } from 'react'
import axios from 'axios'

export default function SchoolRegistrationTest() {
  const [formData, setFormData] = useState({
    school_name: 'Test High School',
    email: 'xolamanciya@gmail.com',
    contact_person: 'Test Principal',
    phone: '+27 21 123 4567',
    address: '123 Test Street, Cape Town',
    subscription_tier: 'PROFESSIONAL',
    monthly_fee: 499.00
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('/api/v1/general/register/', formData)
      setResult(response.data)
      
      // Redirect to Paystack if successful
      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            School Registration Test
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Name
              </label>
              <input
                type="text"
                value={formData.school_name}
                onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subscription Tier
              </label>
              <select
                value={formData.subscription_tier}
                onChange={(e) => setFormData({...formData, subscription_tier: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              >
                <option value="STARTER">Starter</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monthly Fee (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_fee}
                onChange={(e) => setFormData({...formData, monthly_fee: parseFloat(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register School & Proceed to Payment'}
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                Registration Successful!
              </h3>
              <dl className="text-sm text-green-700 space-y-1">
                <div>
                  <dt className="inline font-medium">School ID:</dt>
                  <dd className="inline ml-1">{result.school_id}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Reference:</dt>
                  <dd className="inline ml-1">{result.reference}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Trial Days:</dt>
                  <dd className="inline ml-1">{result.trial_days}</dd>
                </div>
              </dl>
              <p className="mt-2 text-sm text-green-600">
                Redirecting to Paystack...
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Test Card Details (Paystack)
          </h3>
          <dl className="text-sm text-blue-700 space-y-1">
            <div>
              <dt className="inline font-medium">Card Number:</dt>
              <dd className="inline ml-1">4084 0840 8408 4081</dd>
            </div>
            <div>
              <dt className="inline font-medium">Expiry:</dt>
              <dd className="inline ml-1">12/30</dd>
            </div>
            <div>
              <dt className="inline font-medium">CVV:</dt>
              <dd className="inline ml-1">408</dd>
            </div>
            <div>
              <dt className="inline font-medium">PIN:</dt>
              <dd className="inline ml-1">0000</dd>
            </div>
            <div>
              <dt className="inline font-medium">OTP:</dt>
              <dd className="inline ml-1">123456</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
