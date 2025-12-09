import { useQuery } from "@tanstack/react-query";
import { getSubmissionDecisions } from "../api/reviewsApi";

/**
 * Hook to fetch editorial decisions for a specific submission
 */
export const useGetSubmissionDecisions = (submissionId) => {
  return useQuery({
    queryKey: ["submissionDecisions", submissionId],
    queryFn: () => getSubmissionDecisions(submissionId),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
