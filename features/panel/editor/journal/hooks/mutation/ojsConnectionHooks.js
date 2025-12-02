import { useQuery, useMutation } from "@tanstack/react-query";
import {
  connectOJS,
  disconnectOJS,
  getOJSStatus,
  updateOJSConnection,
} from "../../api/ojsConnectionApi";

export function useConnectOjs(journalId) {
  return useMutation({
    mutationFn: () => connectOJS(journalId),
    retry: 1,
  });
}

export function useDisconnectOJS(journalId) {
  return useMutation({
    mutationFn: () => disconnectOJS(journalId),
  });
}

export function useGetOJSStatus(journalId) {
  return useQuery({
    queryKey: ["ojs-status", journalId],
    queryFn: () => getOJSStatus(journalId),
    staleTime: 30 * 1000,
  });
}
