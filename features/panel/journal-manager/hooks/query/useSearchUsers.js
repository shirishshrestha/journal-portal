import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../../api/journalManagerApi';

export const useSearchUsers = ({ params = {}, enabled = true } = {}) => {
  return useQuery({
    queryKey: ['journal-manager-search-users', params],
    queryFn: () => searchUsers(params),
    enabled: enabled && !!params.query,
    staleTime: 1 * 60 * 1000, // 1 minute - user searches need fresher data
    gcTime: 5 * 60 * 1000,
  });
};
