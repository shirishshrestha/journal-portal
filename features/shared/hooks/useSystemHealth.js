import { useQuery } from "@tanstack/react-query";
import { getSystemHealth } from "../api/healthApi";

export const useSystemHealth = (options = {}) => {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: getSystemHealth,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 2,
    ...options,
  });
};
