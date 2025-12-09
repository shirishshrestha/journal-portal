import { useQuery } from "@tanstack/react-query";
import { getDraftSubmissions } from "../../api/submissionsApi";

/**
 * Hook to get draft submissions for the current user
 * @param {Object} params - Query parameters (e.g., { page: 1 })
 */
export const useGetDraftSubmissions = ({ params = {} } = {}, options = {}) => {
  return useQuery({
    queryKey: ["submissions", "drafts", params],
    queryFn: () => getDraftSubmissions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options,
  });
};
