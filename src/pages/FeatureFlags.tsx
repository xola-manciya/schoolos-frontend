import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { useDialog } from '../contexts/DialogContext'
import {
  FlagIcon,
  PlusIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

interface FeatureFlag {
  id: number
  key: string
  name: string
  description: string
  is_enabled: boolean
  created_at: string
  updated_at: string
  updated_by: number | null
  updated_by_name: string
}

const FEATURE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  students: {
    title: 'Students Management',
    description: 'Allows schools to manage student records, enrollment, and academic information',
  },
  staff: {
    title: 'Staff Management',
    description: 'Enables management of staff profiles, employment records, and performance tracking',
  },
  payments: {
    title: 'Payments & Billing',
    description: 'Provides payment processing, invoice generation, and financial tracking capabilities',
  },
  classes: {
    title: 'Classes Management',
    description: 'Allows creation and management of classes, subjects, and timetables',
  },
  announcements: {
    title: 'Announcements',
    description: 'Enables school-wide announcements and communication features',
  },
  users: {
    title: 'Users Management',
    description: 'Provides user account management and role-based access control',
  },
  school_pictures: {
    title: 'School Pictures',
    description: 'Allows schools to upload and manage photo galleries and media',
  },
  reports: {
    title: 'Reports & Analytics',
    description: 'Provides reporting and analytics capabilities for school data',
  },
}

export default function FeatureFlags() {
  const queryClient = useQueryClient()
  const dialog = useDialog()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    is_enabled: false,
  })

  // Fetch all feature flags
  const { data: flags, isLoading } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const response = await api.get('/general/feature-flags/')
      return response.data
    },
  })

  // Create feature flag mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/general/feature-flags/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] })
      queryClient.invalidateQueries({ queryKey: ['feature-flags-active'] })
      toast.success('Feature flag created successfully')
      setShowCreateModal(false)
      resetForm()
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to create feature flag')
    },
  })

  // Update feature flag mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formData> }) => {
      const response = await api.patch(`/general/feature-flags/${id}/`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] })
      queryClient.invalidateQueries({ queryKey: ['feature-flags-active'] })
      toast.success('Feature flag updated successfully')
      setEditingFlag(null)
      resetForm()
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to update feature flag')
    },
  })

  // Toggle feature flag
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: number; is_enabled: boolean }) => {
      const response = await api.patch(`/general/feature-flags/${id}/`, { is_enabled })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] })
      queryClient.invalidateQueries({ queryKey: ['feature-flags-active'] })
      toast.success(`Feature ${data.is_enabled ? 'enabled' : 'disabled'} successfully`)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to toggle feature flag')
    },
  })

  // Delete feature flag mutation - Currently not exposed in UI
  /* const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/general/feature-flags/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] })
      queryClient.invalidateQueries({ queryKey: ['feature-flags-active'] })
      toast.success('Feature flag deleted successfully')
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to delete feature flag')
    },
  }) */

  const resetForm = () => {
    setFormData({
      key: '',
      name: '',
      description: '',
      is_enabled: false,
    })
  }

  const handleCreate = () => {
    setEditingFlag(null)
    resetForm()
    setShowCreateModal(true)
  }

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag)
    setFormData({
      key: flag.key,
      name: flag.name,
      description: flag.description,
      is_enabled: flag.is_enabled,
    })
    setShowCreateModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingFlag) {
      updateMutation.mutate({ id: editingFlag.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleToggle = async (flag: FeatureFlag) => {
    const action = flag.is_enabled ? 'disable' : 'enable'
    const confirmed = await dialog.confirm(
      `Are you sure you want to ${action} the "${flag.name}" feature? This will affect all schools using the platform.`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} Feature`
    )
    if (confirmed) {
      toggleMutation.mutate({ id: flag.id, is_enabled: !flag.is_enabled })
    }
  }

  const getAvailableFeatures = () => {
    const existingKeys = flags?.map(f => f.key) || []
    return Object.entries(FEATURE_DESCRIPTIONS)
      .filter(([key]) => !existingKeys.includes(key))
      .map(([key, { title, description }]) => ({ key, title, description }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feature flags...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Flags</h1>
          <p className="mt-2 text-gray-600">
            Control which features are available to schools on the platform
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Feature Flag
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Feature Flags</h3>
            <p className="mt-1 text-sm text-blue-700">
              Feature flags allow you to enable or disable specific features across all schools on the platform.
              By default, all features are disabled until you enable them here.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flags?.map((flag) => (
          <div
            key={flag.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FlagIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{flag.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {flag.key}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggle(flag)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  flag.is_enabled ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    flag.is_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600 line-clamp-3">{flag.description}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {flag.is_enabled ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Disabled
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(flag)}
                  className="text-indigo-600 hover:text-indigo-900 p-1"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {flag.updated_by_name && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                Last updated by {flag.updated_by_name}
              </div>
            )}
          </div>
        ))}

        {flags?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FlagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No feature flags</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first feature flag.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Feature Flag
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <button 
              type="button"
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 cursor-default" 
              onClick={() => setShowCreateModal(false)}
              aria-label="Close modal"
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Feature *
                      </label>
                      {editingFlag ? (
                        <div className="mt-1">
                          <p className="text-sm text-gray-900 font-medium">{formData.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Key: {formData.key}</p>
                        </div>
                      ) : (
                        <select
                          required
                          value={formData.key}
                          onChange={(e) => {
                            const selectedFeature = FEATURE_DESCRIPTIONS[e.target.value]
                            setFormData({
                              ...formData,
                              key: e.target.value,
                              name: selectedFeature?.title || '',
                              description: selectedFeature?.description || '',
                            })
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a feature...</option>
                          {getAvailableFeatures().map((feature) => (
                            <option key={feature.key} value={feature.key}>
                              {feature.title}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_enabled}
                        onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable this feature immediately
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {editingFlag ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingFlag(null)
                      resetForm()
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
