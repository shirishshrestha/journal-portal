import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "../api/analyticsApi";

export const useDashboardAnalytics = (options = {}) => {
  return useQuery({
    queryKey: ["admin-dashboard-analytics"],
    queryFn: getDashboardAnalytics,
    staleTime: 1000 * 60 * 5,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
