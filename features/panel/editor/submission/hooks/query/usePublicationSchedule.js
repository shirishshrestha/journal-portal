import { useQuery } from "@tanstack/react-query";
import { getPublicationSchedule } from "../../api/publicationScheduleApi";

/**
 * Hook to fetch a single publication schedule
 * @param {string} scheduleId - Schedule UUID
 * @param {Object} options - React Query options
 * @returns {Object} - React Query result
 */
export const usePublicationSchedule = (scheduleId, options = {}) => {
  return useQuery({
    queryKey: ["publication-schedule", scheduleId],
    queryFn: () => getPublicationSchedule(scheduleId),
    enabled: !!scheduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
};
