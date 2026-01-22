import axios from 'axios'

// API Configuration
const API_VERSION = 'v1'
// Use environment variable for production, fallback to direct backend URL for development
const BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/${API_VERSION}`
  : `http://localhost:8000/api/${API_VERSION}`

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Check for trial expiration warning headers
    const trialExpired = response.headers['x-trial-expired']
    const graceDaysRemaining = response.headers['x-grace-days-remaining']
    
    if (trialExpired === 'true' && graceDaysRemaining) {
      // Store trial warning in session storage for UI to display
      sessionStorage.setItem('trial_expired', 'true')
      sessionStorage.setItem('grace_days_remaining', graceDaysRemaining)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Check for trial expiration (403 with expired flag)
    if (error.response?.status === 403 && error.response?.data?.expired) {
      // Clear tokens and redirect to billing page
      localStorage.setItem('subscription_expired', 'true')
      window.location.href = '/app/billing'
      return Promise.reject(error)
    }

    // Don't try to refresh tokens for auth endpoints (login/register)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/') && 
                           (originalRequest.url?.includes('/login') || 
                            originalRequest.url?.includes('/registration'))

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Clear all auth data on refresh failure
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Export both the configured axios instance and the base URL for convenience
export { BASE_URL, API_VERSION }
export default api
