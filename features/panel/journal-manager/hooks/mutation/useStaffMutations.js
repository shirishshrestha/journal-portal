import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addJournalStaff,
  updateJournalStaff,
  removeJournalStaff,
} from '../../api/journalManagerApi';
import { toast } from 'sonner';

export const useAddJournalStaff = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addJournalStaff,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-staff', variables.journalId] });
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      if (!options.onSuccess) {
        toast.success('Staff member added successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.user_id?.[0] ||
          error?.message ||
          'Failed to add staff member';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useUpdateJournalStaff = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJournalStaff,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-staff', variables.journalId] });
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      if (!options.onSuccess) {
        toast.success('Staff member updated successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage = error?.response?.data?.error || 'Failed to update staff member';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};

export const useRemoveJournalStaff = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeJournalStaff,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['journal-manager-staff', variables.journalId] });
      queryClient.invalidateQueries({ queryKey: ['journal-manager-journals'] });
      if (!options.onSuccess) {
        toast.success('Staff member removed successfully!');
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (!options.onError) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to remove staff member';
        toast.error(errorMessage);
      }
      options.onError?.(error, variables, context);
    },
  });
};
