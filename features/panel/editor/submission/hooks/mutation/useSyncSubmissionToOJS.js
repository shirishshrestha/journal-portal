import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncSubmissionToOJS } from "../../api";
import { toast } from "sonner";

/**
 * Hook to sync a single submission to OJS
 * @returns {Object} React Query mutation result
 */
export const useSyncSubmissionToOJS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId) => syncSubmissionToOJS(submissionId),
    onSuccess: (data, submissionId) => {
      toast.success(data.message || "Submission synced to OJS successfully");

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", submissionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["journal-submissions"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sync submission to OJS.";
      toast.error(message);
    },
  });
};
