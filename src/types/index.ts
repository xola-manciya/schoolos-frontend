export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: 'PRINCIPAL' | 'ADMIN' | 'HOD' | 'TEACHER' | 'CLERK' | 'ACCOUNTANT' | 'SUPPORT' | 'PAYMENT_PROCESSOR'
  phone_number?: string
  phone?: string
  school?: School
  is_trial?: boolean
  is_platform_admin?: boolean
  email_verified?: boolean
}

export interface School {
  id: number
  name: string
  registration_number?: string
  company_registration_number?: string
  emis_number?: string
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  cipc_verified: boolean
  cipc_verification_date?: string
  email: string
  phone?: string
  address?: string
  subscription_type: 'PACKAGE' | 'PRODUCT'
  subscription_tier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  subscription_start: string
  subscription_end: string
  is_trial: boolean
  is_active: boolean
  max_students: number
  max_staff: number
  storage_gb: number
  payment_months_per_year: number
  payment_start_month: number
  days_until_expiry?: number
  created_at: string
}

export interface SubscriptionLimits {
  students: {
    current: number
    max: number
    canAdd: boolean
  }
  staff: {
    current: number
    max: number
    canAdd: boolean
  }
  storage: {
    used_gb: number
    max_gb: number
  }
}

export interface ProductFeature {
  id: number
  feature_name: string
  is_active: boolean
  price_per_month: number
}

export interface Student {
  id: number
  student_id: string
  first_name: string
  last_name: string
  full_name: string
  id_number: string
  date_of_birth: string
  gender: 'M' | 'F' | 'O'
  email?: string
  phone_number?: string
  address: string
  parent_name: string
  parent_phone: string
  parent_email: string
  parent_id_number?: string
  enrollment_date?: string
  class_enrolled?: number
  class_name?: string
  payment_status: 'PAID' | 'PENDING' | 'PARTIAL' | 'OVERDUE'
  total_fees: number
  amount_paid: number
  expected_monthly_payment: number
  balance_due: number
  months_paid: number
  is_active: boolean
}

export interface Payment {
  id: number
  student?: number
  student_name?: string
  student_id?: string
  amount: number
  payment_date: string
  payment_month?: number
  payment_year?: number
  payment_method: 'BANK_TRANSFER' | 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'CHEQUE' | 'MANUAL'
  reference_number: string
  match_type: 'STUDENT_ID' | 'NAME_MATCH' | 'FUZZY_MATCH' | 'REFERENCE' | 'MANUAL'
  match_confidence: number
  status: 'PENDING' | 'VERIFIED' | 'REVERSED'
  bank_statement_file?: string
  bank_statement_filename?: string
}

export interface StaffProfile {
  id: number
  user: User
  employee_id: string
  position: string
  department: string
  annual_leave_balance: number
  sick_leave_balance: number
}

export interface Leave {
  id: number
  staff: number
  staff_name: string
  leave_type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'STUDY'
  start_date: string
  end_date: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  days_requested: number
}

export interface Class {
  id: number
  name: string
  grade_level: number
  section: string
  class_teacher?: number
  teacher_name?: string
  max_capacity: number
  current_enrollment: number
  available_slots: number
  academic_year: string
  is_active: boolean
}

export interface Announcement {
  id: number
  title: string
  content: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  target_audience: 'ALL' | 'STUDENTS' | 'STAFF' | 'PARENTS' | 'SPECIFIC_CLASS'
  publish_date: string
  expiry_date?: string
  is_active: boolean
}
