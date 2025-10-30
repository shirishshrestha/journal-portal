import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../redux/authSlice";
import { toast } from "sonner";
import useCrossTabAuth from "../useCrossTabAuth";
import { loginUser } from "../../api/LoginApiSlice";

export const useLoginUser = () => {
  const dispatch = useDispatch();
  const broadcast = useCrossTabAuth();
  const router = useRouter();
  return useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: (userData) => {
      dispatch(authLogin({ userData }));
      broadcast("login");
      router.push("/"); // redirect
    },
    onError: (error) => {
      console.log(error);
      toast.error("Login failed. Please check your credentials.");
    },
  });
};
