import { useQuery } from "@tanstack/react-query";
import { getJournalById } from "../../api/journalsApi";

export const useGetJournalById = (id, options = {}) => {
  return useQuery({
    queryKey: ["author-journal", id],
    queryFn: () => getJournalById(id),
    enabled: !!id && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
