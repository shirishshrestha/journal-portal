import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveVerification } from "../../api/VerificationActionsApiSlice";
import { toast } from "sonner";

/**
 * Hook to approve a verification request
 * @returns {Object} Mutation object with mutate function and states
 */
export const useApproveVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => approveVerification(id, data),
    onSuccess: (data, variables) => {
      toast.success("Verification Approved", {
        description: "The verification request has been approved successfully.",
      });
      // Invalidate and refetch verification requests
      queryClient.invalidateQueries({
        queryKey: ["admin-verification-requests"],
      });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to approve verification request";
      toast.error("Approval Failed", {
        description: errorMessage,
      });
    },
  });
};
