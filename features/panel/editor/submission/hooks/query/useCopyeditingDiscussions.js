import { useQuery } from "@tanstack/react-query";
import {
  listCopyeditingDiscussions,
  getCopyeditingDiscussion,
} from "../../api";

/**
 * Hook to fetch copyediting discussions list
 */
export function useCopyeditingDiscussions({ assignmentId }, options = {}) {
  return useQuery({
    queryKey: ["copyediting-discussions", assignmentId],
    queryFn: () => listCopyeditingDiscussions(assignmentId),
    ...options,
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
