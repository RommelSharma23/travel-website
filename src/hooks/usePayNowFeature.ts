// hooks/usePayNowFeature.ts
// Hook to check if Pay Now feature is enabled

'use client';

import { useState, useEffect } from 'react';

interface PayNowFeatureStatus {
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  disabledReason?: string;
}

export function usePayNowFeature(): PayNowFeatureStatus {
  const [status, setStatus] = useState<PayNowFeatureStatus>({
    isEnabled: true, // Default to enabled
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkFeatureStatus();
  }, []);

  const checkFeatureStatus = async () => {
    try {
      const response = await fetch('/api/admin/feature-status?feature=pay_now');
      const data = await response.json();
      
      if (data.success) {
        setStatus({
          isEnabled: data.isEnabled,
          isLoading: false,
          error: null,
          disabledReason: data.disabledReason,
        });
      } else {
        // If API fails, default to enabled (graceful degradation)
        setStatus({
          isEnabled: true,
          isLoading: false,
          error: data.error,
        });
      }
    } catch (error) {
      // If API fails, default to enabled (graceful degradation)
      setStatus({
        isEnabled: true,
        isLoading: false,
        error: 'Failed to check feature status',
      });
    }
  };

  return status;
}