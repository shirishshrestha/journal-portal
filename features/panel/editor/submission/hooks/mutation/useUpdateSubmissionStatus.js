import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubmissionStatus } from "../../api";

/**
 * Hook to update submission status
 * @returns {Object} React Query mutation result
 */
export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateSubmissionStatus(id, { status }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch submission details
      queryClient.invalidateQueries({
        queryKey: ["admin-submission", variables.id],
      });
      // Invalidate journal submissions list
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions"],
      });
    },
  });
};
