import { useQuery } from '@tanstack/react-query';
import { getJournalStaff } from '../../api/journalManagerApi';

export const useGetJournalStaff = (journalId, options = {}) => {
  return useQuery({
    queryKey: ['journal-manager-staff', journalId],
    queryFn: () => getJournalStaff(journalId),
    enabled: !!journalId,
    staleTime: 2 * 60 * 1000, // 2 minutes - staff changes more frequently
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
