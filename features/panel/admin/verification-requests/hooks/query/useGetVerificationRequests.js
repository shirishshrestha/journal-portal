import { useQuery } from "@tanstack/react-query";
import { getVerificationRequests } from "../../api/VerificationRequestsApiSlice";

export const useGetVerificationRequests = ({ params = {} }, options = {}) => {
  return useQuery({
    queryKey: ["admin-verification-requests", params],
    queryFn: () => getVerificationRequests(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
