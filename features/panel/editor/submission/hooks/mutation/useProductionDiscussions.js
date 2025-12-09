import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProductionDiscussion,
  updateProductionDiscussion,
  addProductionMessage,
  closeProductionDiscussion,
  reopenProductionDiscussion,
  deleteProductionDiscussion,
} from "../../api";

/**
 * Hook to create a production discussion
 */
export function useCreateProductionDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createProductionDiscussion(data),
    onSuccess: (data) => {
      toast.success("Discussion created successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-discussions", data.submission],
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
 * Hook to update a production discussion
 */
export function useUpdateProductionDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, data }) =>
      updateProductionDiscussion(discussionId, data),
    onSuccess: (data) => {
      toast.success("Discussion updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-discussion", data.id],
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
 * Hook to add a message to a production discussion
 */
export function useAddProductionMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discussionId, data }) =>
      addProductionMessage(discussionId, data),
    onSuccess: (data, variables) => {
      toast.success("Message added successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-discussion", variables.discussionId],
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
 * Hook to close a production discussion
 */
export function useCloseProductionDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => closeProductionDiscussion(discussionId),
    onSuccess: (data) => {
      toast.success("Discussion closed");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-discussion", data.id],
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
 * Hook to reopen a production discussion
 */
export function useReopenProductionDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => reopenProductionDiscussion(discussionId),
    onSuccess: (data) => {
      toast.success("Discussion reopened");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["production-discussion", data.id],
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
 * Hook to delete a production discussion
 */
export function useDeleteProductionDiscussion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => deleteProductionDiscussion(discussionId),
    onSuccess: () => {
      toast.success("Discussion deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["production-discussions"],
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
