import { useQuery } from "@tanstack/react-query";
import { listCopyeditingFiles, getCopyeditingFile } from "../../api";

/**
 * Hook to fetch copyediting files list
 */
export function useCopyeditingFiles(params = {}, options = {}) {
  return useQuery({
    queryKey: ["copyediting-files", params],
    queryFn: () => listCopyeditingFiles(params),
    ...options,
  });
}

/**
 * Hook to fetch a single copyediting file
 */
export function useCopyeditingFile(fileId, options = {}) {
  return useQuery({
    queryKey: ["copyediting-file", fileId],
    queryFn: () => getCopyeditingFile(fileId),
    enabled: !!fileId && options.enabled !== false,
    ...options,
  });
}
