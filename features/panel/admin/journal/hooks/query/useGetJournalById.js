import { useQuery } from "@tanstack/react-query";
import { getJournalById } from "../../api/inactiveJournalsApi";

export const useGetJournalById = (id, options = {}) => {
  return useQuery({
    queryKey: ["admin-journal", id],
    queryFn: () => getJournalById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    retry: 2,
    ...options,
  });
};
