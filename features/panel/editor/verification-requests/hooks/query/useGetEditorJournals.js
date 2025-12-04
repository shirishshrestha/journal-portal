import { useQuery } from "@tanstack/react-query";
import { getEditorJournals } from "../../api/VerificationRequestsApiSlice";

export const useGetEditorJournals = (options = {}) => {
  return useQuery({
    queryKey: ["editor-journals-list"],
    queryFn: () => getEditorJournals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
};
