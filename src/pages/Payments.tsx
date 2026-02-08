import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Payment, Student } from '../types'
import toast from 'react-hot-toast'
import { sanitizeNumber } from '../lib/sanitize'
import { ExportButton } from '../components/ExportButton'
import LoadingSpinner from '../components/LoadingSpinner'
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'

type MonthlyPayment = {
  month: string
  year: number
  paid: boolean
  amount?: number
  payment_date?: string
}

type PaginatedStudentsResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Student[]
}

type BankStatement = {
  id: number
  file_url: string
  filename: string
  file_type: string
  upload_date: string
  status: 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED'
  uploaded_by_name: string
}

type UnmatchedTransaction = {
  date: string
  amount: number
  description: string
  reference: string
}

export default function Payments() {
  const { user } = useAuthStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<{ month: string; year: number } | null>(null)
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null)
  const [showBreakdownSidebar, setShowBreakdownSidebar] = useState(false)
  const [breakdownStudentId, setBreakdownStudentId] = useState<number | null>(null)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState<{ id: number; name: string } | null>(null)
  const [reprocessConfirm, setReprocessConfirm] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString())
  const [gradeFilter, setGradeFilter] = useState<string>('')
  const [unmatchedTransactions, setUnmatchedTransactions] = useState<UnmatchedTransaction[]>([])
  const [showUnmatchedBanner, setShowUnmatchedBanner] = useState(false)
  const queryClient = useQueryClient()

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await api.get('/payments/list/')
      return response.data.results || response.data
    },
  })

  const { data: studentsData } = useQuery<PaginatedStudentsResponse>({
    queryKey: ['students', currentPage, pageSize, yearFilter, gradeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
      })
      if (yearFilter) {
        params.append('year', yearFilter)
      }
      if (gradeFilter) {
        params.append('grade', gradeFilter)
      }
      const response = await api.get(`/students/?${params.toString()}`)
      return response.data
    },
  })

  const students = studentsData?.results || []
  const totalPages = studentsData ? Math.ceil(studentsData.count / pageSize) : 1

  const { data: school } = useQuery({
    queryKey: ['school'],
    queryFn: async () => {
      const response = await api.get('/general/schools/me/')
      return response.data
    },
  })

  const { data: bankStatements } = useQuery<BankStatement[]>({
    queryKey: ['bank-statements'],
    queryFn: async () => {
      const response = await api.get('/payments/statements/')
      return response.data.results || response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      // Detect file type from extension
      const fileName = file.name.toLowerCase()
      let fileType = 'CSV' // default
      if (fileName.endsWith('.pdf')) {
        fileType = 'PDF'
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        fileType = 'EXCEL'
      }
      formData.append('file_type', fileType)
      
      const uploadResponse = await api.post('/payments/statements/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      // Process the statement and return the result
      const processResponse = await api.post(`/payments/statements/${uploadResponse.data.id}/process/`)
      return processResponse.data
    },
    onSuccess: (data) => {
      toast.success(`Bank statement processed! Matched: ${data.matched}, Unmatched: ${data.unmatched}`)
      
      // Store unmatched transactions if any
      if (data.unmatched_transactions && data.unmatched_transactions.length > 0) {
        setUnmatchedTransactions(data.unmatched_transactions)
        setShowUnmatchedBanner(true)
      } else {
        setUnmatchedTransactions([])
        setShowUnmatchedBanner(false)
      }
      
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] })
      setSelectedFile(null)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to process statement')
    },
  })

  const reprocessMutation = useMutation({
    mutationFn: async (statementId: number) => {
      const response = await api.post(`/payments/statements/${statementId}/reprocess/`)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(`Bank statement reprocessed! Matched: ${data.matched}, Unmatched: ${data.unmatched}`)
      
      // Store unmatched transactions if any
      if (data.unmatched_transactions && data.unmatched_transactions.length > 0) {
        setUnmatchedTransactions(data.unmatched_transactions)
        setShowUnmatchedBanner(true)
      } else {
        setUnmatchedTransactions([])
        setShowUnmatchedBanner(false)
      }
      
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to reprocess statement')
    },
  })

  const fixStuckStatementsMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/payments/statements/fix_stuck_statements/')
      return response.data
    },
    onSuccess: (data) => {
      if (data.count > 0) {
        toast.success(`Fixed ${data.count} stuck statement${data.count > 1 ? 's' : ''}!`)
      } else {
        toast.success('No stuck statements found - all clear!')
      }
      queryClient.invalidateQueries({ queryKey: ['bank-statements'] })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to fix stuck statements')
    },
  })

  const markPaymentMutation = useMutation({
    mutationFn: async ({ studentId, amount, month, year }: { studentId: number; amount: number; month: string; year: number }) => {
      // Create payment date for the specific month (use 15th of the month)
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month)
      const paymentDate = new Date(year, monthIndex, 15)
      
      // Sanitize numeric inputs before sending to backend
      await api.post('/payments/list/', {
        student: sanitizeNumber(studentId),
        amount: sanitizeNumber(amount),
        payment_method: 'MANUAL',
        payment_date: paymentDate.toISOString().split('T')[0],
        status: 'VERIFIED',
        reference_number: `MANUAL-${Date.now()}`,
        match_type: 'MANUAL',
        match_confidence: 100,
        payment_month: monthIndex + 1,
        payment_year: sanitizeNumber(year),
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
      const response = await api.delete(`/payments/list/${paymentId}/`)
      return response
    },
    onSuccess: () => {
      toast.success('Payment removed successfully!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['payment-defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['payment-history'] })
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
      queryClient.invalidateQueries({ queryKey: ['payment-defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['payment-history'] })
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
      } else {
        toast.error('Payment record not found for this month')
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
    return <LoadingSpinner message="Loading payments..." />
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

      {/* Unmatched Transactions Banner */}
      {showUnmatchedBanner && unmatchedTransactions.length > 0 && (
        <div className="mb-6 rounded-lg border-2 border-orange-200 bg-orange-50 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-orange-900 sm:text-lg">
                Manual Review Required
              </h2>
              <p className="mt-1 text-sm text-orange-700">
                {unmatchedTransactions.length} transaction{unmatchedTransactions.length > 1 ? 's' : ''} could not be automatically matched to students.
                Please review and assign manually.
              </p>
            </div>
            <button
              onClick={() => setShowUnmatchedBanner(false)}
              className="text-orange-500 hover:text-orange-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-200">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-orange-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-orange-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-orange-900">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-orange-900">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-200 bg-white">
                {unmatchedTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-orange-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      R{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {transaction.reference || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-md bg-orange-100 p-3">
            <p className="text-xs text-orange-800">
              <strong>Tip:</strong> To improve matching, ask parents to include the student's ID number or full name in payment references.
            </p>
          </div>
        </div>
      )}

      {/* Student Payment Tracking */}
      <>
          {/* Student Payment Summary */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow sm:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold sm:text-lg">Student Payment Tracking</h2>
              <div className="flex items-center gap-2">
                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    setGradeFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
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
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                >
                  <option value="">All Years</option>
                  {(() => {
                    const currentYear = new Date().getFullYear()
                    const schoolCreatedYear = user?.school?.created_at 
                      ? new Date(user.school.created_at).getFullYear()
                      : currentYear
                    const years = []
                    for (let year = currentYear; year >= schoolCreatedYear; year--) {
                      years.push(year)
                    }
                    return years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))
                  })()}
                </select>
              </div>
            </div>
            
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
                <div className="hidden lg:block">
                  <div className="overflow-hidden rounded-lg border">
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
                {/* Pagination Controls */}
                {studentsData && studentsData.count > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * pageSize, studentsData.count)}
                          </span>{' '}
                          of <span className="font-medium">{studentsData.count}</span> students
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value))
                            setCurrentPage(1)
                          }}
                          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        >
                          <option value={10}>10 per page</option>
                          <option value={20}>20 per page</option>
                          <option value={50}>50 per page</option>
                          <option value={100}>100 per page</option>
                        </select>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <span className="relative inline-flex items-center border-x-0 border-y border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
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

          {/* Uploaded Statements */}
          <div className="rounded-lg bg-white p-4 shadow sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold sm:text-lg">Uploaded Bank Statements</h2>
              {(user?.role === 'ADMIN' || user?.role === 'PRINCIPAL') && (
                <button
                  onClick={() => fixStuckStatementsMutation.mutate()}
                  disabled={fixStuckStatementsMutation.isPending}
                  className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:bg-gray-400"
                >
                  {fixStuckStatementsMutation.isPending ? 'Fixing...' : 'Fix Stuck'}
                </button>
              )}
            </div>
            
            {bankStatements && bankStatements.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="block space-y-4 lg:hidden">
                  {bankStatements.slice(0, 10).map((statement) => (
                    <div key={statement.id} className="rounded-lg border bg-white p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{statement.filename}</p>
                          <p className="text-sm text-gray-500">{new Date(statement.upload_date).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            statement.status === 'PROCESSED'
                              ? 'bg-green-100 text-green-800'
                              : statement.status === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : statement.status === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {statement.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="text-gray-900">{statement.file_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Uploaded by:</span>
                          <span className="text-gray-900">{statement.uploaded_by_name}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <a
                            href={statement.file_url}
                            download={statement.filename}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                          </a>
                          {statement.status === 'PROCESSED' && (
                            <button
                              onClick={() => setReprocessConfirm(statement.id)}
                              disabled={reprocessMutation.isPending}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                            >
                              {reprocessMutation.isPending ? 'Processing...' : 'Reprocess'}
                            </button>
                          )}
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
                            Date Uploaded
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Filename
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Uploaded By
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {bankStatements.slice(0, 10).map((statement) => (
                          <tr key={statement.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {new Date(statement.upload_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {statement.filename}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {statement.file_type}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {statement.uploaded_by_name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                                  statement.status === 'PROCESSED'
                                    ? 'bg-green-100 text-green-800'
                                    : statement.status === 'PROCESSING'
                                    ? 'bg-blue-100 text-blue-800'
                                    : statement.status === 'FAILED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {statement.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              <div className="flex gap-2">
                                <a
                                  href={statement.file_url}
                                  download={statement.filename}
                                  className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                                >
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                  Download
                                </a>
                                {statement.status === 'PROCESSED' && (
                                  <button
                                    onClick={() => setReprocessConfirm(statement.id)}
                                    disabled={reprocessMutation.isPending}
                                    className="inline-flex items-center gap-1 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                                  >
                                    {reprocessMutation.isPending ? 'Processing...' : 'Reprocess'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No bank statements uploaded yet</p>
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
          <button
            type="button"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-default"
            onClick={() => {
              setShowBreakdownSidebar(false)
              setBreakdownStudentId(null)
            }}
            aria-label="Close payment breakdown"
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

      {/* Reprocess Statement Confirmation Dialog */}
      {reprocessConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reprocess Bank Statement</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to reprocess this statement? Old payments will be <span className="font-semibold">deleted and recreated</span>.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setReprocessConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reprocessMutation.mutate(reprocessConfirm)
                  setReprocessConfirm(null)
                }}
                disabled={reprocessMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {reprocessMutation.isPending ? 'Processing...' : 'Reprocess Statement'}
              </button>
            </div>
          </div>
        </div>
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
