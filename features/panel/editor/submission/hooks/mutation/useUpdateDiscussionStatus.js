import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDiscussionStatus } from "../../api";
import { toast } from "sonner";

/**
 * Hook to update discussion status (mark as resolved/closed)
 * @returns {Object} React Query mutation result
 */
export const useUpdateDiscussionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, status }) =>
      updateDiscussionStatus(discussionId, status),
    onSuccess: (data, variables) => {
      toast.success(`Discussion marked as ${variables.status.toLowerCase()}!`);
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
        "Failed to update discussion status.";
      toast.error(message);
    },
  });
};
