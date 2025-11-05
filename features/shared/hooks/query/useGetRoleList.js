import { useQuery } from "@tanstack/react-query";
import { getRoleList } from "../../api/SharedApiSlice";

export const useGetRoleList = () => {
  return useQuery({
    queryKey: ["role-list"],
    queryFn: getRoleList,
  });
};
