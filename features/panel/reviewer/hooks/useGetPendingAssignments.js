import { useQuery } from "@tanstack/react-query";
import { getPendingReviewAssignments } from "../api/reviewsApi";

/**
 * Hook to get pending review assignments for the current user
 */
export const useGetPendingAssignments = () => {
  return useQuery({
    queryKey: ["reviewAssignments", "pending"],
    queryFn: getPendingReviewAssignments,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};
