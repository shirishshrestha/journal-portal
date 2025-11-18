import { useQuery } from "@tanstack/react-query";
import { getUnassignedSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get unassigned submissions (no reviewers assigned)
 */
export const useGetUnassignedSubmissions = () => {
  return useQuery({
    queryKey: ["submissions", "unassigned"],
    queryFn: getUnassignedSubmissions,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
