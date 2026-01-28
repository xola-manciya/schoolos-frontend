import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-hot-toast'
import { sanitizeText, sanitizeEmail, sanitizePhone } from '../lib/sanitize'
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface ProfileData {
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  employee_id?: string
}

interface PasswordData {
  old_password: string
  new_password: string
  confirm_password: string
}

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    employee_id: '',
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      // Sanitize inputs before sending to backend
      const sanitizedData = {
        first_name: sanitizeText(data.first_name),
        last_name: sanitizeText(data.last_name),
        email: sanitizeEmail(data.email),
        phone: sanitizePhone(data.phone),
        role: data.role,
        employee_id: data.employee_id ? sanitizeText(data.employee_id) : '',
      }
      const response = await api.patch('/auth/user/', sanitizedData)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully')
      updateUser(data)
      setIsEditingProfile(false)
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordData) => {
      const response = await api.post('/auth/password/change/', {
        old_password: data.old_password,
        new_password1: data.new_password,
        new_password2: data.confirm_password,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      })
      setIsChangingPassword(false)
    },
    onError: (error: any) => {
      const errors = error.response?.data
      if (errors?.old_password) {
        toast.error(errors.old_password[0])
      } else if (errors?.new_password2) {
        toast.error(errors.new_password2[0])
      } else {
        toast.error('Failed to change password')
      }
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    changePasswordMutation.mutate(passwordData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              ) : (
                <p className="text-gray-900 py-2">{profileData.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              ) : (
                <p className="text-gray-900 py-2">{profileData.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900 py-2">{profileData.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditingProfile ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900 py-2">{profileData.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <p className="text-gray-900 py-2">{profileData.role}</p>
            </div>

            {profileData.employee_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <p className="text-gray-900 py-2">{profileData.employee_id}</p>
              </div>
            )}
          </div>

          {isEditingProfile && (
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false)
                  setProfileData({
                    first_name: user?.first_name || '',
                    last_name: user?.last_name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    role: user?.role || '',
                  })
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <LockClosedIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false)
                  setPasswordData({
                    old_password: '',
                    new_password: '',
                    confirm_password: '',
                  })
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
