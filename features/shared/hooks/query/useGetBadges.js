import { useQuery } from '@tanstack/react-query';
import { getBadges } from '../../api/achievementsApi';

/**
 * Hook to get all badges
 * @param {Object} params - Query parameters (badge_type, level, search, etc.)
 */
export const useGetBadges = (params = {}) => {
  return useQuery({
    queryKey: ['badges', params],
    queryFn: () => getBadges(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
