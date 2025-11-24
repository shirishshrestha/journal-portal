import { useQuery } from "@tanstack/react-query";
import { getDeclinedReviewAssignments } from "../api/reviewsApi";

/**
 * Hook to get declined review assignments for the current user
 */
export const useGetDeclinedAssignments = () => {
  return useQuery({
    queryKey: ["reviewAssignments", "declined"],
    queryFn: getDeclinedReviewAssignments,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};
