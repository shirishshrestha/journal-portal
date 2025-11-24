import { useQuery } from "@tanstack/react-query";
import { getCompletedReviewAssignments } from "../api/reviewsApi";

/**
 * Hook to get completed review assignments for the current user
 */
export const useGetCompletedAssignments = () => {
  return useQuery({
    queryKey: ["reviewAssignments", "completed"],
    queryFn: getCompletedReviewAssignments,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};
