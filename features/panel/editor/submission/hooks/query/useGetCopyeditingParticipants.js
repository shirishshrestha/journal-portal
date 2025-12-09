import { useQuery } from "@tanstack/react-query";
import { getCopyeditingParticipants } from "../../api";

/**
 * Hook to fetch copyediting participants for a submission
 * @param {string} submissionId - Submission ID
 * @param {boolean} enabled - Whether the query should run
 * @returns {Object} React Query result
 */
export const useGetCopyeditingParticipants = (submissionId, enabled = true) => {
  return useQuery({
    queryKey: ["copyediting-participants", submissionId],
    queryFn: () => getCopyeditingParticipants(submissionId),
    enabled: !!submissionId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
