import { useQuery } from "@tanstack/react-query";
import { getJournals } from "@/features/panel/admin/journal/api/journalsApi";

/**
 * Hook to get journals list
 * @param {Object} params - Query parameters (e.g., { active_role: 'AUTHOR' })
 * @returns {Object} React Query result
 */
export const useGetJournals = (params = {}) => {
  return useQuery({
    queryKey: ["journals", params],
    queryFn: () => getJournals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
