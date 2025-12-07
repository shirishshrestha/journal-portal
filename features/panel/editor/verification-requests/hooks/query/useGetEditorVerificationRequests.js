import { useQuery } from "@tanstack/react-query";
import { getEditorVerificationRequests } from "../../api/VerificationRequestsApiSlice";

export const useGetEditorVerificationRequests = (
  { journalId, params = {} },
  options = {}
) => {
  return useQuery({
    queryKey: ["editor-verification-requests", journalId, params],
    queryFn: () => getEditorVerificationRequests(journalId, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    enabled: !!journalId, // Only fetch when journalId is provided
    ...options,
  });
};
