import { useQuery } from "@tanstack/react-query";
import { getProductionDiscussion } from "../../api";

/**
 * Hook to fetch a single production discussion with messages
 * Used to view discussion thread details and messages
 */
export function useProductionDiscussion(discussionId, options = {}) {
  return useQuery({
    queryKey: ["production-discussion", discussionId],
    queryFn: () => getProductionDiscussion(discussionId),
    enabled: !!discussionId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
