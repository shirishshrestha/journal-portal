import { useQuery } from "@tanstack/react-query";
import { getJournals } from "../../api/journalsApi";

export const useGetJournals = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ["editor-journals", params],
    queryFn: () => getJournals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - journals list is relatively static
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch - journals don't change frequently
    refetchOnMount: false, // Use cached data
    retry: 2, // Retry failed requests twice
  });
};
