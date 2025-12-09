import { useQuery } from "@tanstack/react-query";
import { listCopyeditingFiles, getCopyeditingFile } from "../../api";

/**
 * Hook to fetch copyediting files list
 */
export function useCopyeditingFiles({ assignmentId }, options = {}) {
  console.log("hook", assignmentId);
  return useQuery({
    queryKey: ["copyediting-files", assignmentId],
    queryFn: () => listCopyeditingFiles(assignmentId),
    ...options,
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
