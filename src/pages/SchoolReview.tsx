import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useDialog } from '../contexts/DialogContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

interface School {
  id: number;
  name: string;
  registration_number: string;
  company_registration_number: string;
  emis_number: string;
  address: string;
  phone: string;
  email: string;
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  cipc_verified: boolean;
  cipc_verification_date: string | null;
  subscription_status: string;
  subscription_tier: string;
  is_trial: boolean;
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start: string;
  subscription_end: string;
  created_at: string;
  is_active: boolean;
  staff_count: number;
  student_count: number;
  admin_user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  } | null;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

export default function SchoolReview() {
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch schools for review
  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ['school-review', statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/general/schools/review/?${params.toString()}`);
      return response.data;
    },
  });

  // Approve school mutation
  const approveMutation = useMutation({
    mutationFn: async (schoolId: number) => {
      const response = await api.post(`/general/schools/${schoolId}/approve/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['school-review'] });
      toast.success(data.message);
      setShowDetailModal(false);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to approve school');
    },
  });

  // Reject school mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ schoolId, reason }: { schoolId: number; reason: string }) => {
      const response = await api.post(`/general/schools/${schoolId}/reject/`, { reason });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['school-review'] });
      toast.success(data.message);
      setShowDetailModal(false);
      setRejectionReason('');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to reject school');
    },
  });

  // Toggle CIPC verification mutation
  const toggleVerificationMutation = useMutation({
    mutationFn: async (schoolId: number) => {
      const response = await api.post(`/general/schools/${schoolId}/approve/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-review'] });
      toast.success('CIPC verification status updated');
      // Update the selected school to reflect changes
      if (selectedSchool) {
        setSelectedSchool({
          ...selectedSchool,
          cipc_verified: true,
          verification_status: 'APPROVED',
          cipc_verification_date: new Date().toISOString()
        });
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to update verification status');
    },
  });

  // Toggle school active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (schoolId: number) => {
      const response = await api.post(`/general/schools/${schoolId}/toggle-active/`);
      return response.data;
    },
    onSuccess: async (data) => {
      // Refetch school data to get updated list
      await queryClient.refetchQueries({ queryKey: ['school-review'] });
      toast.success(data.message);
      // Update the selected school to reflect changes
      if (selectedSchool) {
        setSelectedSchool({
          ...selectedSchool,
          is_active: data.is_active
        });
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { detail?: string } } }
      toast.error(err.response?.data?.detail || 'Failed to toggle school status');
    },
  });

  const handleApprove = async (schoolId: number) => {
    const confirmed = await dialog.confirm(
      'Are you sure you want to approve this school?',
      'Approve School'
    );
    if (confirmed) {
      approveMutation.mutate(schoolId);
    }
  };

  const handleReject = async (schoolId: number) => {
    if (!rejectionReason.trim()) {
      await dialog.warning('Please provide a rejection reason');
      return;
    }
    const confirmed = await dialog.confirm(
      'Are you sure you want to reject this school? This will block their access.',
      'Reject School'
    );
    if (confirmed) {
      rejectMutation.mutate({ schoolId, reason: rejectionReason });
    }
  };

  const handleToggleActive = async (school: School) => {
    const action = school.is_active ? 'disable' : 'enable';
    const message = school.is_active 
      ? 'This will block all access to the school. Users will not be able to login or access any features.'
      : 'This will restore access to the school. Users will be able to login and access features.';
    
    const confirmed = await dialog.confirm(
      message,
      `${action.charAt(0).toUpperCase() + action.slice(1)} School`
    );
    
    if (confirmed) {
      toggleActiveMutation.mutate(school.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Pending Review' },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, text: 'Rejected' },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-4 w-4" />
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  const schools = data?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">School Registration Review</h1>
        <p className="mt-2 text-gray-600">Review and approve school registrations for CIPC compliance</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <div className="flex gap-2">
              {['PENDING', 'APPROVED', 'REJECTED', ''].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="School name, email, CIPC, or EMIS number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{data?.count || 0}</p>
            </div>
            <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">
                {schools.filter(s => s.verification_status === 'PENDING').length}
              </p>
            </div>
            <ClockIcon className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Approved</p>
              <p className="text-2xl font-bold text-green-900">
                {schools.filter(s => s.verification_status === 'APPROVED').length}
              </p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Rejected</p>
              <p className="text-2xl font-bold text-red-900">
                {schools.filter(s => s.verification_status === 'REJECTED').length}
              </p>
            </div>
            <XCircleIcon className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No schools found matching your criteria
                  </td>
                </tr>
              ) : (
                schools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-10 w-10 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{school.name}</div>
                          {school.admin_user && (
                            <div className="text-xs text-gray-500">
                              Admin: {school.admin_user.full_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {school.company_registration_number && (
                          <div className="flex items-center gap-1">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                            CIPC: {school.company_registration_number}
                          </div>
                        )}
                        {school.emis_number && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                            EMIS: {school.emis_number}
                          </div>
                        )}
                        {!school.company_registration_number && !school.emis_number && (
                          <span className="text-gray-400">No registration info</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center gap-1">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          {school.email}
                        </div>
                        {school.phone && (
                          <div className="flex items-center gap-1">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            {school.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center gap-1">
                          <UserGroupIcon className="h-4 w-4 text-gray-400" />
                          {school.staff_count} Staff
                        </div>
                        <div className="flex items-center gap-1">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                          {school.student_count} Students
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(school.verification_status)}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          school.is_active 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <PowerIcon className="h-3 w-3" />
                          {school.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(school.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedSchool(school);
                          setShowDetailModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View Details
                      </button>
                      {school.verification_status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(school.id)}
                            disabled={approveMutation.isPending}
                            className="text-green-600 hover:text-green-900 mr-2 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSchool(school);
                              setShowDetailModal(true);
                            }}
                            disabled={rejectMutation.isPending}
                            className="text-red-600 hover:text-red-900 mr-2 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {school.verification_status !== 'PENDING' && (
                        <button
                          onClick={() => handleToggleActive(school)}
                          disabled={toggleActiveMutation.isPending}
                          className={`${
                            school.is_active 
                              ? 'text-gray-600 hover:text-gray-900' 
                              : 'text-blue-600 hover:text-blue-900'
                          } disabled:opacity-50`}
                        >
                          {school.is_active ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedSchool.name}</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setRejectionReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-2">{getStatusBadge(selectedSchool.verification_status)}</div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedSchool.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedSchool.phone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{selectedSchool.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Registration Information</h3>
                  <button
                    onClick={() => toggleVerificationMutation.mutate(selectedSchool.id)}
                    disabled={toggleVerificationMutation.isPending || selectedSchool.cipc_verified}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSchool.cipc_verified
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {toggleVerificationMutation.isPending ? (
                      'Verifying...'
                    ) : selectedSchool.cipc_verified ? (
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4" />
                        CIPC Verified
                      </span>
                    ) : (
                      'Mark as CIPC Verified'
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-500">CIPC Registration</label>
                    <p className="text-gray-900 font-mono">{selectedSchool.company_registration_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">EMIS Number</label>
                    <p className="text-gray-900 font-mono">{selectedSchool.emis_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CIPC Verification Status</label>
                    <p className={`font-semibold ${selectedSchool.cipc_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedSchool.cipc_verified ? '✓ Verified' : 'Not Verified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verification Date</label>
                    <p className="text-gray-900">{formatDate(selectedSchool.cipc_verification_date)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-gray-900">{formatDate(selectedSchool.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tier</label>
                    <p className="text-gray-900">{selectedSchool.subscription_tier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-gray-900">{selectedSchool.subscription_status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trial</label>
                    <p className="text-gray-900">{selectedSchool.is_trial ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Admin User */}
              {selectedSchool.admin_user && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Administrator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedSchool.admin_user.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedSchool.admin_user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900">{selectedSchool.admin_user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* School Status - Show for non-pending schools */}
              {selectedSchool.verification_status !== 'PENDING' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">School Status</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Access Status</label>
                        <p className={`text-lg font-semibold ${selectedSchool.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                          {selectedSchool.is_active ? '✓ Active - School has full access' : '✗ Disabled - School access is blocked'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedSchool.is_active 
                            ? 'Users can login and access all features' 
                            : 'Users cannot login or access any features'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleActive(selectedSchool)}
                        disabled={toggleActiveMutation.isPending}
                        className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          selectedSchool.is_active
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {toggleActiveMutation.isPending ? (
                          'Processing...'
                        ) : selectedSchool.is_active ? (
                          <span className="flex items-center gap-2">
                            <PowerIcon className="h-5 w-5" />
                            Disable School
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <PowerIcon className="h-5 w-5" />
                            Enable School
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedSchool.verification_status === 'PENDING' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Actions</h3>
                  
                  {/* Approval */}
                  <div className="mb-4">
                    <button
                      onClick={() => handleApprove(selectedSchool.id)}
                      disabled={approveMutation.isPending}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve School'}
                    </button>
                  </div>

                  {/* Rejection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (Required)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Provide a reason for rejection..."
                    />
                    <button
                      onClick={() => handleReject(selectedSchool.id)}
                      disabled={rejectMutation.isPending || !rejectionReason.trim()}
                      className="mt-2 w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {rejectMutation.isPending ? 'Rejecting...' : 'Reject School'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
