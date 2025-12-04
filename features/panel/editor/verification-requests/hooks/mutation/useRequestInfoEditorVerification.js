import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestInfoEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to request more information for a verification request
 */
export const useRequestInfoEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => requestInfoEditorVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests"],
      });
      toast.success("Information request sent successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to request more information"
      );
    },
  });
};
