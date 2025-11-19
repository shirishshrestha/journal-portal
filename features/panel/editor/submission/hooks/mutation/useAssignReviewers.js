import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignReviewers } from "../../api";

/**
 * Hook to assign reviewers to a submission
 * @returns {Object} React Query mutation result
 */
export const useAssignReviewers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewer_ids }) => assignReviewers(id, { reviewer_ids }),
    onSuccess: (data, variables) => {
      // Invalidate submission details
      queryClient.invalidateQueries({
        queryKey: ["admin-submission", variables.id],
      });
      // Invalidate journal submissions
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions"],
      });
    },
  });
};
