import { useQuery } from "@tanstack/react-query";
import { listPublicationSchedules, getPublicationSchedule } from "../../api";

/**
 * Hook to fetch publication schedules list
 */
export function usePublicationSchedules(params = {}, options = {}) {
  return useQuery({
    queryKey: ["publication-schedules", params],
    queryFn: () => listPublicationSchedules(params),
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single publication schedule
 */
export function usePublicationSchedule(scheduleId, options = {}) {
  return useQuery({
    queryKey: ["publication-schedule", scheduleId],
    queryFn: () => getPublicationSchedule(scheduleId),
    enabled: !!scheduleId && options.enabled !== false,
    ...options,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
