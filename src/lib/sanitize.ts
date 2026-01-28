/**
 * Input Sanitization Utilities
 * 
 * Provides safe sanitization functions for user inputs before sending to backend
 * Prevents XSS attacks and malicious input injection
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize plain text input - removes ALL HTML tags
 * Use for: Names, addresses, phone numbers, etc.
 */
export const sanitizeText = (input: string | undefined | null): string => {
  if (!input) return ''
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim()
}

/**
 * Sanitize HTML content - allows only safe HTML tags
 * Use for: Rich text editors, formatted content
 */
export const sanitizeHTML = (input: string | undefined | null): string => {
  if (!input) return ''
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

/**
 * Sanitize and normalize email addresses
 * Use for: Email inputs
 */
export const sanitizeEmail = (email: string | undefined | null): string => {
  if (!email) return ''
  return email.trim().toLowerCase()
}

/**
 * Sanitize phone number - keeps only digits and + symbol
 * Use for: Phone number inputs
 */
export const sanitizePhone = (phone: string | undefined | null): string => {
  if (!phone) return ''
  return phone.replace(/[^\d+]/g, '').trim()
}

/**
 * Sanitize numeric input - ensures valid number
 * Use for: Amounts, quantities, IDs
 */
export const sanitizeNumber = (input: string | number | undefined | null): number => {
  if (input === null || input === undefined || input === '') return 0
  const num = typeof input === 'string' ? parseFloat(input) : input
  return isNaN(num) ? 0 : num
}

/**
 * Sanitize form data object - applies appropriate sanitization to each field
 * Use for: Entire form submissions
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Apply text sanitization by default
      (sanitized as any)[key] = sanitizeText(value)
    } else if (typeof value === 'number') {
      (sanitized as any)[key] = value
    } else if (typeof value === 'boolean') {
      (sanitized as any)[key] = value
    } else if (value === null || value === undefined) {
      (sanitized as any)[key] = value
    } else if (Array.isArray(value)) {
      // Recursively sanitize array items
      (sanitized as any)[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : item
      )
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      (sanitized as any)[key] = sanitizeFormData(value)
    } else {
      (sanitized as any)[key] = value
    }
  }
  
  return sanitized
}

/**
 * Validate and sanitize file upload
 * Use for: File inputs before upload
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[], 
  maxSizeMB: number = 10
): { valid: boolean; error?: string } => {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    }
  }
  
  // Check file type
  const fileType = file.type
  if (!allowedTypes.includes(fileType)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    }
  }
  
  // Sanitize filename (remove path traversal attempts)
  const sanitizedName = file.name.replace(/[\/\\]/g, '_')
  if (sanitizedName !== file.name) {
    return {
      valid: false,
      error: 'Invalid filename'
    }
  }
  
  return { valid: true }
}
