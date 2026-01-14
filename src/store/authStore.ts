import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  mockLogin: (role: User['role']) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        const response = await api.post('/auth/token/', { username, password })
        const { access, refresh } = response.data

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        // Fetch user details
        const userResponse = await api.get('/staff/users/me/')
        set({ user: userResponse.data, isAuthenticated: true })
      },

      mockLogin: (role: User['role']) => {
        const mockUser: User = {
          id: 1,
          username: 'demo_user',
          email: 'demo@school.com',
          first_name: 'Demo',
          last_name: 'User',
          role: role,
          phone_number: '0123456789'
        }
        localStorage.setItem('access_token', 'mock_token_123')
        set({ user: mockUser, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        try {
          const response = await api.get('/staff/users/me/')
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
