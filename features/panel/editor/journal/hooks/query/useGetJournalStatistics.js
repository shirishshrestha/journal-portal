import { useQuery } from "@tanstack/react-query";
import { getJournalStatistics } from "../../api/journalsApi";

export const useGetJournalStatistics = (journalId, options = {}) => {
  return useQuery({
    queryKey: ["journal-statistics", journalId],
    queryFn: () => getJournalStatistics(journalId),
    enabled: !!journalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
