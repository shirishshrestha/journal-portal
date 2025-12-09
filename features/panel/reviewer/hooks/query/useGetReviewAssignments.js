import { useQuery } from "@tanstack/react-query";
import { getReviewAssignments } from "../../api/reviewsApi";

/**
 * Hook to get review assignments for the current user
 */
export const useGetReviewAssignments = () => {
  return useQuery({
    queryKey: ["reviewAssignments"],
    queryFn: getReviewAssignments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
