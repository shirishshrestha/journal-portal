'use client';

import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/features/shared';
import { useGetUsers } from '@/features/panel/admin/user';
import { useAssignJournalManager } from '../hooks';

export function AssignJournalManagerDialog({ open, onOpenChange, journalId }) {
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
    userRole: '',
  });

  const assignManagerMutation = useAssignJournalManager({
    onSuccess: () => {
      reset();
      onOpenChange(false);
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { userId: '' },
  });

  const selectedUserId = watch('userId');

  const onSubmit = (data) => {
    if (data.userId) {
      assignManagerMutation.mutate({
        journalId,
        profile_id: data.userId,
      });
    }
  };

  const userOptions =
    usersData?.results?.map((user) => ({
      value: user.profile?.id?.toString() || '',
      label: `${user.first_name} ${user.last_name} (${user.email})`,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Assign Journal Manager</DialogTitle>
            <DialogDescription>
              Select a user with journal manager role to assign to this journal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="journal-manager">Journal Manager</Label>
              <SearchableSelect
                options={userOptions}
                value={selectedUserId}
                onChange={(val) => setValue('userId', val)}
                placeholder="Search for journal manager..."
                emptyText="No journal managers found"
                isLoading={isLoadingUsers}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={assignManagerMutation.isPending || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedUserId || assignManagerMutation.isPending || isSubmitting}
            >
              {assignManagerMutation.isPending || isSubmitting ? 'Assigning...' : 'Assign Manager'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
