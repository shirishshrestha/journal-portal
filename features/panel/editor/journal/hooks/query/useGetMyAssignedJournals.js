import { useQuery } from "@tanstack/react-query";
import { getMyAssignedJournals } from "../../api/journalsApi";

/**
 * Hook to fetch journals where the current user is assigned as a staff member
 * This includes Managing Editor, Associate Editor, Section Editor, Guest Editor, Reviewer roles
 */
export const useGetMyAssignedJournals = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["assigned-journals", params],
    queryFn: () => getMyAssignedJournals(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    ...options,
  });
};
