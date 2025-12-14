import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePublicationSchedule,
  deletePublicationSchedule,
  cancelPublicationSchedule,
  publishNow,
} from "../../api/publicationScheduleApi";
import { toast } from "sonner";

/**
 * Hook to update a publication schedule
 * @returns {Object} - React Query mutation result
 */
export const useUpdatePublicationSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }) =>
      updatePublicationSchedule(scheduleId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publication-schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
      toast.success("Publication schedule updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to update publication schedule"
      );
    },
  });
};

/**
 * Hook to delete a publication schedule
 * @returns {Object} - React Query mutation result
 */
export const useDeletePublicationSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId) => deletePublicationSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publication-schedules"] });
      toast.success("Publication schedule deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to delete publication schedule"
      );
    },
  });
};

/**
 * Hook to cancel a publication schedule
 * @returns {Object} - React Query mutation result
 */
export const useCancelPublicationSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId) => cancelPublicationSchedule(scheduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publication-schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
      toast.success("Publication schedule cancelled successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to cancel publication schedule"
      );
    },
  });
};

/**
 * Hook to publish a schedule immediately
 * @returns {Object} - React Query mutation result
 */
export const usePublishNow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId) => publishNow(scheduleId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publication-schedules"] });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["submission"],
      });
      toast.success("Published successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail || error?.message || "Failed to publish"
      );
    },
  });
};
