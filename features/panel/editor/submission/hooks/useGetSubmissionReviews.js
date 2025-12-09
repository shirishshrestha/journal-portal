import { useQuery } from "@tanstack/react-query";
import { getSubmissionReviews } from "../api/reviewsApi";

/**
 * Hook to fetch reviews for a specific submission
 */
export const useGetSubmissionReviews = (submissionId) => {
  return useQuery({
    queryKey: ["submissionReviews", submissionId],
    queryFn: () => getSubmissionReviews(submissionId),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
