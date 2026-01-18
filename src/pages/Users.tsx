import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import toast from 'react-hot-toast'
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
  password: string
  role: string
}

export default function Users() {
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const queryClient = useQueryClient()
  const subscription = useSubscription()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>()

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/staff/users/')
      return response.data.results || response.data
    }
  })

  const createUserMutation = useMutation({
    mutationFn: async (data: UserForm) => {
      if (editingUser) {
        await api.patch(`/staff/users/${editingUser.id}/`, data)
      } else {
        await api.post('/staff/users/', data)
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
    // Check subscription before allowing add
    if (!subscription.isActive) {
      toast.error('Your subscription has expired. Please renew to add users.')
      return
    }
    
    if (!subscription.hasFeature('staff_management')) {
      toast.error(subscription.getUpgradeMessage('staff management'))
      return
    }
    
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
      password: '' // Don't pre-fill password
    })
    setShowModal(true)
  }

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId)
    }
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
    return <div>Loading...</div>
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
          <ExportButton data={users} filename="users" />
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date Joined
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    {...register('first_name', { required: 'Required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    {...register('last_name', { required: 'Required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  {...register('role', { required: 'Required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select role</option>
                  <option value="PRINCIPAL">Principal</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="SUPPORT">Support Staff</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  {...register('password', { required: !editingUser })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {createUserMutation.isPending ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                    reset()
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
