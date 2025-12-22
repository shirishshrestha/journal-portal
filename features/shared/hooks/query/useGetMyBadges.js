import { useQuery } from '@tanstack/react-query';
import { getMyBadges } from '../../api/achievementsApi';

/**
 * Hook to get user's badges
 * @param {Object} params - Query parameters (year, journal, is_featured, etc.)
 */
export const useGetMyBadges = (params = {}) => {
  return useQuery({
    queryKey: ['my-badges', params],
    queryFn: () => getMyBadges(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
