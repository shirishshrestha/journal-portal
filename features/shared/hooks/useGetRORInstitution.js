import { useQuery } from "@tanstack/react-query";
import { getRORInstitutionById } from "../api/rorApi";

/**
 * Hook to fetch institution details by ROR ID
 * @param {string} rorId - ROR ID to fetch
 * @param {object} options - React Query options
 * @returns {object} Query result with institution data
 */
export const useGetRORInstitution = (rorId, options = {}) => {
  return useQuery({
    queryKey: ["ror-institution", rorId],
    queryFn: () => getRORInstitutionById(rorId),
    enabled: Boolean(rorId),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    ...options,
  });
};
