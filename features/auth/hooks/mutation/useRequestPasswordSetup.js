import { useMutation } from "@tanstack/react-query";
import { requestPasswordSetup } from "../../api/passwordApi";
import { toast } from "sonner";

export const useRequestPasswordSetup = () => {
  return useMutation({
    mutationFn: requestPasswordSetup,
    onSuccess: (data) => {
      toast.success("Password setup link sent to your email");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send password setup email";
      toast.error(errorMessage);
    },
  });
};
