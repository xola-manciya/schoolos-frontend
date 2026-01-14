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
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [studentsRes, paymentsRes] = await Promise.all([
        api.get('/students/payment_summary/'),
        api.get('/payments/statistics/'),
      ])
      return {
        students: studentsRes.data.summary,
        payments: paymentsRes.data,
      }
    },
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
