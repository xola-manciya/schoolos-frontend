import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Payment, Student } from '../types'
import toast from 'react-hot-toast'
import { ExportButton } from '../components/ExportButton'

type MonthlyPayment = {
  month: string
  year: number
  paid: boolean
  amount?: number
  payment_date?: string
}

export default function Payments() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await api.get('/payments/')
      return response.data.results || response.data
    },
  })

  const { data: students } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.get('/students/')
      return response.data.results || response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_type', file.name.endsWith('.pdf') ? 'PDF' : 'CSV')
      
      const uploadResponse = await api.post('/payments/statements/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      // Process the statement
      await api.post(`/payments/statements/${uploadResponse.data.id}/process/`)
    },
    onSuccess: () => {
      toast.success('Bank statement processed successfully!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setSelectedFile(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to process statement')
    },
  })

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }

  // Generate monthly payment status for a student
  const getMonthlyPayments = (studentId: number): MonthlyPayment[] => {
    const currentYear = new Date().getFullYear()
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const studentPayments = payments?.filter(p => p.student === studentId && p.status === 'VERIFIED') || []
    
    return months.map((month, index) => {
      const monthPayment = studentPayments.find(p => {
        const paymentDate = new Date(p.payment_date)
        return paymentDate.getMonth() === index && paymentDate.getFullYear() === currentYear
      })

      return {
        month,
        year: currentYear,
        paid: !!monthPayment,
        amount: monthPayment?.amount,
        payment_date: monthPayment?.payment_date
      }
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Payments</h1>
        <ExportButton 
          data={payments || []} 
          filename="payments" 
        />
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">Upload Bank Statement</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="file"
            accept=".csv,.xlsx,.pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
          >
            {uploadMutation.isPending ? 'Processing...' : 'Upload & Process'}
          </button>
        </div>
      </div>

      {/* Monthly Payment Tracking */}
      {selectedStudent ? (
        <div className="mb-6 rounded-lg bg-white p-4 shadow sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold sm:text-lg">
              Monthly Payment Status - {students?.find(s => s.id === selectedStudent)?.full_name}
            </h2>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to All Payments
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {getMonthlyPayments(selectedStudent).map((monthData) => (
              <div
                key={monthData.month}
                className={`rounded-lg border-2 p-2 text-center sm:p-3 ${
                  monthData.paid
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-xs font-medium text-gray-900 sm:text-sm">{monthData.month.slice(0, 3)}</div>
                {monthData.paid ? (
                  <div className="mt-1">
                    <div className="text-xs font-semibold text-green-700">✓ Paid</div>
                    <div className="hidden text-xs text-green-600 sm:block">R{monthData.amount?.toLocaleString()}</div>
                    <div className="hidden text-xs text-gray-500 lg:block">
                      {monthData.payment_date && new Date(monthData.payment_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-xs font-semibold text-red-600">Unpaid</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Student Payment Summary */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow sm:p-6">
            <h2 className="mb-4 text-base font-semibold sm:text-lg">Student Payment Summary</h2>
            
            {students && students.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="block space-y-4 lg:hidden">
                  {students.map((student) => {
                    const monthlyStatus = getMonthlyPayments(student.id)
                    const monthsPaid = monthlyStatus.filter(m => m.paid).length

                    return (
                      <div key={student.id} className="rounded-lg border bg-white p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name}</p>
                            <p className="text-sm text-gray-500">{student.student_id}</p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              monthsPaid >= 12
                                ? 'bg-green-100 text-green-800'
                                : monthsPaid >= 6
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {monthsPaid}/12
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Fees:</span>
                            <span className="text-gray-900">R {student.total_fees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Paid:</span>
                            <span className="text-gray-900">R {student.amount_paid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span className="font-medium text-gray-700">Balance:</span>
                            <span className="font-semibold text-gray-900">R {student.balance_due.toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedStudent(student.id)}
                          className="mt-3 w-full rounded-lg bg-primary-50 py-2 text-sm text-primary-600 hover:bg-primary-100"
                        >
                          View Monthly Details
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden overflow-hidden rounded-lg border lg:block">
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Student
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Total Fees
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Paid
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Balance
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Months Paid
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {students.map((student) => {
                    const monthlyStatus = getMonthlyPayments(student.id)
                    const monthsPaid = monthlyStatus.filter(m => m.paid).length

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {student.full_name}
                          <div className="text-xs text-gray-500">{student.student_id}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          R {student.total_fees.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          R {student.amount_paid.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          R {student.balance_due.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              monthsPaid >= 12
                                ? 'bg-green-100 text-green-800'
                                : monthsPaid >= 6
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {monthsPaid}/12 months
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <button
                            onClick={() => setSelectedStudent(student.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
                <p className="mt-1 text-sm text-gray-500">Add students first to see payment summaries.</p>
              </div>
            )}
          </div>

          {/* Recent Payments Table */}
          <div className="rounded-lg bg-white p-4 shadow sm:p-6">
            <h2 className="mb-4 text-base font-semibold sm:text-lg">Recent Payments</h2>
            
            {payments && payments.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="block space-y-4 lg:hidden">
              {payments.slice(0, 20).map((payment) => (
                <div key={payment.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{payment.student_name || 'Unassigned'}</p>
                      <p className="text-sm text-gray-500">{payment.payment_date}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        payment.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-semibold text-gray-900">R {payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="text-gray-900">{payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Match:</span>
                      <span className="text-gray-900">{payment.match_type} ({payment.match_confidence}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-lg border lg:block">
              <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Match Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.slice(0, 20).map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {payment.payment_date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {payment.student_name || 'Unassigned'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        R {payment.amount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {payment.payment_method}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {payment.match_type} ({payment.match_confidence}%)
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            payment.status === 'VERIFIED'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments</h3>
                            <p className="mt-1 text-sm text-gray-500">Upload a bank statement to process payments.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            }
