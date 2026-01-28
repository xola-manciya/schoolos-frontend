import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { Student } from '../types'
import toast from 'react-hot-toast'
import { sanitizeText, sanitizeEmail, sanitizePhone } from '../lib/sanitize'
import { ExportButton } from '../components/ExportButton'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { useDebounce } from '../hooks/useDebounce'
import { useAuthStore } from '../store/authStore'

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
  class_enrolled?: number
  grade?: string
  enrollment_date: string
  total_fees: number
  expected_monthly_payment: number
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
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<Student | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [existingStudent, setExistingStudent] = useState<{ exists: boolean; student?: Student } | null>(null)
  const [checkingId, setCheckingId] = useState(false)
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [orderBy, setOrderBy] = useState<string>('student_id')
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString())
  const debouncedSearch = useDebounce(searchQuery, 500)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, setValue } = useForm<StudentForm>()

  // Parse South African ID number to extract date of birth
  const parseIdNumber = (idNumber: string) => {
    if (idNumber.length !== 13) return null
    
    const year = idNumber.substring(0, 2)
    const month = idNumber.substring(2, 4)
    const day = idNumber.substring(4, 6)
    
    // Determine century (assuming cutoff at year 30)
    const centuryPrefix = parseInt(year) <= 30 ? '20' : '19'
    const fullYear = centuryPrefix + year
    
    // Validate date components
    const monthNum = parseInt(month)
    const dayNum = parseInt(day)
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return null
    }
    
    return `${fullYear}-${month}-${day}`
  }

  const handleIdNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const idNumber = e.target.value
    
    // Clear existing student check if ID is incomplete
    if (idNumber.length < 13) {
      setExistingStudent(null)
    }
    
    if (idNumber.length === 13) {
      const dob = parseIdNumber(idNumber)
      if (dob) {
        setValue('date_of_birth', dob)
      }
      
      // Check if student with this ID already exists (only when adding new student)
      if (!editingStudent) {
        setCheckingId(true)
        try {
          const response = await api.get(`/students/?id_number=${idNumber}`)
          if (response.data.results && response.data.results.length > 0) {
            setExistingStudent({ exists: true, student: response.data.results[0] })
          } else {
            setExistingStudent({ exists: false })
          }
        } catch (error) {
          console.error('Error checking student ID:', error)
          setExistingStudent(null)
        } finally {
          setCheckingId(false)
        }
      }
    }
  }

  const { data: paginatedData, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ['students', currentPage, pageSize, debouncedSearch, orderBy, orderDirection, yearFilter],
    queryFn: async () => {
      const ordering = orderDirection === 'desc' ? `-${orderBy}` : orderBy
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        ordering,
      })
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }
      if (yearFilter) {
        params.append('year', yearFilter)
      }
      const response = await api.get(`/students/?${params.toString()}`)
      return response.data
    },
  })

  const students = paginatedData?.results || []
  const totalPages = paginatedData ? Math.ceil(paginatedData.count / pageSize) : 1

  // Fetch individual student data when editing
  useEffect(() => {
    const fetchStudentData = async () => {
      if (editingStudent && showModal) {
        setIsFormLoading(true)
        setExistingStudent(null) // Clear existing student check
        try {
          const response = await api.get(`/students/${editingStudent.id}/`)
          const student = response.data
          
          reset({
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            id_number: student.id_number || '',
            date_of_birth: student.date_of_birth || '',
            gender: student.gender,
            email: student.email || '',
            phone_number: student.phone_number || '',
            address: student.address || '',
            parent_name: student.parent_name || '',
            parent_phone: student.parent_phone || '',
            parent_email: student.parent_email || '',
            parent_id_number: student.parent_id_number || '',
            enrollment_date: student.enrollment_date || '',
            total_fees: student.total_fees || 0,
            expected_monthly_payment: student.expected_monthly_payment || 0,
            grade: student.grade || '',
            class_enrolled: student.class_enrolled?.id
          })
        } catch (error) {
          console.error('Error fetching student data:', error)
          toast.error('Failed to load student data')
        } finally {
          setIsFormLoading(false)
        }
      } else if (!showModal) {
        setIsFormLoading(false)
        setExistingStudent(null) // Clear when modal closes
      }
    }

    fetchStudentData()
  }, [editingStudent, showModal, reset])

  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentForm) => {
      // Sanitize all inputs before sending to backend (defense in depth)
      const sanitizedData: any = {
        ...data,
        student_id: sanitizeText(data.student_id),
        first_name: sanitizeText(data.first_name),
        last_name: sanitizeText(data.last_name),
        email: data.email ? sanitizeEmail(data.email) : '',
        phone_number: data.phone_number ? sanitizePhone(data.phone_number) : '',
        address: data.address ? sanitizeText(data.address) : '',
        parent_name: sanitizeText(data.parent_name),
        parent_email: sanitizeEmail(data.parent_email),
        parent_phone: sanitizePhone(data.parent_phone),
        parent_id_number: data.parent_id_number ? sanitizeText(data.parent_id_number) : '',
      }
      
      if (editingStudent) {
        await api.patch(`/students/${editingStudent.id}/`, sanitizedData)
      } else {
        await api.post('/students/', sanitizedData)
      }
    },
    onSuccess: () => {
      toast.success(editingStudent ? 'Student updated successfully!' : 'Student added successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      reset()
      setEditingStudent(null)
      setShowModal(false)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: any } }
      const errorData = err.response?.data
      
      // Show specific field errors if available
      if (errorData && typeof errorData === 'object') {
        const fieldErrors = Object.entries(errorData)
          .filter(([key]) => key !== 'error' && key !== 'detail')
          .map(([field, messages]: [string, any]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages]
            return `${field}: ${msgArray.join(', ')}`
          })
        
        if (fieldErrors.length > 0) {
          toast.error(fieldErrors.join('\n'))
        } else {
          toast.error(errorData.error || errorData.detail || `Failed to ${editingStudent ? 'update' : 'add'} student`)
        }
      } else {
        toast.error(`Failed to ${editingStudent ? 'update' : 'add'} student`)
      }
      
      // Log full error for debugging
      console.error('Student creation error:', errorData)
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

  const archiveStudentMutation = useMutation({
    mutationFn: async ({ studentId, reason }: { studentId: number; reason: string }) => {
      await api.post(`/students/${studentId}/archive/`, { archive_reason: reason })
    },
    onSuccess: () => {
      toast.success('Student archived successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setArchiveConfirm(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to archive student')
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
    // Prevent submission if student with same ID already exists (only when adding new)
    if (!editingStudent && existingStudent?.exists) {
      toast.error('Cannot add student. A student with this ID number already exists in the school.')
      return
    }
    createStudentMutation.mutate(data)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setShowModal(true)
  }

  const handleDelete = (student: Student) => {
    setDeleteConfirm(student)
  }

  const handleArchive = (student: Student) => {
    setArchiveConfirm(student)
  }

  const handleExcelUpload = () => {
    if (excelFile) {
      uploadExcelMutation.mutate(excelFile)
    }
  }

  const handleSort = (field: string) => {
    if (orderBy === field) {
      // Toggle direction if same field
      setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setOrderBy(field)
      setOrderDirection('asc')
    }
    setCurrentPage(1) // Reset to first page on sort change
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (orderBy !== field) return null
    return orderDirection === 'asc' ? 
      <ChevronUpIcon className="ml-1 inline-block h-4 w-4" /> : 
      <ChevronDownIcon className="ml-1 inline-block h-4 w-4" />
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  if (isLoading) {
    return <LoadingSpinner message="Loading students..." />
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Students</h1>
        <div className="flex gap-2">
          <ExportButton 
            endpoint="/students/export/" 
            filters={{
              search: debouncedSearch,
              year: yearFilter,
              ordering: orderDirection === 'desc' ? `-${orderBy}` : orderBy
            }}
          />
          <button
            onClick={() => {
              reset()
              setEditingStudent(null)
              setShowModal(true)
            }}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 sm:text-base"
          >
            Add Student(s)
          </button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, ID, or ID number..."
            className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        >
          <option value="">All Years</option>
          {(() => {
            const currentYear = new Date().getFullYear()
            const schoolCreatedYear = user?.school?.created_at 
              ? new Date(user.school.created_at).getFullYear()
              : currentYear
            const years = []
            for (let year = currentYear; year >= schoolCreatedYear; year--) {
              years.push(year)
            }
            return years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))
          })()}
        </select>
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
                    <th 
                      scope="col" 
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                      onClick={() => handleSort('student_id')}
                    >
                      <div className="flex items-center">
                        Student ID
                        <SortIcon field="student_id" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                      onClick={() => handleSort('first_name')}
                    >
                      <div className="flex items-center">
                        Name
                        <SortIcon field="first_name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                      onClick={() => handleSort('id_number')}
                    >
                      <div className="flex items-center">
                        ID Number
                        <SortIcon field="id_number" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                      onClick={() => handleSort('payment_status')}
                    >
                      <div className="flex items-center">
                        Payment Status
                        <SortIcon field="payment_status" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
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
                            onClick={() => handleArchive(student)}
                            className="text-orange-600 hover:text-orange-800 font-medium mr-4"
                          >
                            Archive
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
              onClick={() => {
                reset()
                setEditingStudent(null)
                setShowModal(true)
              }}
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
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              {editingStudent ? 'Edit Student' : 'Add Student(s)'}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {editingStudent ? 'Update student information' : 'Add new students individually or upload via Excel'}
            </p>
            <p className="mb-4 text-sm text-gray-500">
              <span className="text-red-500">*</span> indicates required fields
            </p>

            {/* Existing Student Warning */}
            {existingStudent?.exists && existingStudent.student && (
              <div className="mb-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Student Already Exists
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        A student with ID number <strong>{existingStudent.student.id_number}</strong> already exists in the school:
                      </p>
                      <p className="mt-1">
                        <strong>{existingStudent.student.first_name} {existingStudent.student.last_name}</strong>
                        {existingStudent.student.grade && ` - Grade ${existingStudent.student.grade}`}
                      </p>
                      <p className="mt-2 text-xs">
                        Each student must have a unique ID number. Please verify the ID number or edit the existing student record.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkingId && (
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Checking if student exists...</span>
                </div>
              </div>
            )}

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
                      setEditingStudent(null)
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
                {isFormLoading ? (
                  <LoadingSpinner size="md" message="Loading student data..." />
                ) : (
                  <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number <span className="text-red-500">*</span></label>
                    <input
                      {...register('id_number', { 
                        required: true,
                        onChange: handleIdNumberChange
                      })}
                      placeholder="13-digit SA ID number"
                      maxLength={13}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input
                      {...register('first_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input
                      {...register('last_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      {...register('date_of_birth', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                    <select
                      {...register('gender', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade/Year</label>
                    <input
                      {...register('grade')}
                      placeholder="e.g., 8, 9, R"
                      maxLength={5}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                    <textarea
                      {...register('address', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name <span className="text-red-500">*</span></label>
                    <input
                      {...register('parent_name', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone <span className="text-red-500">*</span></label>
                    <input
                      {...register('parent_phone', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <input
                      type="email"
                      {...register('parent_email')}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent ID Number <span className="text-red-500">*</span></label>
                    <input
                      {...register('parent_id_number', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enrollment Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      {...register('enrollment_date', { required: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Fees (R) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('total_fees', { required: true, valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Monthly Payment (R) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('expected_monthly_payment', { required: true, valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                      placeholder="Expected payment per month"
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
                    disabled={createStudentMutation.isPending || (!editingStudent && existingStudent?.exists)}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!editingStudent && existingStudent?.exists ? 'Cannot add student with duplicate ID number' : ''}
                  >
                    {createStudentMutation.isPending 
                      ? (editingStudent ? 'Updating...' : 'Adding...') 
                      : (editingStudent ? 'Update Student' : 'Add Student')}
                  </button>
                </div>
                </>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Student</h3>
                <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete <span className="font-semibold">{deleteConfirm.full_name}</span>? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudentMutation.mutate(deleteConfirm.id)
                  setDeleteConfirm(null)
                }}
                disabled={deleteStudentMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      {archiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Archive Student</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Archive <span className="font-semibold">{archiveConfirm.full_name}</span>? 
                  This will mark the student as moved to another school. You can restore them later if needed.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setArchiveConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archiveStudentMutation.mutate({ 
                    studentId: archiveConfirm.id, 
                    reason: 'Moved to another school' 
                  })
                }}
                disabled={archiveStudentMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {archiveStudentMutation.isPending ? 'Archiving...' : 'Archive Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
