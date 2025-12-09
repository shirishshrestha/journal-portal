import { useQuery } from "@tanstack/react-query";
import { listProductionDiscussions, getProductionDiscussion } from "../../api";

/**
 * Hook to fetch production discussions list
 */
export function useProductionDiscussions(params = {}, options = {}) {
  return useQuery({
    queryKey: ["production-discussions", params],
    queryFn: () => listProductionDiscussions(params),
    ...options,
  });
}

/**
 * Hook to fetch a single production discussion with messages
 */
export function useProductionDiscussion(discussionId, options = {}) {
  return useQuery({
    queryKey: ["production-discussion", discussionId],
    queryFn: () => getProductionDiscussion(discussionId),
    enabled: !!discussionId && options.enabled !== false,
    ...options,
  });
}
