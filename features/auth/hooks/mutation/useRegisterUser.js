import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "../../api/RegisterApiSlice";

export const useRegisterUser = ({ form }) => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data) => registerUser(data),
    retry: 0,
    onSuccess: () => {
      toast.success("Registration successful. Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      form.reset();
    },
    onError: (error) => {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            form.setError(field, { message: messages.join(" ") });
          }
        });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
  });
};
