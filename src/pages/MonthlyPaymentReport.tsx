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
  expected_amount?: string
  shortfall?: string
  registration_fee?: string
  registration_fee_paid?: boolean
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
  const [activeTab, setActiveTab] = useState<'paid' | 'unpaid' | 'partial' | 'registration'>('unpaid')
  const [gradeFilter, setGradeFilter] = useState<string>('')

  // Fetch unpaid students (defaulters)
  const { data: defaulters, isLoading: loadingDefaulters } = useQuery<StudentPaymentInfo[]>({
    queryKey: ['payment-defaulters', selectedMonth, selectedYear, gradeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
      })
      if (gradeFilter) {
        params.append('grade', gradeFilter)
      }
      const response = await api.get(`/students/payment_defaulters/?${params.toString()}`)
      return response.data.defaulters || []
    }
  })

  // Fetch paid students (payment history)
  const { data: paymentHistory, isLoading: loadingHistory } = useQuery<PaymentHistoryResponse>({
    queryKey: ['payment-history', selectedMonth, selectedYear, gradeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
      })
      if (gradeFilter) {
        params.append('grade', gradeFilter)
      }
      const response = await api.get(`/students/payment_history/?${params.toString()}`)
      return response.data
    }
  })

  // Fetch students who have paid registration fee
  const { data: registrationFeePaid, isLoading: loadingRegistration } = useQuery<StudentPaymentInfo[]>({
    queryKey: ['registration-fee-paid-v3', gradeFilter],  // v3: Force fresh data
    queryFn: async () => {
      const params = new URLSearchParams()
      if (gradeFilter) {
        params.append('grade', gradeFilter)
      }
      const response = await api.get(`/students/registration_fee_paid/?${params.toString()}`)
      return response.data.students || []
    },
    staleTime: 0,
    gcTime: 0,
  })

  // Fetch students with partial payments
  const { data: partialPayments, isLoading: loadingPartial } = useQuery<StudentPaymentInfo[]>({
    queryKey: ['partial-payments', selectedMonth, selectedYear, gradeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: selectedMonth.toString(),
        year: selectedYear.toString(),
      })
      if (gradeFilter) {
        params.append('grade', gradeFilter)
      }
      const response = await api.get(`/students/partial_payments/?${params.toString()}`)
      return response.data.students || []
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

  const isLoading = loadingDefaulters || loadingHistory || loadingRegistration || loadingPartial
  const paidStudents = paymentHistory?.payments || []
  const unpaidStudents = defaulters || []
  const partialPaymentStudents = partialPayments || []
  const registrationStudents = registrationFeePaid || []

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">All Grades</option>
              <option value="R">Grade R</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Partial Payments</p>
              <p className="text-2xl font-bold text-yellow-700">
                {isLoading ? '...' : partialPaymentStudents.length}
              </p>
            </div>
            <XCircleIcon className="h-10 w-10 text-yellow-500" />
          </div>
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
            <button
              onClick={() => setActiveTab('partial')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'partial'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Partial Payments ({partialPaymentStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'registration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Registration Fees ({registrationStudents.length})
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

              {activeTab === 'partial' && (
                <div>
                  {partialPaymentStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No partial payments</p>
                      <p className="text-gray-500">All students either paid in full or haven't paid at all.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Showing students who made partial payments for this month.
                          These students have paid some amount but not the full expected fee.
                        </p>
                      </div>
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
                                Paid
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expected
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shortfall
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {partialPaymentStudents.map((student: any) => (
                              <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.student_name || `${student.first_name} ${student.last_name}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.grade || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                                  R{parseFloat(student.total_paid || '0').toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  R{parseFloat(student.expected_amount || '0').toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                  R{parseFloat(student.shortfall || '0').toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'registration' && (
                <div>
                  {registrationStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <XCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900">No registration fees set</p>
                      <p className="text-gray-500">No students have registration fees configured.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Showing all students with registration fees. 
                          Expected: <span className="font-semibold">R{registrationStudents.reduce((sum, s) => sum + parseFloat(s.registration_fee || '0'), 0).toLocaleString()}</span>
                          {' | '}
                          Paid: <span className="font-semibold">{registrationStudents.filter(s => s.registration_fee_paid).length} students</span>
                        </p>
                      </div>
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
                                Registration Fee
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {registrationStudents.map((student) => (
                              <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.student_name || `${student.first_name} ${student.last_name}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {student.grade || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                  R{parseFloat(student.registration_fee || '0').toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {student.registration_fee_paid ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircleIcon className="h-4 w-4" />
                                      Paid
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <ExclamationTriangleIcon className="h-4 w-4" />
                                      Unpaid
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
