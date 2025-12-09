import { useQuery } from "@tanstack/react-query";
import { getMyAnalytics } from "@/features/shared/api/analyticsApi";

export const useGetMyAnalytics = (options = {}) => {
  return useQuery({
    queryKey: ["my-analytics"],
    queryFn: getMyAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes - analytics can change
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch to get latest stats
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
