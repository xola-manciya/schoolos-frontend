import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import {
  UserGroupIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats-v4'],  // v4: Force complete refresh for negative balance fix
    queryFn: async () => {
      // Filter by current year to match Students and Payments page behavior
      const currentYear = new Date().getFullYear()
      const [studentsRes, paymentsRes, registrationRes] = await Promise.all([
        api.get(`/students/payment_summary/?year=${currentYear}`),
        api.get('/payments/list/statistics/'),
        api.get(`/students/registration_summary/?year=${currentYear}`),
      ])
      return {
        students: studentsRes.data.summary,
        payments: paymentsRes.data,
        registration: registrationRes.data.summary,
      }
    },
    staleTime: 0,  // Always fetch fresh data
    gcTime: 0,  // Don't cache at all
    refetchOnMount: true,  // Always refetch when component mounts
  })

  const statCards = [
    {
      name: 'Total Students',
      value: stats?.students?.total_students || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Fees Expected',
      value: `R ${stats?.students?.total_expected?.toLocaleString() || 0}`,
      icon: BanknotesIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Collected',
      value: `R ${stats?.students?.total_collected?.toLocaleString() || 0}`,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
    },
    {
      name: 'Outstanding',
      value: `R ${stats?.students?.total_outstanding?.toLocaleString() || 0}`,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
  ]

  const registrationStats = [
    {
      name: 'Registration Fees Expected',
      value: `R ${stats?.registration?.total_expected?.toLocaleString() || 0}`,
      description: `${stats?.registration?.students_with_fee || 0} students`,
    },
    {
      name: 'Registration Fees Collected',
      value: `R ${stats?.registration?.total_collected?.toLocaleString() || 0}`,
      description: `${stats?.registration?.students_paid || 0} paid`,
    },
    {
      name: 'Registration Fees Outstanding',
      value: `R ${stats?.registration?.total_outstanding?.toLocaleString() || 0}`,
      description: `${stats?.registration?.students_unpaid || 0} pending`,
    },
  ]

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Fee Summary */}
      {stats?.registration && stats.registration.students_with_fee > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Fee Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {registrationStats.map((stat) => (
              <div key={stat.name} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Pending Actions</h2>
          <p className="text-gray-500">No pending actions</p>
        </div>
      </div>
    </div>
  )
}
