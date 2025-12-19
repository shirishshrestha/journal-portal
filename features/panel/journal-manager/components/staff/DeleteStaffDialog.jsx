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

export function DeleteStaffDialog({ open, onOpenChange, staff }) {
  const { mutate: removeStaff, isPending } = useRemoveJournalStaff({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleConfirmDelete = () => {
    if (!staff) return;

    removeStaff({
      journalId: staff.journal?.id,
      userId: staff.user?.id,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove <strong>{staff?.user?.name || staff?.user?.email}</strong> from their
            role as <strong>{staff?.role}</strong> at <strong>{staff?.journal?.name}</strong>. This
            action cannot be undone.
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
