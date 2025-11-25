import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignReviewers } from "../../api";
import { toast } from "sonner";

/**
 * Hook to assign reviewers to a submission
 * @returns {Object} React Query mutation result
 */
export const useAssignReviewers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewer_ids) => assignReviewers(reviewer_ids),
    onSuccess: (data) => {
      toast.success("Reviewer assigned successfully!");
      queryClient.invalidateQueries({
        queryKey: ["editor-submission"],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviewer-recommendations"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to assign reviewer.";
      toast.error(message);
    },
  });
};
