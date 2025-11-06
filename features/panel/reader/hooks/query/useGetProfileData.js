import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "../../api/ProfileApiSlice";

export const useGetProfileData = (options = {}) => {
  const userId = useSelector((state) => state.auth.userData?.id);
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getProfileData(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
