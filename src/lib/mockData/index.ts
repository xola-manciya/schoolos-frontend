// Export all mock data from a central location
export { mockStudents } from './students'
export { mockStaff } from './staff'
export { mockPayments } from './payments'
export { mockClasses } from './classes'
export { mockAnnouncements } from './announcements'

// Mock API delay helper
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock API response wrapper
export const mockApiResponse = <T>(data: T, delay: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

// Mock error response
export const mockApiError = (message: string, delay: number = 500): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay)
  })
}
