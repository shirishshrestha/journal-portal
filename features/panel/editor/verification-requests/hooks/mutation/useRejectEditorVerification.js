import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to reject a verification request
 */
export const useRejectEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => rejectEditorVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests"],
      });
      toast.success("Verification request rejected successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reject verification request"
      );
    },
  });
};
