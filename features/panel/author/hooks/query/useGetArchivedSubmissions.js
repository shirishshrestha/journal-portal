import { useQuery } from "@tanstack/react-query";
import { getArchivedSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get archived submissions (completed)
 */
export const useGetArchivedSubmissions = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ["submissions", "archived", params],
    queryFn: () => getArchivedSubmissions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
