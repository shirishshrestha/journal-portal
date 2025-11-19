import { useQuery } from "@tanstack/react-query";
import { getJournalById } from "../../api/journalsApi";

export const useGetJournalById = (id, options = {}) => {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => getJournalById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes - journal details are relatively static
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Don't refetch - journal details don't change frequently
    refetchOnMount: false, // Use cached data
    retry: 2,
    ...options,
  });
};
