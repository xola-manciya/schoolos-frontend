import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { StaffProfile, Leave } from '../types'
import { ExportButton } from '../components/ExportButton'

type LeaveFilter = 'all' | 'on-leave' | 'active'

export default function Staff() {
  const [filter, setFilter] = useState<LeaveFilter>('all')

  const { data: staffList, isLoading: staffLoading } = useQuery<StaffProfile[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await api.get('/staff/')
      return response.data.results || response.data
    },
  })

  const { data: leaves } = useQuery<Leave[]>({
    queryKey: ['leaves'],
    queryFn: async () => {
      const response = await api.get('/staff/leaves/')
      return response.data.results || response.data
    },
  })

  // Get active leaves for filtering
  const activeLeaves = leaves?.filter(
    leave => leave.status === 'APPROVED' && 
    new Date(leave.start_date) <= new Date() && 
    new Date(leave.end_date) >= new Date()
  ) || []

  const staffOnLeaveIds = new Set(activeLeaves.map(leave => leave.staff))

  const filteredStaff = staffList?.filter(staff => {
    if (filter === 'on-leave') return staffOnLeaveIds.has(staff.id)
    if (filter === 'active') return !staffOnLeaveIds.has(staff.id)
    return true
  }) || []

  const getStaffLeave = (staffId: number) => {
    return activeLeaves.find(leave => leave.staff === staffId)
  }

  if (staffLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Staff Management</h1>
        <div className="flex gap-2">
          <ExportButton 
            data={filteredStaff || []} 
            filename="staff" 
          />
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 sm:text-base">
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
          All ({staffList?.length || 0})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium sm:flex-none sm:px-4 sm:text-sm ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Active ({(staffList?.length || 0) - staffOnLeaveIds.size})
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
    </div>
  )
}
