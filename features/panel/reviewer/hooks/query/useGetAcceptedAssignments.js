import { useQuery } from "@tanstack/react-query";
import { getAcceptedReviewAssignments } from "../../api/reviewsApi";

/**
 * Hook to get accepted review assignments for the current user
 * @param {Object} params - Query parameters (e.g., { page: 1 })
 */
export const useGetAcceptedAssignments = (
  { params = {} } = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["reviewAssignments", "accepted", params],
    queryFn: () => getAcceptedReviewAssignments(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
