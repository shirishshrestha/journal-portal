import { useQuery } from '@tanstack/react-query';
import { getResearcherOfYear } from '../../api/achievementsApi';

/**
 * Hook to get researcher of the year for a journal
 * @param {string} journalId - Journal ID
 * @param {number} year - Year (optional, defaults to current year)
 */
export const useGetResearcherOfYear = (journalId, year = null, options = {}) => {
  return useQuery({
    queryKey: ['researcher-of-year', journalId, year],
    queryFn: () => getResearcherOfYear(journalId, year),
    enabled: !!journalId && options.enabled !== false,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
