import { useQuery } from '@tanstack/react-query';
import { getJournalStatistics } from '../../api/journalManagerApi';

export const useGetJournalStatistics = (journalId, options = {}) => {
  return useQuery({
    queryKey: ['journal-manager-statistics', journalId],
    queryFn: () => getJournalStatistics(journalId),
    enabled: !!journalId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
