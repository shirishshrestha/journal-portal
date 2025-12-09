import { useQuery } from "@tanstack/react-query";
import { getDeclinedReviewAssignments } from "../../api/reviewsApi";

/**
 * Hook to get declined review assignments for the current user
 * @param {Object} params - Query parameters (e.g., { page: 1 })
 */
export const useGetDeclinedAssignments = (
  { params = {} } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["reviewAssignments", "declined", params],
    queryFn: () => getDeclinedReviewAssignments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
