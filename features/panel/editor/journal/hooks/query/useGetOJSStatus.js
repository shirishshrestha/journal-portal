import { useQuery } from "@tanstack/react-query";
import { getOJSStatus } from "../../api/ojsConnectionApi";

export const useGetOJSStatus = (journalId, options = {}) => {
  return useQuery({
    queryKey: ["ojs-status", journalId],
    queryFn: () => getOJSStatus(journalId),
    enabled: !!journalId && (options.enabled ?? true),
    ...options,
  });
};
