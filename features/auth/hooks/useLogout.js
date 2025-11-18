import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../api/LogoutApiSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout as logoutAction } from "../redux/authSlice";

/**
 * Custom hook for handling user logout
 *
 * @returns {Object} Mutation object with mutate function and state (isPending, isSuccess, etc.)
 *
 * @example
 * const { mutate: logout, isPending } = useLogout();
 * logout(); // Triggers logout flow
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear();

      // Dispatch logout action to clear Redux state
      dispatch(logoutAction());

      // Redirect to login page
      router.replace("/login");
    },
    onError: (error) => {
      // Optionally handle error (toast, etc.)
      console.error("Logout failed", error);
    },
  });
};
