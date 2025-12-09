import { useQuery } from "@tanstack/react-query";
import { getCompletedReviewAssignments } from "../../api/reviewsApi";

/**
 * Hook to get completed review assignments for the current user
 * @param {Object} params - Query parameters (e.g., { page: 1 })
 */
export const useGetCompletedAssignments = (
  { params = {} } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["reviewAssignments", "completed", params],
    queryFn: () => getCompletedReviewAssignments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
