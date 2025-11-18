import { useQuery } from "@tanstack/react-query";
import { getArchivedSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get archived submissions (completed)
 */
export const useGetArchivedSubmissions = () => {
  return useQuery({
    queryKey: ["submissions", "archived"],
    queryFn: getArchivedSubmissions,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
