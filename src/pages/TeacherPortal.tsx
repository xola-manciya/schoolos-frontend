import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { 
  CalendarIcon, 
  UserCircleIcon, 
  AcademicCapIcon,
  DocumentTextIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface TeacherProfile {
  id: number
  employee_id: string
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    role: string
  }
  position: string
  department: string
  annual_leave_balance: number
  sick_leave_balance: number
}

interface Leave {
  id: number
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  days_requested: number
  created_at: string
}

interface Student {
  id: number
  student_id: string
  first_name: string
  last_name: string
  class_assigned: string
  grade_level: number
}

export default function TeacherPortal() {
  // const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showLeaveForm, setShowLeaveForm] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  
  const [leaveForm, setLeaveForm] = useState({
    leave_type: 'ANNUAL',
    start_date: '',
    end_date: '',
    reason: '',
  })

  const [profileForm, setProfileForm] = useState({
    phone_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  })

  // Fetch teacher profile
  const { data: profile } = useQuery<TeacherProfile>({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const response = await api.get('/staff/profiles/me/')
      return response.data
    },
  })

  // Fetch teacher's leaves
  const { data: leavesData } = useQuery<Leave[]>({
    queryKey: ['teacher-leaves'],
    queryFn: async () => {
      const response = await api.get('/staff/leaves/')
      return response.data
    },
  })
  
  const leaves = Array.isArray(leavesData) ? leavesData : []

  // Fetch students assigned to teacher
  const { data: studentsData } = useQuery<Student[]>({
    queryKey: ['teacher-students'],
    queryFn: async () => {
      const response = await api.get('/students/students/?teacher=me')
      return response.data
    },
  })
  
  const students = Array.isArray(studentsData) ? studentsData : []

  // Submit leave application
  const leaveApplication = useMutation({
    mutationFn: async (data: typeof leaveForm) => {
      const response = await api.post('/staff/leaves/', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Leave application submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['teacher-leaves'] })
      setShowLeaveForm(false)
      setLeaveForm({
        leave_type: 'ANNUAL',
        start_date: '',
        end_date: '',
        reason: '',
      })
    },
    onError: () => {
      toast.error('Failed to submit leave application')
    },
  })

  // Update profile
  const updateProfile = useMutation({
    mutationFn: async (data: typeof profileForm) => {
      const response = await api.patch(`/staff/profiles/${profile?.id}/`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] })
      setShowProfileEdit(false)
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    leaveApplication.mutate(leaveForm)
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(profileForm)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {profile?.user.first_name}!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Leave</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {profile?.annual_leave_balance || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">days remaining</p>
            </div>
            <CalendarIcon className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sick Leave</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {profile?.sick_leave_balance || 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">days remaining</p>
            </div>
            <CalendarIcon className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Students</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {students.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">total students</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leave Requests</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {leaves.filter((l) => l.status === 'PENDING').length}
              </p>
              <p className="mt-1 text-xs text-gray-500">pending approval</p>
            </div>
            <DocumentTextIcon className="h-12 w-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leave Applications */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Leave Applications</h2>
            <button
              onClick={() => setShowLeaveForm(true)}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5" />
              Apply for Leave
            </button>
          </div>

          <div className="space-y-4">
            {leaves.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No leave applications yet</p>
            ) : (
              leaves.slice(0, 5).map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-shrink-0">{getStatusIcon(leave.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {leave.leave_type.replace('_', ' ')}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {new Date(leave.start_date).toLocaleDateString()} -{' '}
                          {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {leave.days_requested} day(s)
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile Quick Edit */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
            <button
              onClick={() => setShowProfileEdit(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Edit Details
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="h-16 w-16 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-900">
                  {profile?.user.first_name} {profile?.user.last_name}
                </p>
                <p className="text-sm text-gray-600">{profile?.position}</p>
                <p className="text-sm text-gray-500">{profile?.department}</p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Employee ID:</span>
                <span className="font-medium text-gray-900">{profile?.employee_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{profile?.user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{profile?.user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Students Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">My Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students assigned yet
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {student.class_assigned || 'Not assigned'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      Grade {student.grade_level}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                  <option value="STUDY">Study Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Update Profile</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone_number}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone_number: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+27123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, address: e.target.value })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={profileForm.emergency_contact_name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, emergency_contact_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.emergency_contact_phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, emergency_contact_phone: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="+27123456789"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
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
