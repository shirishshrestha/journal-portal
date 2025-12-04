import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveEditorVerification } from "../../api/VerificationRequestsApiSlice";
import { toast } from "sonner";

/**
 * Hook to approve a verification request
 */
export const useApproveEditorVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => approveEditorVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["editor-verification-requests"],
      });
      toast.success("Verification request approved successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to approve verification request"
      );
    },
  });
};
