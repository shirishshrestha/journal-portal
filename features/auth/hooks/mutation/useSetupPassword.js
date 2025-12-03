import { useMutation } from "@tanstack/react-query";
import { setupPassword } from "../../api/passwordApi";
import { toast } from "sonner";

export const useSetupPassword = () => {
  return useMutation({
    mutationFn: setupPassword,
    onSuccess: (data) => {
      toast.success("Password setup successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to setup password";
      toast.error(errorMessage);
    },
  });
};
