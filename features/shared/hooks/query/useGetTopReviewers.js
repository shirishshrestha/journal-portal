import { useQuery } from '@tanstack/react-query';
import { getTopReviewers } from '../../api/achievementsApi';

/**
 * Hook to get top reviewers leaderboard
 * @param {Object} params - Query parameters (period, journal_id, field, country, limit, etc.)
 */
export const useGetTopReviewers = (params = {}) => {
  return useQuery({
    queryKey: ['top-reviewers', params],
    queryFn: () => getTopReviewers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
