import { useQuery, useMutation } from '@tanstack/react-query';
import { getBestReviewer } from '../../api/achievementsApi';

/**
 * Hook to get best reviewer for a journal
 * @param {string} journalId - Journal ID
 * @param {number} year - Year (optional, defaults to current year)
 */
export const useGetBestReviewer = (journalId, year = null, options = {}) => {
  return useQuery({
    queryKey: ['best-reviewer', journalId, year],
    queryFn: () => getBestReviewer(journalId, year),
    enabled: !!journalId && options.enabled !== false,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
