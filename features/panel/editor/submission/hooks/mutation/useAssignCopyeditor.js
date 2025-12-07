import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignCopyeditor } from "../../api";
import { toast } from "sonner";

/**
 * Hook to assign a copyeditor to a submission
 * @returns {Object} React Query mutation result
 */
export const useAssignCopyeditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, userId }) =>
      assignCopyeditor(submissionId, userId),
    onSuccess: (data, variables) => {
      toast.success("Copyeditor assigned successfully!");
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
        "Failed to assign copyeditor.";
      toast.error(message);
    },
  });
};
