import { useQuery } from "@tanstack/react-query";
import { getReviewById } from "../api/reviewsApi";

/**
 * Hook to fetch a specific review by ID
 */
export const useGetReviewById = (reviewId) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReviewById(reviewId),
    enabled: !!reviewId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
