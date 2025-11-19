import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSection, updateSection, deleteSection } from "../../api/journalsApi";
import { toast } from "sonner";

export const useCreateSection = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Section created successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to create section";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateSection = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSection,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Section updated successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to update section";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useDeleteSection = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSection,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Section deleted successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete section";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
