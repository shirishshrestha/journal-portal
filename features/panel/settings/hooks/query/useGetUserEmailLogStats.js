/**
 * Query hook for fetching user email log statistics
 * @module features/panel/settings/hooks/query/useGetUserEmailLogStats
 */
import { useQuery } from "@tanstack/react-query";
import { getUserEmailLogStats } from "@/features/panel/settings/api/EmailLogApiSlice";

/**
 * useGetUserEmailLogStats - React Query hook for user email log stats
 * @param {Object} options - Query options
 * @returns {Object} Query result
 * @example
 * const { data, isPending, isError, refetch } = useGetUserEmailLogStats();
 */
export const useGetUserEmailLogStats = ({ params = {} }, options = {}) => {
  return useQuery({
    queryKey: ["user-email-log-stats", params],
    queryFn: () => getUserEmailLogStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
};
