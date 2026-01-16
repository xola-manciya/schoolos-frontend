/**
 * Google Analytics tracking utilities
 * 
 * Usage:
 * import { trackEvent, trackPageView } from '@/lib/analytics'
 * 
 * trackEvent('button_click', { button_name: 'Get Started' })
 * trackPageView('/pricing')
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

/**
 * Track custom events in Google Analytics
 * @param eventName - Name of the event (e.g., 'sign_up', 'purchase')
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * Track page views manually (useful for SPAs)
 * @param path - The page path (e.g., '/pricing')
 */
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-P888X4E800', {
      page_path: path,
    })
  }
}

/**
 * Track button clicks
 * @param buttonName - Name/label of the button clicked
 */
export const trackButtonClick = (buttonName: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
  })
}

/**
 * Track form submissions
 * @param formName - Name of the form submitted
 */
export const trackFormSubmit = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
  })
}

/**
 * Track sign ups
 * @param method - Sign up method (e.g., 'email', 'google')
 */
export const trackSignUp = (method: string = 'email') => {
  trackEvent('sign_up', {
    method,
  })
}

/**
 * Track logins
 * @param method - Login method
 */
export const trackLogin = (method: string = 'email') => {
  trackEvent('login', {
    method,
  })
}

/**
 * Track purchases/subscriptions
 * @param value - Transaction value
 * @param currency - Currency code (default: ZAR)
 * @param planName - Name of the plan purchased
 */
export const trackPurchase = (value: number, currency: string = 'ZAR', planName?: string) => {
  trackEvent('purchase', {
    value,
    currency,
    plan_name: planName,
  })
}

/**
 * Track when user starts trial
 * @param planName - Name of the trial plan
 */
export const trackTrialStart = (planName: string) => {
  trackEvent('trial_start', {
    plan_name: planName,
  })
}
