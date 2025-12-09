import { useQuery } from "@tanstack/react-query";
import { getActiveSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get active submissions (with reviewers assigned)
 */
export const useGetActiveSubmissions = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ["submissions", "active", params],
    queryFn: () => getActiveSubmissions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
