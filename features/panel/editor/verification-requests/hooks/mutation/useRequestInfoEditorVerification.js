import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestInfoEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to request more information for a verification request
 */
export const useRequestInfoEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journalId, requestId, data }) =>
      requestInfoEditorVerification(journalId, requestId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests", variables.journalId],
      });
      toast.success("Information request sent successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail || "Failed to request more information"
      );
    },
  });
};
