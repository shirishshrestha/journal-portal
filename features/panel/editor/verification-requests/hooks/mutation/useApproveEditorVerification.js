import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to approve a verification request
 */
export const useApproveEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, requestId, data }) =>
      approveEditorVerification(journalId, requestId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests", variables.journalId],
      });
      toast.success("Verification request approved successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail ||
          "Failed to approve verification request"
      );
    },
  });
};
