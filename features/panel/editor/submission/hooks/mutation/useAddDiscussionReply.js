import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDiscussionReply } from "../../api";
import { toast } from "sonner";

/**
 * Hook to add a reply to a discussion thread
 * @returns {Object} React Query mutation result
 */
export const useAddDiscussionReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, message }) =>
      addDiscussionReply(discussionId, message),
    onSuccess: (data, variables) => {
      toast.success("Reply sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["discussion-thread", variables.discussionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to send reply.";
      toast.error(message);
    },
  });
};
