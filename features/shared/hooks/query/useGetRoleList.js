import { useQuery } from "@tanstack/react-query";
import { getRoleList } from "../../api/SharedApiSlice";

export const useGetRoleList = (options = {}) => {
  return useQuery({
    queryKey: ["role-list"],
    queryFn: getRoleList,
    staleTime: 10 * 60 * 1000, // 10 minutes - role list changes infrequently (admin adds/removes roles)
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache for longer as role list is static
    refetchOnWindowFocus: false, // Don't refetch on focus - role list rarely changes
    refetchOnMount: false, // Don't refetch on mount - use cached data
    retry: 2, // Retry failed requests twice
    ...options,
  });
};
