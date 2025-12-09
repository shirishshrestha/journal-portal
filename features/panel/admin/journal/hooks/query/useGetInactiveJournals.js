import { useQuery } from "@tanstack/react-query";
import { getInactiveJournals } from "../../api/inactiveJournalsApi";

export const useGetInactiveJournals = ({ params = {} } = {}) => {
  return useQuery({
    queryKey: ["admin-inactive-journals", params],
    queryFn: () => getInactiveJournals(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });
};
