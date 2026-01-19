import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import api from '../lib/api'
import { StaffProfile, Leave } from '../types'
import { ExportButton } from '../components/ExportButton'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type LeaveFilter = 'all' | 'on-leave' | 'active'

interface StaffForm {
  email: string
  first_name: string
  last_name: string
  role: 'ADMIN' | 'TEACHER' | 'CLERK' | 'PRINCIPAL' | 'HOD'
  phone?: string
  employee_id: string
  id_number: string
  date_of_birth?: string
  gender?: 'M' | 'F' | 'O'
  address?: string
  department?: string
  date_of_joining?: string
  salary?: number
}

export default function Staff() {
  const [filter, setFilter] = useState<LeaveFilter>('all')
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StaffForm>()

  const { data: staffList, isLoading: staffLoading } = useQuery<StaffProfile[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await api.get('/staff/')
      const data = response.data
      // Handle both array and paginated response
      if (Array.isArray(data)) return data
      if (data.results && Array.isArray(data.results)) return data.results
      return []
    },
  })

  const { data: leaves } = useQuery<Leave[]>({
    queryKey: ['leaves'],
    queryFn: async () => {
      const response = await api.get('/staff/leaves/')
      const data = response.data
      // Handle both array and paginated response
      if (Array.isArray(data)) return data
      if (data.results && Array.isArray(data.results)) return data.results
      return []
    },
  })

  // Get active leaves for filtering
  const activeLeaves = (leaves || []).filter(
    leave => leave.status === 'APPROVED' && 
    new Date(leave.start_date) <= new Date() && 
    new Date(leave.end_date) >= new Date()
  )

  const staffOnLeaveIds = new Set(activeLeaves.map(leave => leave.staff))

  const filteredStaff = (Array.isArray(staffList) ? staffList : []).filter(staff => {
    if (filter === 'on-leave') return staffOnLeaveIds.has(staff.id)
    if (filter === 'active') return !staffOnLeaveIds.has(staff.id)
    return true
  })

  const getStaffLeave = (staffId: number) => {
    return activeLeaves.find(leave => leave.staff === staffId)
  }

  const createStaffMutation = useMutation({
    mutationFn: async (data: StaffForm) => {
      // Generate a secure random password
      const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < 12; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
      }
      
      const generatedPassword = generatePassword()
      
      // Create user first (use email as username since username is optional)
      const userResponse = await api.post('/staff/users/', {
        username: data.email.split('@')[0], // Use email prefix as username
        email: data.email,
        password: generatedPassword,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        phone: data.phone || '',
      })
      
      // Then create staff profile
      await api.post('/staff/', {
        user: userResponse.data.id,
        employee_id: data.employee_id,
        id_number: data.id_number,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || 'O',
        address: data.address || '',
        department: data.department || '',
        date_of_joining: data.date_of_joining || new Date().toISOString().split('T')[0],
        salary: data.salary || 0,
      })
      
      return generatedPassword
    },
    onSuccess: (_generatedPassword) => {
      toast.success(`Staff member added successfully! Temporary password has been sent to their email.`)
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      setShowModal(false)
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add staff member')
    },
  })

  const onSubmit = (data: StaffForm) => {
    createStaffMutation.mutate(data)
  }

  if (staffLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Staff Management</h1>
        <div className="flex gap-2">
          <ExportButton endpoint="/staff/profiles/export/" />
          <button 
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 sm:text-base"
          >
            Add Staff
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium sm:flex-none sm:px-4 sm:text-sm ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({Array.isArray(staffList) ? staffList.length : 0})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium sm:flex-none sm:px-4 sm:text-sm ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Active ({(Array.isArray(staffList) ? staffList.length : 0) - staffOnLeaveIds.size})
        </button>
        <button
          onClick={() => setFilter('on-leave')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium sm:flex-none sm:px-4 sm:text-sm ${
            filter === 'on-leave'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          On Leave ({staffOnLeaveIds.size})
        </button>
      </div>

      {filteredStaff.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="block space-y-4 lg:hidden">
            {filteredStaff.map((staff) => {
              const currentLeave = getStaffLeave(staff.id)
              const isOnLeave = !!currentLeave

              return (
                <div key={staff.id} className={`rounded-lg bg-white p-4 shadow ${isOnLeave ? 'border-l-4 border-orange-500' : ''}`}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{staff.user.first_name} {staff.user.last_name}</p>
                      <p className="text-sm text-gray-500">{staff.employee_id}</p>
                    </div>
                    {isOnLeave ? (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                        On Leave
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Position:</span>
                      <span className="text-gray-900">{staff.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-900">{staff.department}</span>
                    </div>
                    {isOnLeave && currentLeave && (
                      <div className="mt-2 rounded bg-orange-50 p-2 text-xs">
                        <p className="font-medium text-orange-900">{currentLeave.leave_type}</p>
                        <p className="text-orange-700">Until {new Date(currentLeave.end_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div className="mt-2 border-t pt-2 text-xs text-gray-600">
                      <div>Annual Leave: {staff.annual_leave_balance} days</div>
                      <div>Sick Leave: {staff.sick_leave_balance} days</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-lg bg-white shadow lg:block">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Leave Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStaff.map((staff) => {
                  const currentLeave = getStaffLeave(staff.id)
                  const isOnLeave = !!currentLeave

                  return (
                    <tr key={staff.id} className={`hover:bg-gray-50 ${isOnLeave ? 'bg-orange-50' : ''}`}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {staff.employee_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {staff.user.first_name} {staff.user.last_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {staff.position}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {staff.department}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {isOnLeave ? (
                          <div>
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                              On Leave
                            </span>
                            <div className="mt-1 text-xs text-gray-500">
                              {currentLeave.leave_type} until {new Date(currentLeave.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="text-xs">
                      <div>Annual: {staff.annual_leave_balance} days</div>
                      <div>Sick: {staff.sick_leave_balance} days</div>
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Get started by adding staff members to your school.' 
              : `No staff members match the "${filter}" filter.`}
          </p>
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Add Staff Member</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* User Account Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">Account Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    <p className="mt-1 text-xs text-gray-500">A temporary password will be sent to this email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role *</label>
                    <select
                      {...register('role', { required: 'Role is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Select Role</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="CLERK">Clerk</option>
                      <option value="ADMIN">Admin</option>
                      <option value="PRINCIPAL">Principal</option>
                    </select>
                    {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">Personal Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      {...register('first_name', { required: 'First name is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                    {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      {...register('last_name', { required: 'Last name is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                    {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID *</label>
                    <input
                      type="text"
                      {...register('employee_id', { required: 'Employee ID is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                    {errors.employee_id && <p className="mt-1 text-xs text-red-600">{errors.employee_id.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number *</label>
                    <input
                      type="text"
                      {...register('id_number', { required: 'ID number is required' })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                    {errors.id_number && <p className="mt-1 text-xs text-red-600">{errors.id_number.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      {...register('date_of_birth')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      {...register('gender')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      {...register('address')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">Employment Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      {...register('department')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <input
                      type="date"
                      {...register('date_of_joining')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Salary (R)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('salary', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    reset()
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createStaffMutation.isPending}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {createStaffMutation.isPending ? 'Adding...' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
