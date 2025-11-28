import { useMutation } from "@tanstack/react-query";
import { confirmPasswordReset } from "../../api/passwordApi";
import { toast } from "sonner";

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: (data) => {
      toast.success("Password reset successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to reset password";
      toast.error(errorMessage);
    },
  });
};
