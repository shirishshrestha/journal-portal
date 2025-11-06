import { useQuery } from "@tanstack/react-query";
import { getVerificationRequests } from "../../api/VerificationApiSlice";

export const useGetVerificationRequests = (options = {}) => {
  return useQuery({
    queryKey: ["verification-requests"],
    queryFn: () => getVerificationRequests(),
    staleTime: 2 * 60 * 1000, // 2 minutes - requests status can change when admin approves/rejects
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
    refetchOnWindowFocus: true, // Refetch when user returns to check for status updates
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests twice
    ...options,
  });
};
