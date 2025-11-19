import { useQuery } from "@tanstack/react-query";
import { getJournalStaff } from "../../api/journalsApi";

export const useGetJournalStaff = (journalId, options = {}) => {
  return useQuery({
    queryKey: ["journal-staff", journalId],
    queryFn: () => getJournalStaff(journalId),
    enabled: !!journalId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
};
