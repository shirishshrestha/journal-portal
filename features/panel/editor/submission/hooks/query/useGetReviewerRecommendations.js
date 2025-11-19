import { useQuery } from "@tanstack/react-query";
import { getReviewerRecommendations } from "../../api";

/**
 * Hook to get reviewer recommendations for a submission
 * @param {string} id - Submission ID
 * @param {boolean} enabled - Whether to enable the query
 * @returns {Object} React Query result
 */
export const useGetReviewerRecommendations = (id, enabled = true) => {
  return useQuery({
    queryKey: ["reviewer-recommendations", id],
    queryFn: () => getReviewerRecommendations(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
