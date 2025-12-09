import { useQuery } from "@tanstack/react-query";
import { getUnassignedSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get unassigned submissions (no reviewers assigned)
 */
export const useGetUnassignedSubmissions = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ["submissions", "unassigned", params],
    queryFn: () => getUnassignedSubmissions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
