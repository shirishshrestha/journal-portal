import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../../api/passwordApi";
import { toast } from "sonner";

export const useVerifyEmail = ({ token }) => {
  return useMutation({
    mutationFn: () => verifyEmail(token),
    onSuccess: (data) => {
      toast.success("Email verified successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to verify email";
      toast.error(errorMessage);
    },
  });
};
