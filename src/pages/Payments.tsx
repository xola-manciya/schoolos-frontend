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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<{ month: string; year: number } | null>(null)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)
  const [showBreakdownSidebar, setShowBreakdownSidebar] = useState(false)
  const [breakdownStudentId, setBreakdownStudentId] = useState<number | null>(null)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState<{ id: number; name: string } | null>(null)
  const queryClient = useQueryClient()

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await api.get('/payments/list/')
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

  const { data: school } = useQuery({
    queryKey: ['school'],
    queryFn: async () => {
      const response = await api.get('/general/schools/me/')
      return response.data
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
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to process statement')
    },
  })

  const markPaymentMutation = useMutation({
    mutationFn: async ({ studentId, amount, month, year }: { studentId: number; amount: number; month: string; year: number }) => {
      // Create payment date for the specific month (use 15th of the month)
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month)
      const paymentDate = new Date(year, monthIndex, 15)
      
      await api.post('/payments/list/', {
        student: studentId,
        amount: amount,
        payment_method: 'MANUAL',
        payment_date: paymentDate.toISOString().split('T')[0],
        status: 'VERIFIED',
        reference_number: `MANUAL-${Date.now()}`,
        match_type: 'MANUAL',
        match_confidence: 100,
        payment_month: monthIndex + 1,
        payment_year: year,
      })
    },
    onSuccess: () => {
      toast.success('Payment recorded successfully!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowPaymentModal(false)
      setSelectedMonth(null)
      setEditingStudentId(null)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to record payment')
      console.error('Payment error:', err)
    },
  })

  const unmarkPaymentMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      await api.delete(`/payments/list/${paymentId}/`)
    },
    onSuccess: () => {
      toast.success('Payment removed successfully!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to remove payment')
      console.error('Delete payment error:', err)
    },
  })

  const deleteStudentPaymentsMutation = useMutation({
    mutationFn: async (studentId: number) => {
      const studentPayments = payments?.filter(p => p.student === studentId && p.status === 'VERIFIED') || []
      await Promise.all(studentPayments.map(p => api.delete(`/payments/list/${p.id}/`)))
    },
    onSuccess: () => {
      toast.success('All student payments deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to delete payments')
      console.error('Delete all payments error:', err)
    },
  })

  const handleTogglePayment = (studentId: number, monthData: MonthlyPayment) => {
    if (editingStudentId !== studentId) {
      toast.error('Click edit to modify payments')
      return
    }

    if (monthData.paid) {
      // Find the payment for this month and delete it
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthData.month)
      
      // First try to find by payment_month/payment_year
      let payment = payments?.find(p => 
        p.student === studentId && 
        p.status === 'VERIFIED' &&
        p.payment_month === (monthIndex + 1) &&
        p.payment_year === monthData.year
      )
      
      // Fallback: find by payment_date if payment_month is not set
      if (!payment) {
        payment = payments?.find(p => 
          p.student === studentId && 
          p.status === 'VERIFIED' &&
          new Date(p.payment_date).getMonth() === monthIndex &&
          new Date(p.payment_date).getFullYear() === monthData.year
        )
      }
      
      if (payment) {
        unmarkPaymentMutation.mutate(payment.id)
      }
    } else {
      setSelectedStudent(studentId)
      setSelectedMonth({ month: monthData.month, year: monthData.year })
      setShowPaymentModal(true)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }

  // Generate monthly payment status for a student
  const getMonthlyPayments = (studentId: number): MonthlyPayment[] => {
    const currentYear = new Date().getFullYear()
    const allMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    // Get payment configuration from school (default to 12 months starting from January)
    const paymentMonthsCount = school?.payment_months_per_year || 12
    const startMonth = (school?.payment_start_month || 1) - 1 // Convert to 0-indexed

    // Generate the payment months based on school configuration
    const paymentMonths = []
    for (let i = 0; i < paymentMonthsCount; i++) {
      const monthIndex = (startMonth + i) % 12
      paymentMonths.push(allMonths[monthIndex])
    }

    const studentPayments = payments?.filter(p => p.student === studentId && p.status === 'VERIFIED') || []
    
    return paymentMonths.map((month) => {
      const monthIndex = allMonths.indexOf(month)
      
      // First try to match by payment_month/payment_year fields (preferred)
      let monthPayment = studentPayments.find(p => 
        p.payment_month === (monthIndex + 1) && 
        p.payment_year === currentYear
      )
      
      // Fallback: match by payment_date if payment_month is not set
      if (!monthPayment) {
        monthPayment = studentPayments.find(p => {
          const paymentDate = new Date(p.payment_date)
          return paymentDate.getMonth() === monthIndex && paymentDate.getFullYear() === currentYear
        })
      }

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
        <ExportButton endpoint="/payments/list/export/" />
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

      {/* Student Payment Tracking */}
      <>
          {/* Student Payment Summary */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow sm:p-6">
            <h2 className="mb-4 text-base font-semibold sm:text-lg">Student Payment Tracking</h2>
            
            {students && students.length > 0 ? (
              <>
                {/* Mobile View - Show compact month checkboxes */}
                <div className="block space-y-4 lg:hidden">
                  {students.map((student) => {
                    const monthlyPayments = getMonthlyPayments(student.id)
                    const monthsPaid = monthlyPayments.filter(m => m.paid).length
                    const totalMonths = school?.payment_months_per_year || 12
                    const isEditing = editingStudentId === student.id

                    return (
                      <div key={student.id} className="rounded-lg border bg-white p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name}</p>
                            <p className="text-sm text-gray-500">{student.student_id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                monthsPaid >= totalMonths
                                  ? 'bg-green-100 text-green-800'
                                  : monthsPaid >= totalMonths / 2
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {monthsPaid}/{totalMonths}
                            </span>
                            <button
                              onClick={() => {
                                setBreakdownStudentId(student.id)
                                setShowBreakdownSidebar(true)
                              }}
                              className="text-purple-600 hover:text-purple-800"
                              title="View payment breakdown"
                            >
                              📊
                            </button>
                            <button
                              onClick={() => setEditingStudentId(isEditing ? null : student.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title={isEditing ? 'Done editing' : 'Edit payments'}
                            >
                              {isEditing ? '✓' : '✏️'}
                            </button>
                            <button
                              onClick={() => {
                                setDeleteAllConfirm({ id: student.id, name: student.student_id })
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Delete all payments"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {monthlyPayments.map((monthData) => (
                            <button
                              key={monthData.month}
                              onClick={() => handleTogglePayment(student.id, monthData)}
                              disabled={!isEditing || unmarkPaymentMutation.isPending}
                              className={`rounded-lg border-2 p-2 text-center transition-all ${
                                monthData.paid
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-300 bg-white'
                              } ${isEditing ? 'hover:bg-blue-50 hover:border-blue-500 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                            >
                              <div className="text-xs font-medium">{monthData.month.slice(0, 3)}</div>
                              {monthData.paid && (
                                <div className="mt-1 text-green-600">✓</div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Desktop Table View - Month columns with checkboxes */}
                <div className="hidden overflow-hidden rounded-lg border lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Student
                          </th>
                          {(() => {
                            const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            const paymentMonthsCount = school?.payment_months_per_year || 12
                            const startMonth = (school?.payment_start_month || 1) - 1
                            const paymentMonths = []
                            for (let i = 0; i < paymentMonthsCount; i++) {
                              const monthIndex = (startMonth + i) % 12
                              paymentMonths.push(allMonths[monthIndex])
                            }
                            return paymentMonths.map((month) => (
                              <th key={month} scope="col" className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                {month.slice(0, 3)}
                              </th>
                            ))
                          })()}
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {students.map((student) => {
                          const monthlyPayments = getMonthlyPayments(student.id)
                          const isEditing = editingStudentId === student.id
                          
                          return (
                            <tr key={student.id} className={`hover:bg-gray-50 ${isEditing ? 'bg-blue-50' : ''}`}>
                              <td className="sticky left-0 z-10 bg-white whitespace-nowrap px-4 py-3 text-sm text-gray-900 group-hover:bg-gray-50">
                                <div className="font-medium">{student.full_name}</div>
                                <div className="text-xs text-gray-500">{student.student_id}</div>
                              </td>
                              {monthlyPayments.map((monthData) => (
                                <td key={monthData.month} className="px-3 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={monthData.paid}
                                    disabled={!isEditing || unmarkPaymentMutation.isPending}
                                    onChange={() => handleTogglePayment(student.id, monthData)}
                                    className={`h-5 w-5 rounded border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed ${
                                      monthData.paid 
                                        ? 'text-blue-600 disabled:opacity-100' 
                                        : 'text-blue-600 disabled:opacity-50'
                                    }`}
                                  />
                                </td>
                              ))}
                              <td className="whitespace-nowrap px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => {
                                      setBreakdownStudentId(student.id)
                                      setShowBreakdownSidebar(true)
                                    }}
                                    className="text-purple-600 hover:text-purple-800 text-lg"
                                    title="View payment breakdown"
                                  >
                                    📊
                                  </button>
                                  <button
                                    onClick={() => setEditingStudentId(isEditing ? null : student.id)}
                                    className="text-blue-600 hover:text-blue-800 text-lg"
                                    title={isEditing ? 'Done editing' : 'Edit payments'}
                                  >
                                    {isEditing ? '✓' : '✏️'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteAllConfirm({ id: student.id, name: student.full_name })
                                    }}
                                    disabled={deleteStudentPaymentsMutation.isPending}
                                    className="text-red-600 hover:text-red-800 text-lg disabled:opacity-50"
                                    title="Delete all payments"
                                  >
                                    🗑️
                                  </button>
                                </div>
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
            
            {payments && payments.filter(p => p.student).length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="block space-y-4 lg:hidden">
              {payments.filter(p => p.student).slice(0, 20).map((payment) => (
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
                    {payment.bank_statement_file && (
                      <div className="flex justify-between pt-2">
                        <a
                          href={payment.bank_statement_file}
                          download={payment.bank_statement_filename}
                          className="text-primary-600 hover:text-primary-800 text-xs font-medium"
                        >
                          📄 Download Statement
                        </a>
                      </div>
                    )}
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      File
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.filter(p => p.student).slice(0, 20).map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {payment.payment_date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {payment.student_name}
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {payment.bank_statement_file ? (
                          <a
                            href={payment.bank_statement_file}
                            download={payment.bank_statement_filename}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No student payments</h3>
                <p className="mt-1 text-sm text-gray-500">Upload a bank statement to process payments. Only payments assigned to students will be shown.</p>
              </div>
            )}
          </div>
        </>

      {/* Mark Payment Modal */}
      {showPaymentModal && selectedStudent && selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Mark Payment</h2>
            
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Student</p>
              <p className="text-lg font-semibold text-gray-900">
                {students?.find(s => s.id === selectedStudent)?.full_name}
              </p>
              <p className="mt-2 text-sm text-gray-600">Month</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedMonth.month} {selectedMonth.year}
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const amount = parseFloat(formData.get('amount') as string)
              const student = students?.find(s => s.id === selectedStudent)
              if (amount > 0 && student) {
                markPaymentMutation.mutate({ 
                  studentId: selectedStudent, 
                  amount,
                  month: selectedMonth.month,
                  year: selectedMonth.year
                })
              } else {
                toast.error('Please enter a valid amount')
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (R)
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  defaultValue={(students?.find(s => s.id === selectedStudent)?.total_fees || 0) / (school?.payment_months_per_year || 12)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="Enter amount"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Monthly fee: R{((students?.find(s => s.id === selectedStudent)?.total_fees || 0) / (school?.payment_months_per_year || 12)).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedMonth(null)
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={markPaymentMutation.isPending}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {markPaymentMutation.isPending ? 'Marking...' : 'Mark as Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Breakdown Sidebar */}
      {showBreakdownSidebar && breakdownStudentId && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => {
              setShowBreakdownSidebar(false)
              setBreakdownStudentId(null)
            }}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment Breakdown</h2>
                <button
                  onClick={() => {
                    setShowBreakdownSidebar(false)
                    setBreakdownStudentId(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {(() => {
                const student = students?.find(s => s.id === breakdownStudentId)
                if (!student) return <p>Student not found</p>

                const monthlyPayments = getMonthlyPayments(breakdownStudentId)
                const paidPayments = monthlyPayments.filter(m => m.paid)
                const totalPaid = paidPayments.reduce((sum, m) => sum + (m.amount || 0), 0)

                return (
                  <>
                    {/* Student Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Student</p>
                      <p className="text-lg font-semibold text-gray-900">{student.full_name}</p>
                      <p className="text-sm text-gray-500">{student.student_id}</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Total Fees</p>
                        <p className="text-xl font-bold text-blue-900">R{(student.total_fees || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 mb-1">Total Paid</p>
                        <p className="text-xl font-bold text-green-900">R{totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-600 mb-1">Balance Due</p>
                        <p className="text-xl font-bold text-orange-900">R{(student.balance_due || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 mb-1">Months Paid</p>
                        <p className="text-xl font-bold text-purple-900">{paidPayments.length}/{monthlyPayments.length}</p>
                      </div>
                    </div>

                    {/* Monthly Breakdown */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Breakdown</h3>
                      <div className="space-y-2">
                        {monthlyPayments.map((monthData) => (
                          <div
                            key={monthData.month}
                            className={`p-3 rounded-lg border-2 ${
                              monthData.paid
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-lg ${monthData.paid ? 'text-green-600' : 'text-gray-400'}`}>
                                  {monthData.paid ? '✓' : '○'}
                                </span>
                                <span className={`font-medium ${monthData.paid ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {monthData.month}
                                </span>
                              </div>
                              <div className="text-right">
                                {monthData.paid ? (
                                  <>
                                    <p className="font-semibold text-green-900">
                                      R{(monthData.amount || 0).toLocaleString()}
                                    </p>
                                    {monthData.payment_date && (
                                      <p className="text-xs text-gray-500">
                                        {new Date(monthData.payment_date).toLocaleDateString()}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-400">Not paid</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Payment Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.payment_status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : student.payment_status === 'PARTIAL'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.payment_status}
                        </span>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </>
      )}

      {/* Delete All Payments Confirmation Dialog */}
      {deleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete All Payments</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete all payments for <span className="font-semibold">{deleteAllConfirm.name}</span>? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteAllConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudentPaymentsMutation.mutate(deleteAllConfirm.id)
                  setDeleteAllConfirm(null)
                }}
                disabled={deleteStudentPaymentsMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteStudentPaymentsMutation.isPending ? 'Deleting...' : 'Delete All Payments'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
