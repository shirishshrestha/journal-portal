import { useQuery } from "@tanstack/react-query";
import { getPendingReviewAssignments } from "../../api/reviewsApi";

/**
 * Hook to get pending review assignments for the current user
 * @param {Object} params - Query parameters (e.g., { page: 1 })
 */
export const useGetPendingAssignments = (
  { params = {} } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["reviewAssignments", "pending", params],
    queryFn: () => getPendingReviewAssignments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
