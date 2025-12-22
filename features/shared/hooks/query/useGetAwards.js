import { useQuery } from '@tanstack/react-query';
import { getAwards } from '../../api/achievementsApi';

/**
 * Hook to get awards
 * @param {Object} params - Query parameters (year, award_type, journal, discipline, country, etc.)
 */
export const useGetAwards = (params = {}) => {
  return useQuery({
    queryKey: ['awards', params],
    queryFn: () => getAwards(params),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
