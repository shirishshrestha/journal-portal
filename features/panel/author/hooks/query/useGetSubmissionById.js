import { useQuery } from "@tanstack/react-query";
import { getSingleSubmissionById } from "../../api";

/**
 * React Query hook to fetch a submission by its ID
 * @param {string} submissionId
 * @param {object} options - Additional options for useQuery
 */
export function useGetSubmissionById(submissionId, options = {}) {
  console.log(
    "🔍 useGetSubmissionById called with submissionId:",
    submissionId
  );
  console.log("🔍 enabled:", Boolean(submissionId));

  const result = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => {
      console.log("🚀 queryFn executing for submissionId:", submissionId);
      return getSingleSubmissionById(submissionId);
    },
    enabled: Boolean(submissionId),
    staleTime: 0,
    ...options,
  });

  console.log("📊 Query result:", {
    data: result.data,
    isPending: result.isPending,
    error: result.error,
    status: result.status,
    fetchStatus: result.fetchStatus,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
  });

  return result;
}
