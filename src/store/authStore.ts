import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  fetchUser: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/token/', { email, password })
        const { access, refresh } = response.data

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // Fetch user details
        const userResponse = await api.get('/staff/users/me/')
        const user = userResponse.data
        set({ user, isAuthenticated: true })
        
        // Check if user needs to complete school registration
        if (user.needs_school_setup && !user.is_platform_admin) {
          // This will be handled by ProtectedRoute redirect
          return user
        }
        
        return user
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth-storage')
        set({ user: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        try {
          const response = await api.get('/staff/users/me/')
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          // Clear all auth data on fetch failure
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('auth-storage')
          set({ user: null, isAuthenticated: false })
        }
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
