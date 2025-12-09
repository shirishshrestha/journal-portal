import { useQuery } from "@tanstack/react-query";
import { getDiscussionThread } from "../../api";

/**
 * Hook to fetch a single discussion thread with all messages
 * @param {string} discussionId - Discussion ID
 * @param {boolean} enabled - Whether the query should run
 * @returns {Object} React Query result
 */
export const useGetDiscussionThread = (discussionId, enabled = true) => {
  return useQuery({
    queryKey: ["discussion-thread", discussionId],
    queryFn: () => getDiscussionThread(discussionId),
    enabled: !!discussionId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
