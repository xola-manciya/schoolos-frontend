import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { toast } from 'react-hot-toast'
import { 
  BuildingOfficeIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface School {
  id: number
  name: string
  email: string
  phone: string
  address: string
  company_registration_number: string
  emis_number: string
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  cipc_verified: boolean
  subscription_tier: string
  subscription_start: string
  subscription_end: string
  is_trial: boolean
  is_active: boolean
}

export default function SchoolSettings() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState('')

  const { data: school, isLoading, error } = useQuery({
    queryKey: ['school-settings'],
    queryFn: async () => {
      const response = await api.get('/general/schools/me/')
      return response.data as School
    },
  })

  const deleteSchoolMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/general/schools/${school?.id}/soft-delete/`, {
        reason: deleteReason
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('School deleted successfully. Logging out...')
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 2000)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete school')
    },
  })

  const handleDeleteSchool = () => {
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for deletion')
      return
    }
    deleteSchoolMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load school settings</h2>
        <p className="text-gray-600">Please try refreshing the page or contact support.</p>
      </div>
    )
  }

  const getVerificationBadge = () => {
    if (school.verification_status === 'APPROVED' && school.cipc_verified) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
          <CheckBadgeIcon className="h-4 w-4" />
          Verified
        </span>
      )
    } else if (school.verification_status === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
          <ClockIcon className="h-4 w-4" />
          Pending Review
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
          <XCircleIcon className="h-4 w-4" />
          Rejected
        </span>
      )
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">School Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your school account and configuration
          </p>
        </div>

        {/* School Information Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">School Information</h2>
            {getVerificationBadge()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">School Name</label>
              <p className="text-base font-semibold text-gray-900">{school.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-base text-gray-900">{school.email}</p>
            </div>
            
            {school.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <p className="text-base text-gray-900">{school.phone}</p>
              </div>
            )}
            
            {school.address && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-base text-gray-900">{school.address}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">CIPC Registration Number</label>
              <p className="text-base font-mono text-gray-900">{school.company_registration_number}</p>
            </div>
            
            {school.emis_number && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">EMIS Number</label>
                <p className="text-base font-mono text-gray-900">{school.emis_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Plan</label>
              <p className="text-base font-semibold text-gray-900 capitalize">
                {school.subscription_tier.toLowerCase()}
                {school.is_trial && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Trial</span>}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
              <p className="text-base text-gray-900">{new Date(school.subscription_start).toLocaleDateString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">End Date</label>
              <p className="text-base text-gray-900">{new Date(school.subscription_end).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-2">
                Danger Zone
              </h2>
              <p className="text-sm text-red-800 mb-4">
                Once you delete your school, there is no going back. All user accounts will be deactivated 
                and access to the system will be revoked immediately. School data will be retained for 
                compliance and audit purposes.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <TrashIcon className="h-5 w-5" />
                Delete School Permanently
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Delete School
                </h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-900 mb-3">
                You are about to delete <strong className="font-bold">{school.name}</strong>.
                All users will lose access immediately and data will be archived.
              </p>
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ After 60 days, the school will be permanently deleted and cannot be recovered.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for deletion <span className="text-red-600">*</span>
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow"
                placeholder="Please explain why you are deleting this school (required for compliance)..."
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                This information will be stored for audit purposes.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteReason('')
                }}
                disabled={deleteSchoolMutation.isPending}
                className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSchool}
                disabled={deleteSchoolMutation.isPending || !deleteReason.trim()}
                className="flex-1 px-5 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {deleteSchoolMutation.isPending ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-5 w-5" />
                    Yes, Delete School
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
