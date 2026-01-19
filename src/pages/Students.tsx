import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { Student } from '../types'
import toast from 'react-hot-toast'
import { ExportButton } from '../components/ExportButton'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type StudentForm = {
  student_id: string
  first_name: string
  last_name: string
  id_number: string
  date_of_birth: string
  gender: 'M' | 'F' | 'O'
  email?: string
  phone_number?: string
  address: string
  parent_name: string
  parent_phone: string
  parent_email: string
  parent_id_number: string
  enrollment_date: string
  total_fees: number
}

type PaginatedResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Student[]
}

export default function Students() {
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [uploadMode, setUploadMode] = useState<'single' | 'excel'>('single')
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue } = useForm<StudentForm>()

  const { data: paginatedData, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ['students', currentPage, pageSize],
    queryFn: async () => {
      const response = await api.get(`/students/?page=${currentPage}&page_size=${pageSize}`)
      return response.data
    },
  })

  const students = paginatedData?.results || []
  const totalPages = paginatedData ? Math.ceil(paginatedData.count / pageSize) : 1

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentForm) => {
      if (editingStudent) {
        await api.patch(`/students/${editingStudent.id}/`, data)
      } else {
        await api.post('/students/', data)
      }
    },
    onSuccess: () => {
      toast.success(editingStudent ? 'Student updated successfully!' : 'Student added successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      reset()
      setEditingStudent(null)
      setShowModal(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || `Failed to ${editingStudent ? 'update' : 'add'} student`)
    },
  })

  const uploadExcelMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/students/bulk-upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data.created_count} students!`)
      if (data.errors?.length > 0) {
        toast.error(`${data.errors.length} students failed to import`)
      }
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setExcelFile(null)
      setShowModal(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to upload Excel file')
    },
  })

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: number) => {
      await api.delete(`/students/${studentId}/`)
    },
    onSuccess: () => {
      toast.success('Student deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete student')
    },
  })

  // Payment mutation - commented out as it's not currently used
  // const markPaymentMutation = useMutation({
  //   mutationFn: async ({ studentId, amount }: { studentId: number; amount: number }) => {
  //     await api.post('/payments/', {
  //       student: studentId,
  //       amount: amount,
  //       payment_method: 'CASH',
  //       payment_date: new Date().toISOString().split('T')[0],
  //       status: 'VERIFIED',
  //     })
  //   },
  //   onSuccess: () => {
  //     toast.success('Payment recorded successfully!')
  //     queryClient.invalidateQueries({ queryKey: ['students'] })
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.response?.data?.error || 'Failed to record payment')
  //   },
  // })

  const onSubmit = (data: StudentForm) => {
    createStudentMutation.mutate(data)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setValue('student_id', student.student_id)
    setValue('first_name', student.first_name)
    setValue('last_name', student.last_name)
    setValue('id_number', student.id_number || '')
    setValue('date_of_birth', student.date_of_birth || '')
    setValue('gender', student.gender)
    setValue('email', student.email || '')
    setValue('phone_number', student.phone_number || '')
    setValue('address', student.address || '')
    setValue('parent_name', student.parent_name || '')
    setValue('parent_phone', student.parent_phone || '')
    setValue('parent_email', student.parent_email || '')
    setValue('parent_id_number', student.parent_id_number || '')
    setValue('enrollment_date', student.enrollment_date || '')
    setValue('total_fees', student.total_fees || 0)
    setShowModal(true)
  }

  const handleDelete = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete ${student.full_name}? This action cannot be undone.`)) {
      deleteStudentMutation.mutate(student.id)
    }
  }

  const handleExcelUpload = () => {
    if (excelFile) {
      uploadExcelMutation.mutate(excelFile)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Students</h1>
        <div className="flex gap-2">
          <ExportButton endpoint="/students/export/" />
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 sm:text-base"
          >
            Add Student(s)
          </button>
        </div>
      </div>

      {students && students.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="block space-y-4 lg:hidden">
            {students.map((student) => (
              <div key={student.id} className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{student.full_name}</p>
                    <p className="text-sm text-gray-500">{student.student_id}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      student.payment_status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : student.payment_status === 'PARTIAL'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.payment_status}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID Number:</span>
                    <span className="text-gray-900">{student.id_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance Due:</span>
                    <span className="font-semibold text-gray-900">R {student.balance_due.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-lg bg-white shadow lg:block">
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
                      ID Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Payment Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Balance Due
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {student.student_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {student.full_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {student.id_number}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            student.payment_status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : student.payment_status === 'PARTIAL'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.payment_status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        R {student.balance_due.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {paginatedData && paginatedData.count > pageSize && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, paginatedData.count)}
                      </span>{' '}
                      of <span className="font-medium">{paginatedData.count}</span> students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <span className="relative inline-flex items-center border-x-0 border-y border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              Add Student
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              {editingStudent ? 'Edit Student' : 'Add Student(s)'}
            </h2>

            {/* Mode Selector - Only show for adding new students */}
            {!editingStudent && (
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setUploadMode('single')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium sm:px-4 ${
                    uploadMode === 'single'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Single Student
                </button>
                <button
                  onClick={() => setUploadMode('excel')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium sm:px-4 ${
                    uploadMode === 'excel'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Excel Upload
                </button>
              </div>
            )}

            {uploadMode === 'excel' ? (
              /* Excel Upload Mode */
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-900">Excel Format Requirements:</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
                    <li>Columns: student_id, first_name, last_name, id_number, date_of_birth, gender, address</li>
                    <li>Additional: parent_name, parent_phone, parent_email, parent_id_number, enrollment_date, total_fees</li>
                    <li>Date format: YYYY-MM-DD</li>
                    <li>Gender: M, F, or O</li>
                  </ul>
                </div>

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setExcelFile(null)
                    }}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExcelUpload}
                    disabled={!excelFile || uploadExcelMutation.isPending}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {uploadExcelMutation.isPending ? 'Uploading...' : 'Upload & Import'}
                  </button>
                </div>
              </div>
            ) : (
              /* Single Student Form */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <input
                      {...register('student_id', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number</label>
                    <input
                      {...register('id_number', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      {...register('first_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      {...register('last_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      {...register('date_of_birth', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      {...register('gender', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      {...register('address', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                    <input
                      {...register('parent_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    <input
                      {...register('parent_phone', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <input
                      type="email"
                      {...register('parent_email', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent ID Number</label>
                    <input
                      {...register('parent_id_number', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                    <input
                      type="date"
                      {...register('enrollment_date', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Fees (R)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('total_fees', { required: true, valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingStudent(null)
                      reset()
                    }}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createStudentMutation.isPending}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createStudentMutation.isPending 
                      ? (editingStudent ? 'Updating...' : 'Adding...') 
                      : (editingStudent ? 'Update Student' : 'Add Student')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
