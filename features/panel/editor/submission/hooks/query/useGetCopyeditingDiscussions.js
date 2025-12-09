import { useQuery } from "@tanstack/react-query";
import { getCopyeditingDiscussions } from "../../api";

/**
 * Hook to fetch copyediting discussions for a submission
 * @param {string} submissionId - Submission ID
 * @param {boolean} enabled - Whether the query should run
 * @returns {Object} React Query result
 */
export const useGetCopyeditingDiscussions = (submissionId, enabled = true) => {
  return useQuery({
    queryKey: ["copyediting-discussions", submissionId],
    queryFn: () => getCopyeditingDiscussions(submissionId),
    enabled: !!submissionId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
