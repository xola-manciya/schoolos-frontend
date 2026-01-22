import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { 
  BuildingOfficeIcon, 
  FlagIcon, 
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface PlatformStats {
  total_schools: number;
  pending_schools: number;
  approved_schools: number;
  rejected_schools: number;
  total_users: number;
  total_students: number;
  active_subscriptions: number;
}

export default function PlatformAdmin() {
  // Fetch platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      try {
        const [schoolsRes, usersRes] = await Promise.all([
          api.get('/general/schools/review/'),
          api.get('/staff/profiles/')
        ]);
        
        const schools = schoolsRes.data.results || schoolsRes.data || [];
        const users = usersRes.data.results || usersRes.data || [];
        
        interface School {
          verification_status?: string;
          student_count?: number;
          subscription_status?: string;
        }
        
        return {
          total_schools: schools.length,
          pending_schools: schools.filter((s: School) => s.verification_status === 'PENDING').length,
          approved_schools: schools.filter((s: School) => s.verification_status === 'APPROVED').length,
          rejected_schools: schools.filter((s: School) => s.verification_status === 'REJECTED').length,
          total_users: users.length,
          total_students: schools.reduce((sum: number, s: School) => sum + (s.student_count || 0), 0),
          active_subscriptions: schools.filter((s: School) => s.subscription_status === 'ACTIVE').length,
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          total_schools: 0,
          pending_schools: 0,
          approved_schools: 0,
          rejected_schools: 0,
          total_users: 0,
          total_students: 0,
          active_subscriptions: 0,
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading platform admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
        <p className="mt-2 text-gray-600">
          Overview and management of all schools and platform features
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Schools */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Schools</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_schools || 0}</p>
            </div>
            <BuildingOfficeIcon className="h-12 w-12 text-indigo-500 opacity-50" />
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pending_schools || 0}</p>
            </div>
            <ClockIcon className="h-12 w-12 text-yellow-500 opacity-50" />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_users || 0}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-green-500 opacity-50" />
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.active_subscriptions || 0}</p>
            </div>
            <CheckCircleIcon className="h-12 w-12 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* School Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">School Registration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Approved</span>
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">{stats?.approved_schools || 0}</p>
            <p className="text-xs text-green-600 mt-1">
              {stats?.total_schools ? Math.round((stats.approved_schools / stats.total_schools) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">Pending</span>
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-900">{stats?.pending_schools || 0}</p>
            <p className="text-xs text-yellow-600 mt-1">
              {stats?.total_schools ? Math.round((stats.pending_schools / stats.total_schools) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-800">Rejected</span>
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900">{stats?.rejected_schools || 0}</p>
            <p className="text-xs text-red-600 mt-1">
              {stats?.total_schools ? Math.round((stats.rejected_schools / stats.total_schools) * 100) : 0}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* School Review */}
        <Link
          to="/app/school-review"
          className="group bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
            </div>
            {stats?.pending_schools && stats.pending_schools > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {stats.pending_schools} pending
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">School Review</h3>
          <p className="text-sm text-gray-600 mb-4">
            Review and approve school registrations for CIPC compliance
          </p>
          <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
            Manage Schools
            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Feature Flags */}
        <div className="group bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FlagIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Flags</h3>
          <p className="text-sm text-gray-600 mb-4">
            Control feature visibility across all schools (scroll down)
          </p>
          <button
            onClick={() => {
              document.getElementById('feature-flags-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center text-green-600 text-sm font-medium hover:text-green-700"
          >
            View Below
            <ArrowRightIcon className="h-4 w-4 ml-2 rotate-90" />
          </button>
        </div>

        {/* All Schools List */}
        <Link
          to="/app/all-schools"
          className="group bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Schools</h3>
          <p className="text-sm text-gray-600 mb-4">
            View complete list of all registered schools and their details
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
            View All Schools
            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        {/* All Users List */}
        <Link
          to="/app/all-users"
          className="group bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:border-purple-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Users</h3>
          <p className="text-sm text-gray-600 mb-4">
            View complete list of all users across all schools on the platform
          </p>
          <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
            View All Users
            <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Feature Flags Section */}
      <div id="feature-flags-section" className="mt-12 pt-8 border-t-2 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Feature Flags</h2>
          <p className="mt-2 text-gray-600">
            Control which features are visible to all schools. Disabled features will be hidden from all users.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FlagIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Feature flags instantly affect all schools. Use caution when disabling features as it will hide them from all users except platform administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Feature flags will be loaded dynamically */}
        <div className="text-center py-8 text-gray-500">
          <p>Feature flag management coming soon...</p>
          <p className="text-sm mt-2">This section will allow you to enable/disable features platform-wide</p>
        </div>
      </div>
    </div>
  );
}
