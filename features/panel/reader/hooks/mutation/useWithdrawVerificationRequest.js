import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawVerificationRequest } from "../../api/VerificationApiSlice";
import { toast } from "sonner";

export const useWithdrawVerificationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => withdrawVerificationRequest(id),
    onSuccess: () => {
      toast.success("Verification request withdrawn successfully.");
      queryClient.invalidateQueries(["my-verification-requests"]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to withdraw verification request."
      );
    },
  });
};
