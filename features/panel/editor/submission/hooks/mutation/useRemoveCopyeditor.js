import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCopyeditor } from "../../api";
import { toast } from "sonner";

/**
 * Hook to remove a copyeditor from a submission
 * @returns {Object} React Query mutation result
 */
export const useRemoveCopyeditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, userId }) =>
      removeCopyeditor(submissionId, userId),
    onSuccess: (data, variables) => {
      toast.success("Copyeditor removed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", variables.submissionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-participants", variables.submissionId],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to remove copyeditor.";
      toast.error(message);
    },
  });
};
