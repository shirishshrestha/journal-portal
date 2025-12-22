import { useQuery } from '@tanstack/react-query';
import { getLeaderboards } from '../../api/achievementsApi';

/**
 * Hook to get leaderboards
 * @param {Object} params - Query parameters (category, period, journal, field, country, etc.)
 */
export const useGetLeaderboards = (params = {}) => {
  return useQuery({
    queryKey: ['leaderboards', params],
    queryFn: () => getLeaderboards(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
