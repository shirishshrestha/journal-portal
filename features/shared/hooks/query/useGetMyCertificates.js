import { useQuery } from '@tanstack/react-query';
import { getMyCertificates } from '../../api/achievementsApi';

/**
 * Hook to get user's certificates
 * @param {Object} params - Query parameters
 */
export const useGetMyCertificates = (params = {}) => {
  return useQuery({
    queryKey: ['my-certificates', params],
    queryFn: () => getMyCertificates(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
