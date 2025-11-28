import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "../../api/passwordApi";
import { toast } from "sonner";

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send password reset email";
      toast.error(errorMessage);
    },
  });
};
