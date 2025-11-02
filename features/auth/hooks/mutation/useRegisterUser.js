import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "../../api/RegisterApiSlice";

export const useRegisterUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: () => {
      toast.success("Registration successful. Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.email
          ? "Email already in use."
          : "Registration failed. Please try again."
      );
    },
  });
};
