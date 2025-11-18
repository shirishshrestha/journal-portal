import { useQuery } from "@tanstack/react-query";
import { getReviewerRecommendations } from "../../api/reviewerApi";

/**
 * Hook to get reviewer recommendations for a submission
 */
export const useGetReviewerRecommendations = (submissionId) => {
  return useQuery({
    queryKey: ["reviewer-recommendations", submissionId],
    queryFn: () => getReviewerRecommendations(submissionId),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
