import { useQuery } from "@tanstack/react-query";
import {
  fetchActivityLogs,
  fetchActivityLogDetail,
} from "../api/activityLogsApi";

/**
 * Hook to fetch activity logs with filtering
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ["activityLogs", params],
    queryFn: () => fetchActivityLogs(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to fetch a single activity log detail
 * @param {string} id - Activity log ID
 * @param {Object} options - React Query options
 * @returns {Object} React Query result
 */
export const useActivityLogDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["activityLog", id],
    queryFn: () => fetchActivityLogDetail(id),
    enabled: !!id,
    ...options,
  });
};
