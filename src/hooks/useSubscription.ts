import { useAuthStore } from '../store/authStore'

export const useSubscription = () => {
  const { user } = useAuthStore()
  const school = user?.school

  const isActive = school?.is_active && new Date(school.subscription_end) >= new Date()
  
  const isPackageBased = school?.subscription_type === 'PACKAGE'
  const isProductBased = school?.subscription_type === 'PRODUCT'
  
  const canAddStudent = () => {
    if (!school || !isActive) return false
    
    // For product-based, would need to check features from API
    // For package-based, check limits
    return school.max_students === -1 || true // Will be checked on backend
  }
  
  const canAddStaff = () => {
    if (!school || !isActive) return false
    return school.max_staff === -1 || true // Will be checked on backend
  }
  
  const hasFeature = (featureName: string): boolean => {
    if (!school || !isActive) return false
    
    if (isProductBased) {
      // For product-based, check would come from API
      return true // Implement based on API response
    }
    
    // Package-based feature matrix
    const tierFeatures: Record<string, string[]> = {
      STARTER: [
        'student_management',
        'basic_reporting',
        'payment_tracking',
        'email_support',
      ],
      PROFESSIONAL: [
        'student_management',
        'staff_management',
        'advanced_reporting',
        'payment_tracking',
        'parent_portal',
        'sms_notifications',
        'analytics',
        'priority_support',
      ],
      ENTERPRISE: [
        'student_management',
        'staff_management',
        'advanced_reporting',
        'payment_tracking',
        'parent_portal',
        'sms_notifications',
        'analytics',
        'custom_branding',
        'api_access',
        'dedicated_support',
      ],
    }
    
    const features = tierFeatures[school.subscription_tier] || []
    return features.includes(featureName)
  }
  
  const getUpgradeMessage = (feature: string) => {
    if (!school) return 'Please subscribe to access this feature'
    
    if (isProductBased) {
      return `This feature is not enabled for your account. Contact support to add ${feature}.`
    }
    
    return `Upgrade to Professional or Enterprise to access ${feature}`
  }
  
  const daysUntilExpiry = school?.days_until_expiry || 0
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 7
  
  return {
    school,
    isActive,
    isPackageBased,
    isProductBased,
    canAddStudent,
    canAddStaff,
    hasFeature,
    getUpgradeMessage,
    daysUntilExpiry,
    isExpiringSoon,
    tier: school?.subscription_tier,
    isStarter: school?.subscription_tier === 'STARTER',
    isProfessional: school?.subscription_tier === 'PROFESSIONAL',
    isEnterprise: school?.subscription_tier === 'ENTERPRISE',
  }
}
