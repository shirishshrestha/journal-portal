import { useQuery } from "@tanstack/react-query";
import { getPendingVerificationRequests } from "../../api/VerificationRequestsApiSlice";

export const useGetPendingVerificationRequests = (options = {}) => {
  return useQuery({
    queryKey: ["admin-pending-verification-requests"],
    queryFn: getPendingVerificationRequests,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
