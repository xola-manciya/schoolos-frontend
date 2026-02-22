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
  const [pageSize] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [reassignNotes, setReassignNotes] = useState('')
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
    queryKey: ['all-students'],
    queryFn: async () => {
      const response = await api.get('/students/?page_size=1000')
      return response.data.results || response.data
    },
  })

  // Verify payment mutation
  const verifyMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      await api.post(`/payments/list/${paymentId}/verify/`, { verify: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      toast.success('Payment verified successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to verify payment')
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
    mutationFn: async ({ paymentId, studentId, notes }: { paymentId: number; studentId: number; notes: string }) => {
      await api.post(`/payments/list/${paymentId}/reassign/`, { student_id: studentId, notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] })
      setShowReassignModal(false)
      setSelectedPayment(null)
      setSelectedStudentId('')
      setReassignNotes('')
      toast.success('Payment reassigned successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Failed to reassign payment')
    },
  })

  const handleVerify = (payment: Payment) => {
    const amount = parseFloat(String(payment.amount)).toFixed(2)
    if (confirm(`Verify payment of R${amount} from ${payment.student_name || 'Unknown'}?`)) {
      verifyMutation.mutate(payment.id)
    }
  }

  const handleReject = (payment: Payment) => {
    const amount = parseFloat(String(payment.amount)).toFixed(2)
    if (confirm(`Reject payment of R${amount}? This will mark it as REVERSED.`)) {
      rejectMutation.mutate(payment.id)
    }
  }

  const handleReassignClick = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowReassignModal(true)
  }

  const handleReassignSubmit = () => {
    if (!selectedPayment || !selectedStudentId) {
      toast.error('Please select a student')
      return
    }

    reassignMutation.mutate({
      paymentId: selectedPayment.id,
      studentId: parseInt(selectedStudentId),
      notes: reassignNotes || 'Reassigned from pending payments page',
    })
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and approve payments from bank statement uploads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Pending</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{paymentsData?.count || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            R{payments.reduce((sum, p) => sum + parseFloat(String(p.amount) || '0'), 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Page</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, reference, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
                        onClick={() => handleVerify(payment)}
                        disabled={verifyMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
                        title="Approve payment"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReassignClick(payment)}
                        disabled={reassignMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                        title="Reassign to different student"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Reassign
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

      {/* Reassign Modal */}
      {showReassignModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Reassign Payment
            </h2>

            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current Student: <span className="font-semibold">{selectedPayment.student_name || 'None'}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Amount: <span className="font-semibold">R{parseFloat(String(selectedPayment.amount) || '0').toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Date: <span className="font-semibold">{new Date(selectedPayment.payment_date).toLocaleDateString()}</span>
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

            <div className="flex space-x-3">
              <button
                onClick={handleReassignSubmit}
                disabled={!selectedStudentId || reassignMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                {reassignMutation.isPending ? 'Reassigning...' : 'Reassign Payment'}
              </button>
              <button
                onClick={() => {
                  setShowReassignModal(false)
                  setSelectedPayment(null)
                  setSelectedStudentId('')
                  setReassignNotes('')
                }}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-md"
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
