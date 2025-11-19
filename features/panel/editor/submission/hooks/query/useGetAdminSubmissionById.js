import { useQuery } from "@tanstack/react-query";
import { getSubmissionById } from "../../api";

/**
 * Hook to get a single submission by ID
 * @param {string} id - Submission ID
 * @returns {Object} React Query result
 */
export const useGetAdminSubmissionById = (id) => {
  return useQuery({
    queryKey: ["admin-submission", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
};
