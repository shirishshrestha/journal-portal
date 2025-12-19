import { useQuery } from '@tanstack/react-query';
import { getJournalById } from '../../api/journalManagerApi';

export const useGetJournalById = (id, options = {}) => {
  return useQuery({
    queryKey: ['journal-manager-journal', id],
    queryFn: () => getJournalById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};
