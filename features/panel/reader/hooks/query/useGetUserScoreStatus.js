import { useQuery } from "@tanstack/react-query";
import { getUserScoreStatus } from "../../api/ScoreApiSlice";

export const useGetUserScoreStatus = (options = {}) => {
  return useQuery({
    queryKey: ["user-score-status"],
    queryFn: () => getUserScoreStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutes - score can change when user completes tasks
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchOnWindowFocus: true, // Refetch when user returns to see updated scores
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests twice
    ...options,
  });
};
