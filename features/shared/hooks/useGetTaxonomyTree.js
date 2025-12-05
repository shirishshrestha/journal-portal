import { getTaxonomyTree } from "@/features/panel/editor/journal/api/journalsApi";
import { useQuery } from "@tanstack/react-query";

export const useGetTaxonomyTree = (journalId) => {
  return useQuery({
    queryKey: ["taxonomy-tree", journalId],
    queryFn: () => getTaxonomyTree(journalId),
    enabled: !!journalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
