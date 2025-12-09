import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/UserApiSlice";

export const useGetUsers = ({ userRole, params }, options = {}) => {
  return useQuery({
    queryKey: ["admin-users", userRole, params],
    queryFn: () => getAllUsers(userRole, params),
    staleTime: 1000 * 60 * 5, // 5 minutes - user list can change
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchOnWindowFocus: true, // Refetch when user returns
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests twice
    ...options,
  });
};
