import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../api/UserApiSlice";

export const useGetUsers = ({ userRole }, options = {}) => {
  return useQuery({
    queryKey: ["admin-users", userRole],
    queryFn: () => getAllUsers(userRole),
    staleTime: 2 * 60 * 1000, // 2 minutes - user list can change
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchOnWindowFocus: true, // Refetch when user returns
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests twice
    ...options,
  });
};
