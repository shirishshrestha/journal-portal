import { useQuery } from "@tanstack/react-query";
import { getActiveSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get active submissions (with reviewers assigned)
 */
export const useGetActiveSubmissions = () => {
  return useQuery({
    queryKey: ["submissions", "active"],
    queryFn: getActiveSubmissions,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
