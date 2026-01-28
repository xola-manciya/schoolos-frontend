import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface EnabledFeatures {
  enabled_features: string[];
}

export function useFeatureFlags() {
  const { data, isLoading, isError } = useQuery<EnabledFeatures>({
    queryKey: ['enabled-features'],
    queryFn: async () => {
      const response = await api.get('/general/feature-flags/active/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: true,
    retry: false, // Don't retry on failure
  });

  const isFeatureEnabled = (featureKey: string) => {
    // If query failed or still loading, disable all features by default for safety
    if (isError || isLoading || !data) {
      return false;
    }
    return data?.enabled_features?.includes(featureKey) ?? false;
  };

  return {
    enabledFeatures: data?.enabled_features || [],
    isFeatureEnabled,
    isLoading,
  };
}

export function useIsPlatformAdmin() {
  // Read from the zustand persist storage
  const authStorageStr = localStorage.getItem('auth-storage');
  if (!authStorageStr) return false;
  
  try {
    const authStorage = JSON.parse(authStorageStr);
    const user = authStorage?.state?.user;
    return user?.is_platform_admin === true;
  } catch {
    return false;
  }
}
