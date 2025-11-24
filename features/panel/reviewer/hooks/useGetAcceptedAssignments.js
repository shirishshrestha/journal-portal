import { useQuery } from "@tanstack/react-query";
import { getAcceptedReviewAssignments } from "../api/reviewsApi";

/**
 * Hook to get accepted review assignments for the current user
 */
export const useGetAcceptedAssignments = () => {
  return useQuery({
    queryKey: ["reviewAssignments", "accepted"],
    queryFn: getAcceptedReviewAssignments,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};
