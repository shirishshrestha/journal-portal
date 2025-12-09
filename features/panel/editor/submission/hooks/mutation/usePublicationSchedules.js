import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  schedulePublication,
  updatePublicationSchedule,
  publishNow,
  cancelPublication,
} from "../../api";

/**
 * Hook to schedule a publication
 */
export function useSchedulePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => schedulePublication(data),
    onSuccess: (data) => {
      toast.success("Publication scheduled successfully");
      queryClient.invalidateQueries({
        queryKey: ["publication-schedules"],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedules", data.submission],
      });
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to schedule publication";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a publication schedule
 */
export function useUpdatePublicationSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }) =>
      updatePublicationSchedule(scheduleId, data),
    onSuccess: (data) => {
      toast.success("Publication schedule updated");
      queryClient.invalidateQueries({
        queryKey: ["publication-schedules"],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update schedule";
      toast.error(message);
    },
  });
}

/**
 * Hook to publish immediately
 */
export function usePublishNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId) => publishNow(scheduleId),
    onSuccess: (data) => {
      toast.success("Article published successfully");
      queryClient.invalidateQueries({
        queryKey: ["publication-schedules"],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to publish article";
      toast.error(message);
    },
  });
}

/**
 * Hook to cancel a publication
 */
export function useCancelPublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId) => cancelPublication(scheduleId),
    onSuccess: (data) => {
      toast.success("Publication cancelled");
      queryClient.invalidateQueries({
        queryKey: ["publication-schedules"],
      });
      queryClient.invalidateQueries({
        queryKey: ["publication-schedule", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to cancel publication";
      toast.error(message);
    },
  });
}
