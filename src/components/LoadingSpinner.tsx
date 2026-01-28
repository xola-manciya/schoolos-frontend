interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'lg', 
  message, 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center py-12'

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
        
        {/* Animated gradient spinner */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-400 animate-spin`}></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

// Inline loading spinner for buttons
export function ButtonSpinner() {
  return (
    <svg 
      className="animate-spin h-5 w-5 text-white inline-block" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
