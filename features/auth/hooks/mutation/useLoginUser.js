import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../redux/authSlice";
import { toast } from "sonner";
import useCrossTabAuth from "../useCrossTabAuth";
import { loginUser } from "../../api/LoginApiSlice";
import { useRoleRedirect } from "@/features/shared";

export const useLoginUser = () => {
  const dispatch = useDispatch();
  const broadcast = useCrossTabAuth();

  const { redirectUser } = useRoleRedirect();

  return useMutation({
    mutationFn: (data) => loginUser(data),
    retry: 0, // Don't retry login attempts - incorrect credentials should not be retried
    onSuccess: (userData) => {
      toast.success("Login successful.");
      dispatch(authLogin({ userData }));
      broadcast("login");
      setTimeout(() => {
        redirectUser(userData?.user?.roles || []);
      }, 700);
    },
    onError: (error) => {
      const detail = error?.response?.data?.detail;
      if (detail) {
        if (detail.includes("throttled")) {
          toast.error(detail);
        } else if (detail.includes("No active account")) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(detail);
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    },
  });
};
