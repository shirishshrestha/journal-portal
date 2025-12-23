'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRemoveJournalStaff } from '../../hooks';
import { toast } from 'sonner';

export function DeleteStaffDialog({ open, onOpenChange, staff }) {
  const { mutate: removeStaff, isPending } = useRemoveJournalStaff({
    onSuccess: () => {
      toast.success('Staff member removed successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove staff member');
    },
  });

  const handleConfirmDelete = () => {
    if (!staff) return;

    removeStaff({
      journalId: staff.journal_id,
      userId: staff.profile_id,
    });
  };

  const formatRole = (role) => {
    return role
      ?.split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove{' '}
            <strong>
              {staff?.first_name} {staff?.last_name}
            </strong>{' '}
            from their role as <strong>{formatRole(staff?.role)}</strong> at{' '}
            <strong>{staff?.journal_title}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-destructive"
            disabled={isPending}
          >
            {isPending ? 'Removing...' : 'Remove Staff Member'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
