import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJournal, updateJournal, deleteJournal } from '../../api/journalManagerApi';
import { toast } from 'sonner';

export const useCreateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournal,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      if (!options.onSuccess) {
        toast.success('Journal created successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to create journal';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournal,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journal', variables.id] });
      if (!options.onSuccess) {
        toast.success('Journal updated successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to update journal';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useDeleteJournal = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJournal,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      if (!options.onSuccess) {
        toast.success('Journal deleted successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to delete journal';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
