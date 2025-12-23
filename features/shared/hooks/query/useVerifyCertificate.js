import { useQuery } from '@tanstack/react-query';
import { verifyCertificate } from '../../api/achievementsApi';

/**
 * Hook to verify a certificate by verification code
 * @param {string} code - Verification code
 * @param {Object} options - React Query options
 */
export const useVerifyCertificate = (code, options = {}) => {
  return useQuery({
    queryKey: ['verify-certificate', code],
    queryFn: () => verifyCertificate(code),
    enabled: !!code && code.length > 0 && options.enabled !== false,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
};
