import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get all submissions for the current user
 */
export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: getSubmissions,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
