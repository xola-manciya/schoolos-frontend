import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Payment, Student } from '../types'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type PaginatedPaymentsResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Payment[]
}

export default function PendingPayments() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)  // Increased from 20 to show more payments per page
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [reassignNotes, setReassignNotes] = useState('')
  const [reassignAmount, setReassignAmount] = useState<string>('')
  const [paymentType, setPaymentType] = useState<'normal' | 'registration'>('normal')
  const queryClient = useQueryClient()

  // Fetch pending payments
  const { data: paymentsData, isLoading } = useQuery<PaginatedPaymentsResponse>({
    queryKey: ['pending-payments', currentPage, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        status: 'PENDING',
        ordering: '-payment_date',
      })
      const response = await api.get(`/payments/list/?${params.toString()}`)
      return response.data
    },
  })

  // Fetch all students for reassignment dropdown
  const { data: allStudents } = useQuery<Student[]>({
    queryKey: ['all-students-v2'],  // v2 to bust cache
    queryFn: async () => {
      const response = await api.get('/students/?page_size=1000')
      return response.data.results || response.data
    },
  })

  // Approve payment mutation (for approving without reassignment)
  const approveMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      await api.post(`/payments/list/${paymentId}/verify/`, { verify: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      setShowReassignModal(false)
      setSelectedPayment(null)
      setSelectedStudentId('')
      setReassignNotes('')
      setReassignAmount('')
      setPaymentType('normal')
      toast.success('Payment approved successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to approve payment')
    },
  })

  // Reject payment mutation
  const rejectMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      await api.post(`/payments/list/${paymentId}/verify/`, { verify: false, notes: 'Rejected by user' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      toast.success('Payment rejected')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to reject payment')
    },
  })

  // Reassign payment mutation
  const reassignMutation = useMutation({
    mutationFn: async ({ 
      paymentId, 
      studentId, 
      notes, 
      amount, 
      approve 
    }: { 
      paymentId: number
      studentId: number
      notes: string
      amount: number
      approve: boolean
    }) => {
      // First reassign the payment with the new amount
      await api.post(`/payments/list/${paymentId}/reassign/`, { 
        student_id: studentId, 
        notes,
        amount: amount
      })
      
      // If approve is true, verify the payment
      if (approve) {
        await api.post(`/payments/list/${paymentId}/verify/`, { verify: true })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      setShowReassignModal(false)
      setSelectedPayment(null)
      setSelectedStudentId('')
      setReassignNotes('')
      setReassignAmount('')
      setPaymentType('normal')
      toast.success('Payment reassigned successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to reassign payment')
    },
  })

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: async (paymentIds: number[]) => {
      // Approve payments sequentially to avoid overwhelming the server
      const results = await Promise.allSettled(
        paymentIds.map(id => api.post(`/payments/list/${id}/verify/`, { verify: true }))
      )
      const succeeded = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      return { succeeded, failed, total: paymentIds.length }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      toast.success(`Approved ${data.succeeded} of ${data.total} payments` + 
        (data.failed > 0 ? ` (${data.failed} failed)` : ''))
    },
    onError: () => {
      toast.error('Failed to approve payments')
    },
  })

  const handleReject = (payment: Payment) => {
    const amount = parseFloat(String(payment.amount)).toFixed(2)
    if (confirm(`Reject payment of R${amount}? This will mark it as REVERSED.`)) {
      rejectMutation.mutate(payment.id)
    }
  }

  const handleReassignClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setReassignAmount(parseFloat(String(payment.amount) || '0').toFixed(2))
    setPaymentType('normal')
    setShowReassignModal(true)
  }

  const handleApproveFromModal = () => {
    if (!selectedPayment) {
      toast.error('No payment selected')
      return
    }

    if (confirm(`Approve payment of R${parseFloat(String(selectedPayment.amount) || '0').toFixed(2)} for ${selectedPayment.student_name}?`)) {
      approveMutation.mutate(selectedPayment.id)
    }
  }

  const handleReassignSubmit = (approve: boolean) => {
    if (!selectedPayment || !selectedStudentId) {
      toast.error('Please select a student')
      return
    }

    const amount = parseFloat(reassignAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    reassignMutation.mutate({
      paymentId: selectedPayment.id,
      studentId: parseInt(selectedStudentId),
      notes: reassignNotes || `Reassigned from pending payments page. Payment type: ${paymentType}`,
      amount: amount,
      approve: approve,
    })
  }

  const handleBulkApprove = () => {
    const count = filteredPayments.length
    if (count === 0) {
      toast.error('No payments to approve')
      return
    }

    if (confirm(`Approve all ${count} payment(s) on this page? This will update student balances.`)) {
      const paymentIds = filteredPayments.map(p => p.id)
      bulkApproveMutation.mutate(paymentIds)
    }
  }

  const payments = paymentsData?.results || []
  const totalPages = paymentsData ? Math.ceil(paymentsData.count / pageSize) : 1

  // Filter payments by search term (client-side for now)
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      payment.student_name?.toLowerCase().includes(term) ||
      payment.student_id?.toLowerCase().includes(term) ||
      payment.reference_number?.toLowerCase().includes(term) ||
      String(payment.amount).includes(term)
    )
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 ">Pending Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and approve payments from bank statement uploads
        </p>
      </div>

      {/* Info Banner for Multiple Pages */}
      {totalPages > 1 && (
        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> You have {paymentsData?.count} total pending payments across {totalPages} pages. 
            The "Approve All" button only approves payments on the current page. 
            Navigate through all pages to approve all payments.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Pending (All Pages)</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{paymentsData?.count || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount (All Pages)</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            R{payments.reduce((sum, p) => sum + parseFloat(String(p.amount) || '0'), 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Showing Page</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Search Bar and Bulk Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, reference, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {filteredPayments.length > 0 && (
          <button
            onClick={handleBulkApprove}
            disabled={bulkApproveMutation.isPending}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {bulkApproveMutation.isPending ? 'Approving...' : `Approve All (${filteredPayments.length})`}
          </button>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Match Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No payments match your search' : 'No pending payments'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.student_name || 'Unmatched'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      R{parseFloat(String(payment.amount) || '0').toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.reference_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {payment.match_type || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.match_confidence ? `${payment.match_confidence}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleReassignClick(payment)}
                        disabled={reassignMutation.isPending || approveMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                        title="Review and approve or reassign payment"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Review
                      </button>
                      <button
                        onClick={() => handleReject(payment)}
                        disabled={rejectMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                        title="Reject payment"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review & Approve Modal */}
      {showReassignModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Review Payment
            </h2>

            {/* Bank Statement Information */}
            {selectedPayment.transaction_description && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Bank Statement Description:
                </div>
                <div className="text-sm text-blue-900 dark:text-blue-100 font-mono whitespace-pre-wrap break-words">
                  {selectedPayment.transaction_description}
                </div>
              </div>
            )}

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Current Student:</span> {selectedPayment.student_name || 'None'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Original Amount:</span> R{parseFloat(String(selectedPayment.amount) || '0').toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-semibold">Date:</span> {new Date(selectedPayment.payment_date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Match Confidence:</span> {selectedPayment.match_confidence}%
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select New Student *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Student --</option>
                {allStudents?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Assign *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">R</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={reassignAmount}
                  onChange={(e) => setReassignAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                You can change the amount if splitting a payment between multiple students
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="normal"
                    checked={paymentType === 'normal'}
                    onChange={(e) => setPaymentType(e.target.value as 'normal' | 'registration')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Normal Fee Payment
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="registration"
                    checked={paymentType === 'registration'}
                    onChange={(e) => setPaymentType(e.target.value as 'normal' | 'registration')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Registration Fee Payment
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={reassignNotes}
                onChange={(e) => setReassignNotes(e.target.value)}
                rows={3}
                placeholder="Reason for reassignment..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Review the payment details above.</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                • If the student is correct, click <strong>"Approve"</strong> to verify the payment<br/>
                • If you need to change the student or split the amount, use the reassign options below
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              {/* Primary action: Approve as-is */}
              <button
                onClick={handleApproveFromModal}
                disabled={approveMutation.isPending || reassignMutation.isPending}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold border-2 border-green-700"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {approveMutation.isPending ? 'Approving...' : 'Approve Payment'}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or reassign to different student
                  </span>
                </div>
              </div>

              {/* Reassignment actions */}
              <button
                onClick={() => handleReassignSubmit(true)}
                disabled={!selectedStudentId || !reassignAmount || reassignMutation.isPending || approveMutation.isPending}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {reassignMutation.isPending ? 'Processing...' : 'Reassign & Approve'}
              </button>
              <button
                onClick={() => handleReassignSubmit(false)}
                disabled={!selectedStudentId || !reassignAmount || reassignMutation.isPending || approveMutation.isPending}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                {reassignMutation.isPending ? 'Processing...' : 'Reassign Only (Keep Pending)'}
              </button>
              <button
                onClick={() => {
                  setShowReassignModal(false)
                  setSelectedPayment(null)
                  setSelectedStudentId('')
                  setReassignNotes('')
                  setReassignAmount('')
                  setPaymentType('normal')
                }}
                disabled={reassignMutation.isPending}
                className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
