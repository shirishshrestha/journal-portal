import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/passwordApi";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to change password";
      toast.error(errorMessage);
    },
  });
};
