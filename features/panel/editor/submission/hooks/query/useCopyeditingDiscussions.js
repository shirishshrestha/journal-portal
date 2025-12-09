import { useQuery } from "@tanstack/react-query";
import {
  listCopyeditingDiscussions,
  getCopyeditingDiscussion,
} from "../../api";

/**
 * Hook to fetch copyediting discussions list
 */
export function useCopyeditingDiscussions(params = {}, options = {}) {
  return useQuery({
    queryKey: ["copyediting-discussions", params],
    queryFn: () => listCopyeditingDiscussions(params),
    ...options,
  });
}

/**
 * Hook to fetch a single copyediting discussion with messages
 */
export function useCopyeditingDiscussion(discussionId, options = {}) {
  return useQuery({
    queryKey: ["copyediting-discussion", discussionId],
    queryFn: () => getCopyeditingDiscussion(discussionId),
    enabled: !!discussionId && options.enabled !== false,
    ...options,
  });
}
