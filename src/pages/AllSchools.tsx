import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import {
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

interface School {
  id: number
  name: string
  contact_email: string
  contact_phone: string
  address: string
  registration_number: string
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  cipc_verified: boolean
  is_active: boolean
  created_at: string
  staff_count: number
  student_count: number
  admin_user: {
    id: number
    first_name: string
    last_name: string
    email: string
  } | null
}

export default function AllSchools() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  const { data: schools, isLoading } = useQuery<School[]>({
    queryKey: ['all-schools', searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await api.get(`/general/schools/?${params.toString()}`)
      return Array.isArray(response.data) ? response.data : response.data.results || []
    },
  })

  const handleViewDetails = async (schoolId: number) => {
    setIsLoadingDetails(true)
    setSelectedSchool(null) // Clear previous data
    
    try {
      const response = await api.get(`/general/schools/${schoolId}/`)
      setSelectedSchool(response.data)
    } catch (error) {
      console.error('Failed to load school details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      APPROVED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Approved' },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'Pending' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Rejected' },
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="h-3.5 w-3.5" />
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">All Schools</h1>
          <p className="mt-2 text-sm text-gray-700">
            Complete list of all registered schools on the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Schools</dt>
                  <dd className="text-lg font-semibold text-gray-900">{schools?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {schools?.filter(s => s.verification_status === 'APPROVED').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {schools?.filter(s => s.verification_status === 'PENDING').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {schools?.filter(s => s.verification_status === 'REJECTED').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools by name, email, or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="all">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Schools List */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading schools...</p>
          </div>
        ) : !schools || schools.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No schools found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No schools are registered on the platform yet'}
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {schools.map((school) => (
              <li key={school.id} className="hover:bg-gray-50">
                <button
                  onClick={() => handleViewDetails(school.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {school.name}
                      </h3>
                      {getStatusBadge(school.verification_status)}
                      {school.cipc_verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckCircleIcon className="h-3.5 w-3.5" />
                          CIPC Verified
                        </span>
                      )}
                      {!school.is_active && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Reg #:</span> {school.registration_number}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserGroupIcon className="h-4 w-4" />
                        {school.student_count} Students
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="h-4 w-4" />
                        {school.staff_count} Staff
                      </div>
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Registered: {formatDate(school.created_at)}
                    </div>
                  </div>

                  <div>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* School Details Modal */}
      {(selectedSchool || isLoadingDetails) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">School Details</h2>
                <button
                  onClick={() => {
                    setSelectedSchool(null)
                    setIsLoadingDetails(false)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {isLoadingDetails ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-sm text-gray-500">Loading school details...</p>
              </div>
            ) : selectedSchool ? (
              <div className="px-6 py-4 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">School Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.registration_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">{getStatusBadge(selectedSchool.verification_status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">CIPC Verification</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedSchool.cipc_verified ? 'Verified ✓' : 'Not Verified'}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.address}</dd>
                  </div>
                </dl>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.contact_email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.contact_phone}</dd>
                  </div>
                </dl>
              </div>

              {/* Admin User */}
              {selectedSchool.admin_user && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Administrator</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedSchool.admin_user.first_name} {selectedSchool.admin_user.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedSchool.admin_user.email}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Statistics</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Students</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.student_count}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Staff Members</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedSchool.staff_count}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Registered On</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedSchool.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Active Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedSchool.is_active ? 'Active ✓' : 'Inactive'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            ) : null}

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedSchool(null)
                  setIsLoadingDetails(false)
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
