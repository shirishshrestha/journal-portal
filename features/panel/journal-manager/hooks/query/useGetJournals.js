import { useQuery } from '@tanstack/react-query';
import { getJournals } from '../../api/journalManagerApi';

export const useGetJournals = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ['journal-manager-journals', params],
    queryFn: () => getJournals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
};
