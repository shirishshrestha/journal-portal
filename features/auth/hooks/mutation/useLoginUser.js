import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../redux/authSlice";
import { toast } from "sonner";
import useCrossTabAuth from "../useCrossTabAuth";
import { loginUser } from "../../api/LoginApiSlice";
import { useRoleRedirect } from "@/features/shared";
import { useRouter } from "next/navigation";

export const useLoginUser = ({ reset }) => {
  const dispatch = useDispatch();
  const broadcast = useCrossTabAuth();
  const router = useRouter();

  const { redirectUser } = useRoleRedirect();

  return useMutation({
    mutationFn: (data) => loginUser(data),
    retry: 0, // Don't retry login attempts - incorrect credentials should not be retried
    onSuccess: (userData) => {
      toast.success("Login successful.");
      reset();
      dispatch(authLogin({ userData }));
      broadcast("login");

      if (
        userData?.user?.is_verified === false &&
        userData?.user?.roles.length === 1
      ) {
        router.push(
          `/pending-verification?is_verified=${userData?.user?.is_verified}`
        );
        return;
      }

      // Normal redirect for verified users
      redirectUser(userData?.user?.roles || []);
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
