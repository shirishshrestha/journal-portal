import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArea, updateArea, deleteArea } from "../../api/journalsApi";
import { toast } from "sonner";

export const useCreateArea = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArea,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Area created successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to create area";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateArea = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArea,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Area updated successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to update area";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useDeleteArea = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArea,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["taxonomy-tree"] });
      if (!options.onSuccess) {
        toast.success("Area deleted successfully!");
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete area";
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
