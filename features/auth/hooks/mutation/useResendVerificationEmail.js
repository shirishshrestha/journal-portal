import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "../../api/passwordApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const useResendVerificationEmail = (enabled) => {
  const email = useSelector((state) => state?.auth?.userData?.email);
  return useMutation({
    mutationFn: () => resendVerificationEmail(email),
    enabled: enabled,
    onSuccess: (data) => {
      toast.success("Verification email sent successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send verification email";
      toast.error(errorMessage);
    },
  });
};
