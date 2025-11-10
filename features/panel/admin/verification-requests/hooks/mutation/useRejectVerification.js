import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectVerification } from "../../api/VerificationActionsApiSlice";
import { toast } from "sonner";

/**
 * Hook to reject a verification request
 * @returns {Object} Mutation object with mutate function and states
 */
export const useRejectVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => rejectVerification(id, data),
    onSuccess: (data, variables) => {
      toast.success("Verification Rejected", {
        description: "The verification request has been rejected.",
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
        "Failed to reject verification request";
      toast.error("Rejection Failed", {
        description: errorMessage,
      });
    },
  });
};
