import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

interface StudentPaymentInfo {
  id: number
  student_id: string
  first_name?: string
  last_name?: string
  student_name?: string
  grade: string
  total_fees: string
  amount_paid: string
  balance_due: string
  payment_status: string
  total_paid?: string
}

interface PaymentSummary {
  total_students_paid?: number
  total_amount_collected?: string
}

interface PaymentHistoryResponse extends PaymentSummary {
  payments: StudentPaymentInfo[]
}

export default function MonthlyPaymentReport() {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [activeTab, setActiveTab] = useState<'paid' | 'unpaid'>('unpaid')

  // Fetch unpaid students (defaulters)
  const { data: defaulters, isLoading: loadingDefaulters } = useQuery<StudentPaymentInfo[]>({
    queryKey: ['payment-defaulters', selectedMonth, selectedYear],
    queryFn: async () => {
      const response = await api.get(`/students/payment_defaulters/?month=${selectedMonth}&year=${selectedYear}`)
      return response.data.defaulters || []
    }
  })

  // Fetch paid students (payment history)
  const { data: paymentHistory, isLoading: loadingHistory } = useQuery<PaymentHistoryResponse>({
    queryKey: ['payment-history', selectedMonth, selectedYear],
    queryFn: async () => {
      const response = await api.get(`/students/payment_history/?month=${selectedMonth}&year=${selectedYear}`)
      return response.data
    }
  })

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  // Only show years from 2 years ago to current year (no future years)
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i)

  // Filter months based on selected year (if current year, only show past/current months)
  const availableMonths = selectedYear === currentYear 
    ? months.filter(m => m.value <= currentMonth)
    : months

  const isLoading = loadingDefaulters || loadingHistory
  const paidStudents = paymentHistory?.payments || []
  const unpaidStudents = defaulters || []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monthly Payment Report</h1>
        <p className="mt-2 text-gray-600">
          View which students have paid or haven't paid for a specific month
        </p>
      </div>

      {/* Month and Year Selectors */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = Number(e.target.value)
                setSelectedMonth(newMonth)
              }}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {availableMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = Number(e.target.value)
                setSelectedYear(newYear)
                // If switching to current year and selected month is in the future, reset to current month
                if (newYear === currentYear && selectedMonth > currentMonth) {
                  setSelectedMonth(currentMonth)
                }
              }}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : paidStudents.length + unpaidStudents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Students Paid</p>
              <p className="text-2xl font-bold text-green-700">
                {isLoading ? '...' : paidStudents.length}
              </p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
          {paymentHistory?.total_amount_collected && (
            <p className="mt-2 text-sm text-green-600">
              Total: R{parseFloat(paymentHistory.total_amount_collected).toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Students Unpaid</p>
              <p className="text-2xl font-bold text-red-700">
                {isLoading ? '...' : unpaidStudents.length}
              </p>
            </div>
            <XCircleIcon className="h-10 w-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'unpaid'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Unpaid Students ({unpaidStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'paid'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Paid Students ({paidStudents.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner size="md" message="Loading payment data..." />
          ) : (
            <>
              {activeTab === 'unpaid' && (
                <div>
                  {unpaidStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">All students have paid!</p>
                      <p className="text-gray-500">No outstanding payments for this month.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Fees
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount Paid
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Balance Due
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {unpaidStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.first_name} {student.last_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.grade || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                R{parseFloat(student.total_fees).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                R{parseFloat(student.amount_paid).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                R{parseFloat(student.balance_due).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'paid' && (
                <div>
                  {paidStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <XCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No payments yet</p>
                      <p className="text-gray-500">No students have paid for this month.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Grade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Paid
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paidStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.student_name || `${student.first_name} ${student.last_name}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.grade || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                R{parseFloat(student.total_paid || '0').toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  {student.payment_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
