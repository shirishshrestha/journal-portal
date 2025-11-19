import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignReviewer } from "../../api";

/**
 * Hook to assign a single reviewer to a submission
 * @returns {Object} React Query mutation result
 */
export const useAssignReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assignReviewer(data),
    onSuccess: (data, variables) => {
      // Invalidate submission details to refresh reviewer assignments
      queryClient.invalidateQueries({
        queryKey: ["admin-submission", variables.submission],
      });
      // Invalidate reviewer recommendations
      queryClient.invalidateQueries({
        queryKey: ["reviewer-recommendations", variables.submission],
      });
    },
  });
};
