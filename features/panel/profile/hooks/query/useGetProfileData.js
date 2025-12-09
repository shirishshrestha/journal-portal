import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "../../../reader/api/ProfileApiSlice";

export const useGetProfileData = (options = {}) => {
  const userId = useSelector((state) => state.auth?.userData?.id);
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getProfileData(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
