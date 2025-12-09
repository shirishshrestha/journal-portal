import { useQuery } from "@tanstack/react-query";
import { getSubmissionById } from "../../api";

/**
 * Hook to get a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Object} React Query result
 */
export const useGetEditorSubmissionById = (id) => {
  return useQuery({
    queryKey: ["editor-submission", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
};
