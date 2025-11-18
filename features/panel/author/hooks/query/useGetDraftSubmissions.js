import { useQuery } from "@tanstack/react-query";
import { getDraftSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get draft submissions for the current user
 */
export const useGetDraftSubmissions = () => {
  return useQuery({
    queryKey: ["submissions", "drafts"],
    queryFn: getDraftSubmissions,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
