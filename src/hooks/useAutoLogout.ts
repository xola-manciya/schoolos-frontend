import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Hook to automatically logout user after a period of inactivity
 * @param timeoutMinutes - Minutes of inactivity before auto-logout (default: 30)
 */
export const useAutoLogout = (timeoutMinutes: number = 30) => {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const timeoutRef = useRef<number | null>(null)
  const timeoutMs = timeoutMinutes * 60 * 1000

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only set timeout if user is authenticated
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logout()
        navigate('/login', { 
          replace: true,
          state: { message: 'You have been logged out due to inactivity' }
        })
      }, timeoutMs)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Reset timer on any activity
    events.forEach(event => {
      document.addEventListener(event, resetTimer)
    })

    // Initialize timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isAuthenticated, timeoutMs])
}
