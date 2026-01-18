import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { BanknotesIcon, UserGroupIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline'

interface ClerkStats {
  total_students: number
  pending_payments: number
  todays_payments: number
  recent_payments: any[]
}

export default function ClerkDashboard() {
  const { data: stats } = useQuery<ClerkStats>({
    queryKey: ['clerk-stats'],
    queryFn: async () => {
      const [studentsRes, paymentsRes] = await Promise.all([
        api.get('/students/'),
        api.get('/payments/list/')
      ])
      
      const students = studentsRes.data.results || studentsRes.data
      const payments = paymentsRes.data.results || paymentsRes.data
      
      const today = new Date().toISOString().split('T')[0]
      const todaysPayments = payments.filter((p: any) => 
        p.payment_date?.startsWith(today)
      )
      
      return {
        total_students: students.length,
        pending_payments: students.filter((s: any) => s.payment_status !== 'PAID').length,
        todays_payments: todaysPayments.length,
        recent_payments: payments.slice(0, 10)
      }
    }
  })

  const statCards = [
    {
      name: 'Total Students',
      value: stats?.total_students || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending Payments',
      value: stats?.pending_payments || 0,
      icon: ClockIcon,
      color: 'bg-orange-500'
    },
    {
      name: "Today's Payments",
      value: stats?.todays_payments || 0,
      icon: DocumentTextIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Recent Payments',
      value: stats?.recent_payments?.length || 0,
      icon: BanknotesIcon,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Clerk Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Payment processing and student records
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 text-white rounded-lg p-1.5 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {stat.name}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Payments</h2>
          <div className="space-y-4">
            {stats?.recent_payments?.slice(0, 5).map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.student_name || `Student #${payment.student}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    R{payment.amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{payment.payment_method}</p>
                </div>
              </div>
            ))}
            {(!stats?.recent_payments || stats.recent_payments.length === 0) && (
              <p className="text-center text-sm text-gray-500">No recent payments</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/app/payments"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <BanknotesIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Process Payments</p>
                <p className="text-sm text-gray-500">Upload bank statements</p>
              </div>
            </a>
            
            <a
              href="/app/students"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">View Students</p>
                <p className="text-sm text-gray-500">Check payment status</p>
              </div>
            </a>
            
            <a
              href="/app/students"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Add Students</p>
                <p className="text-sm text-gray-500">Bulk or single entry</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">Daily Tasks</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">✓</span>
            <span>Upload and process bank statements daily</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">✓</span>
            <span>Verify payment matching accuracy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">✓</span>
            <span>Update student payment statuses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">✓</span>
            <span>Respond to parent payment inquiries</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
