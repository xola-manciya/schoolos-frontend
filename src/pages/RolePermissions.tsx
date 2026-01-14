import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  ChartBarIcon, 
  UserPlusIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface PermissionItem {
  action: string;
  icon: React.ReactNode;
  principal: boolean;
  admin: boolean;
  accountant: boolean;
  teacher: boolean | string;
  support: boolean;
}

const permissions: PermissionItem[] = [
  {
    action: 'View Students',
    icon: <UserGroupIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: 'Own classes only',
    support: true,
  },
  {
    action: 'Add/Edit Students',
    icon: <UserPlusIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'Delete Students',
    icon: <XMarkIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'View Payments',
    icon: <CurrencyDollarIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: true,
    support: false,
  },
  {
    action: 'Add/Edit Payments',
    icon: <CurrencyDollarIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: false,
    support: false,
  },
  {
    action: 'Verify Payments',
    icon: <CheckIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: false,
    support: false,
  },
  {
    action: 'Process Bank Statements',
    icon: <DocumentTextIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: false,
    support: false,
  },
  {
    action: 'Manage Staff',
    icon: <UserGroupIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'View Staff Details',
    icon: <UserGroupIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: 'Own profile only',
    support: false,
  },
  {
    action: 'Approve Leave',
    icon: <CheckIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'View Reports',
    icon: <ChartBarIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: true,
    teacher: false,
    support: false,
  },
  {
    action: 'Export Data',
    icon: <ArrowDownTrayIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'Manage Classes',
    icon: <UserGroupIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: false,
    support: false,
  },
  {
    action: 'Manage Announcements',
    icon: <DocumentTextIcon className="h-4 w-4" />,
    principal: true,
    admin: true,
    accountant: false,
    teacher: 'Read only',
    support: false,
  },
];

const RolePermissions = () => {
  const renderPermissionCell = (value: boolean | string) => {
    if (typeof value === 'string') {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {value}
          </span>
        </td>
      );
    }

    return (
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {value ? (
          <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
        ) : (
          <XMarkIcon className="h-5 w-5 text-red-400 mx-auto" />
        )}
      </td>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
              <p className="mt-1 text-sm text-gray-500">
                View what each role can do in the system
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Principal</h3>
            </div>
            <p className="text-xs text-purple-700 mt-1">Full system access</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Admin</h3>
            </div>
            <p className="text-xs text-blue-700 mt-1">Manage operations</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Accountant</h3>
            </div>
            <p className="text-xs text-green-700 mt-1">Financial management</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Teacher</h3>
            </div>
            <p className="text-xs text-yellow-700 mt-1">Limited to classes</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Support</h3>
            </div>
            <p className="text-xs text-gray-700 mt-1">View only</p>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Permission
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Principal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Admin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Accountant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Support
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{permission.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {permission.action}
                        </span>
                      </div>
                    </td>
                    {renderPermissionCell(permission.principal)}
                    {renderPermissionCell(permission.admin)}
                    {renderPermissionCell(permission.accountant)}
                    {renderPermissionCell(permission.teacher)}
                    {renderPermissionCell(permission.support)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Security Note</h3>
              <p className="text-xs text-blue-800 mt-1">
                All permissions are enforced at both the backend API level and frontend UI level. 
                Users from different schools cannot access each other's data due to multi-tenant isolation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
