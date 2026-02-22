import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateJournal } from '../../api/inactiveJournalsApi';
import { toast } from 'sonner';

export const useActivateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => activateJournal(id),
    onSuccess: async (data) => {
      // Invalidate all related queries first
      queryClient.invalidateQueries({ queryKey: ['admin-inactive-journals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-journal', data.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-journals'] });

      // Then refetch active queries
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ['admin-inactive-journals'],
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: ['admin-journal', data.id],
          type: 'active',
        }),
        queryClient.refetchQueries({
          queryKey: ['admin-journals'],
          type: 'active',
        }),
      ]);
      toast.success('Journal activated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Failed to activate journal');
    },
  });
};
