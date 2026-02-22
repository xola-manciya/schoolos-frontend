import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { sanitizeText, sanitizeEmail } from '../lib/sanitize'
import LoadingSpinner from '../components/LoadingSpinner'
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '../hooks/useDebounce'
import { PlusIcon, TrashIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ExportButton } from '../components/ExportButton'
import { useSubscription } from '../hooks/useSubscription'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'PRINCIPAL' | 'ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'SUPPORT'
  is_active: boolean
  date_joined: string
}

type UserForm = {
  email: string
  first_name: string
  last_name: string
  role: string
}

export default function Users() {
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderBy, setOrderBy] = useState<string>('email')
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const queryClient = useQueryClient()
  const subscription = useSubscription()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>()

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users', debouncedSearch, orderBy, orderDirection],
    queryFn: async () => {
      const ordering = orderDirection === 'desc' ? `-${orderBy}` : orderBy
      const params = new URLSearchParams({ ordering })
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }
      const response = await api.get(`/staff/users/?${params.toString()}`)
      return response.data.results || response.data
    }
  })

  const createUserMutation = useMutation({
    mutationFn: async (data: UserForm) => {
      // Sanitize inputs before sending to backend
      const sanitizedData = {
        email: sanitizeEmail(data.email),
        first_name: sanitizeText(data.first_name),
        last_name: sanitizeText(data.last_name),
        role: data.role,
      }
      
      if (editingUser) {
        await api.patch(`/staff/users/${editingUser.id}/`, sanitizedData)
      } else {
        await api.post('/staff/users/', sanitizedData)
      }
    },
    onSuccess: () => {
      toast.success(editingUser ? 'User updated successfully!' : 'User created successfully!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setShowModal(false)
      setEditingUser(null)
      reset()
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to save user'
      toast.error(message)
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/staff/users/${userId}/`)
    },
    onSuccess: () => {
      toast.success('User deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to delete user')
    }
  })

  const toggleUserStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      await api.patch(`/staff/users/${id}/`, { is_active: !is_active })
    },
    onSuccess: () => {
      toast.success('User status updated!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to update user status')
    }
  })

  const onSubmit = (data: UserForm) => {
    createUserMutation.mutate(data)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    reset({})
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    reset({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    })
    setShowModal(true)
  }

  const handleSort = (field: string) => {
    if (orderBy === field) {
      // Toggle direction if same field
      setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setOrderBy(field)
      setOrderDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (orderBy !== field) return null
    return orderDirection === 'asc' ? 
      <ChevronUpIcon className="ml-1 inline-block h-4 w-4" /> : 
      <ChevronDownIcon className="ml-1 inline-block h-4 w-4" />
  }

  const handleDelete = (userId: number) => {
    setDeleteConfirm(userId)
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      PRINCIPAL: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      TEACHER: 'bg-green-100 text-green-800',
      ACCOUNTANT: 'bg-yellow-100 text-yellow-800',
      SUPPORT: 'bg-gray-100 text-gray-800'
    }
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />
  }

  return (
    <div className="space-y-6">
      {/* Subscription Warning */}
      {subscription.isExpiringSoon && (
        <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Subscription expiring soon!</strong> Your subscription expires in {subscription.daysUntilExpiry} days.
                Please renew to avoid service interruption.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, or remove system users
          </p>
          {subscription.school && subscription.school.max_staff !== -1 && (
            <p className="mt-1 text-xs text-gray-400">
              {users.length} / {subscription.school.max_staff} users ({subscription.tier} plan)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <ExportButton endpoint="/staff/export/" filename="users" />
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
            <PlusIcon className="h-5 w-5" />
            Add User
          </button>
        </div>
      </div>

      {users.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-lg bg-white shadow lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                    onClick={() => handleSort('first_name')}
                  >
                    <div className="flex items-center">
                      User
                      <SortIcon field="first_name" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th 
                    scope="col" 
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                    onClick={() => handleSort('date_joined')}
                  >
                    <div className="flex items-center">
                      Date Joined
                      <SortIcon field="date_joined" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus.mutate({ id: user.id, is_active: user.is_active })}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => handleEdit(user)}
                        className="mr-3 text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block space-y-4 lg:hidden">
            {users.map((user) => (
          <div key={user.id} className="rounded-lg bg-white p-4 shadow">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadge(user.role)}`}>
                {user.role}
              </span>
            </div>
            
            <div className="mb-3 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-500">Status:</span>
              <button
                onClick={() => toggleUserStatus.mutate({ id: user.id, is_active: user.is_active })}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>

            <div className="flex gap-2 border-t pt-3">
              <button
                onClick={() => handleEdit(user)}
                className="flex-1 rounded-lg border border-primary-600 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new user to the system.</p>
          <div className="mt-6">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Add User
            </button>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Invite New User'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {editingUser 
                  ? 'Update user information' 
                  : 'An email invitation will be sent with login credentials'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <span className="text-red-500">*</span> indicates required fields
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('first_name', { required: 'First name is required' })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('last_name', { required: 'Last name is required' })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                    placeholder="john.doe@example.com"
                    disabled={!!editingUser}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                  {editingUser && (
                    <p className="mt-1.5 text-xs text-gray-500">Email cannot be changed</p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
                  >
                    <option value="">Select a role...</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="SUPPORT">Support Staff</option>
                    <option value="CLERK">Clerk</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Info Box for New Users */}
                {!editingUser && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-blue-800">Invitation Email</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>A secure invitation email will be sent to the user with:</p>
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li>Temporary login credentials</li>
                            <li>Link to set their own password</li>
                            <li>Welcome information</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                    reset()
                  }}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createUserMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingUser ? 'Updating...' : 'Sending Invitation...'}
                    </span>
                  ) : (
                    editingUser ? 'Update User' : 'Send Invitation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this user? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUserMutation.mutate(deleteConfirm)
                  setDeleteConfirm(null)
                }}
                disabled={deleteUserMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
