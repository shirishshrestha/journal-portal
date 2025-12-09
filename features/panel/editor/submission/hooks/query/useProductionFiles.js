import { useQuery } from "@tanstack/react-query";
import { listProductionFiles, getProductionFile } from "../../api";

/**
 * Hook to fetch production files (galleys) list
 */
export function useProductionFiles(params = {}, options = {}) {
  return useQuery({
    queryKey: ["production-files", params],
    queryFn: () => listProductionFiles(params),
    ...options,
  });
}

/**
 * Hook to fetch a single production file
 */
export function useProductionFile(fileId, options = {}) {
  return useQuery({
    queryKey: ["production-file", fileId],
    queryFn: () => getProductionFile(fileId),
    enabled: !!fileId && options.enabled !== false,
    ...options,
  });
}
