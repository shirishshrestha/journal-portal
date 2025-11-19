import { useQuery } from "@tanstack/react-query";
import { getJournalSubmissions } from "../../api/journalsApi";

export const useGetJournalSubmissions = (journalId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["journal-submissions", journalId, params],
    queryFn: () => getJournalSubmissions(journalId, params),
    enabled: !!journalId,
    staleTime: 2 * 60 * 1000, // 2 minutes - submissions change more frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch on component mount
    retry: 2,
    ...options,
  });
};
