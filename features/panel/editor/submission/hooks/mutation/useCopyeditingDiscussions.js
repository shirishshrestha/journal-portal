import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCopyeditingDiscussion,
  updateCopyeditingDiscussion,
  addCopyeditingMessage,
  closeCopyeditingDiscussion,
  reopenCopyeditingDiscussion,
  deleteCopyeditingDiscussion,
} from "../../api";

/**
 * Hook to create a copyediting discussion
 */
export function useCreateCopyeditingDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createCopyeditingDiscussion(data),
    onSuccess: (data) => {
      toast.success("Discussion created successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions", data.submission],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to create discussion";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a copyediting discussion
 */
export function useUpdateCopyeditingDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, data }) =>
      updateCopyeditingDiscussion(discussionId, data),
    onSuccess: (data) => {
      toast.success("Discussion updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussion", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to update discussion";
      toast.error(message);
    },
  });
}

/**
 * Hook to add a message to a copyediting discussion
 */
export function useAddCopyeditingMessage(discussionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addCopyeditingMessage(discussionId, data),
    onSuccess: (data, variables) => {
      toast.success("Message added successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussion"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to add message";
      toast.error(message);
    },
  });
}

/**
 * Hook to close a copyediting discussion
 */
export function useCloseCopyeditingDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => closeCopyeditingDiscussion(discussionId),
    onSuccess: (data) => {
      toast.success("Discussion closed");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussion", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to close discussion";
      toast.error(message);
    },
  });
}

/**
 * Hook to reopen a copyediting discussion
 */
export function useReopenCopyeditingDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => reopenCopyeditingDiscussion(discussionId),
    onSuccess: (data) => {
      toast.success("Discussion reopened");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussion", data.id],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to reopen discussion";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a copyediting discussion
 */
export function useDeleteCopyeditingDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => deleteCopyeditingDiscussion(discussionId),
    onSuccess: () => {
      toast.success("Discussion deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["copyediting-discussions"],
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to delete discussion";
      toast.error(message);
    },
  });
}
