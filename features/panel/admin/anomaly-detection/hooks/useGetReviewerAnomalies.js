import { useQuery } from "@tanstack/react-query";
import { getReviewerAnomalies } from "../api/anomalyDetectionApi";

/**
 * Hook to get reviewer anomalies
 */
export const useGetReviewerAnomalies = (reviewerId, enabled = true) => {
  return useQuery({
    queryKey: ["reviewerAnomalies", reviewerId],
    queryFn: () => getReviewerAnomalies(reviewerId),
    enabled: enabled && !!reviewerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
