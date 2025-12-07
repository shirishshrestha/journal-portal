import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to reject a verification request
 */
export const useRejectEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, requestId, data }) =>
      rejectEditorVerification(journalId, requestId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests", variables.journalId],
      });
      toast.success("Verification request rejected successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail || "Failed to reject verification request"
      );
    },
  });
};
