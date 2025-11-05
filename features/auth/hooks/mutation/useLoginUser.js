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
    onSuccess: (userData) => {
      toast.success("Login successful.");
      dispatch(authLogin({ userData }));
      broadcast("login");
      setTimeout(() => {
        redirectUser(["READER", "AUTHOR", "REVIEWER", "EDITOR"]);
      }, 700);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Login failed. Please check your credentials.");
    },
  });
};
