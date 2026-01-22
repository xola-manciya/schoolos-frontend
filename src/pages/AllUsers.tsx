import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  is_platform_admin: boolean
  date_joined: string
  school?: {
    id: number
    name: string
  }
  profile?: {
    phone_number: string
    position: string
  }
}

export default function AllUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['all-users', searchQuery, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      
      const response = await api.get(`/staff/profiles/all/?${params.toString()}`)
      return Array.isArray(response.data) ? response.data : response.data.results || []
    },
  })

  const getRoleBadge = (role: string, isPlatformAdmin: boolean) => {
    if (isPlatformAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <ShieldCheckIcon className="h-3.5 w-3.5" />
          Platform Admin
        </span>
      )
    }

    const roleColors: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      PRINCIPAL: { bg: 'bg-blue-100', text: 'text-blue-800' },
      HOD: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      TEACHER: { bg: 'bg-green-100', text: 'text-green-800' },
      SUPPORT: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      ACCOUNTANT: { bg: 'bg-orange-100', text: 'text-orange-800' },
      PAYMENT_PROCESSOR: { bg: 'bg-pink-100', text: 'text-pink-800' },
      CLERK: { bg: 'bg-gray-100', text: 'text-gray-800' },
    }

    const colors = roleColors[role] || { bg: 'bg-gray-100', text: 'text-gray-800' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {role.replace('_', ' ')}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'PRINCIPAL', label: 'Principal' },
    { value: 'HOD', label: 'HOD' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'ACCOUNTANT', label: 'Accountant' },
    { value: 'PAYMENT_PROCESSOR', label: 'Payment Processor' },
    { value: 'CLERK', label: 'Clerk' },
  ]

  // Calculate stats
  const totalUsers = users?.length || 0
  const activeUsers = users?.filter(u => u.is_active).length || 0
  const platformAdmins = users?.filter(u => u.is_platform_admin).length || 0
  const schoolUsers = users?.filter(u => !u.is_platform_admin).length || 0

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Complete list of all users across all schools on the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-lg font-semibold text-gray-900">{activeUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Platform Admins</dt>
                  <dd className="text-lg font-semibold text-gray-900">{platformAdmins}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOffice2Icon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">School Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">{schoolUsers}</dd>
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
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading users...</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No users are registered on the platform yet'}
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="hover:bg-gray-50">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-600">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        {getRoleBadge(user.role, user.is_platform_admin)}
                        {!user.is_active && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <EnvelopeIcon className="h-4 w-4" />
                          {user.email}
                        </span>
                        {user.school && (
                          <span className="flex items-center gap-1.5">
                            <BuildingOffice2Icon className="h-4 w-4" />
                            {user.school.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl font-medium text-indigo-600">
                    {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                  </span>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    {getRoleBadge(selectedUser.role, selectedUser.is_platform_admin)}
                    {!selectedUser.is_active && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedUser.email}</dd>
                  </div>
                  {selectedUser.profile?.phone_number && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <PhoneIcon className="h-4 w-4" />
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedUser.profile.phone_number}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* School Info */}
              {selectedUser.school && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">School Information</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <BuildingOffice2Icon className="h-4 w-4" />
                        School
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedUser.school.name}</dd>
                    </div>
                    {selectedUser.profile?.position && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Position</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedUser.profile.position}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4" />
                      Joined
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.date_joined)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.is_active ? (
                        <span className="text-green-600">Active ✓</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedUser.role.replace('_', ' ')}</dd>
                  </div>
                  {selectedUser.is_platform_admin && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Platform Admin</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="text-purple-600 flex items-center gap-1">
                          <ShieldCheckIcon className="h-4 w-4" />
                          Yes
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setSelectedUser(null)}
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
