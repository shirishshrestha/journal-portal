import { useMutation } from '@tanstack/react-query';
import { updateLeaderboards } from '../../api/achievementsApi';

/**
 * Hook to update all leaderboards (Admin only)
 * @param {Object} options - Mutation options (onSuccess, onError)
 * @returns {Object} Mutation object
 */
export const useUpdateLeaderboards = (options = {}) => {
  return useMutation({
    mutationFn: updateLeaderboards,
    ...options,
  });
};
