import { useQuery } from "@tanstack/react-query";
import { getVerificationRequests } from "../../api/VerificationRequestsApiSlice";

export const useGetVerificationRequests = (options = {}) => {
  return useQuery({
    queryKey: ["admin-verification-requests"],
    queryFn: getVerificationRequests,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
