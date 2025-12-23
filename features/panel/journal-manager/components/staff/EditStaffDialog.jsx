'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateJournalStaff } from '../../hooks';
import { toast } from 'sonner';

const STAFF_ROLES = [
  { value: 'SECTION_EDITOR', label: 'Section Editor' },
  { value: 'ASSOCIATE_EDITOR', label: 'Associate Editor' },
  { value: 'MANAGING_EDITOR', label: 'Managing Editor' },
  { value: 'GUEST_EDITOR', label: 'Guest Editor' },
  { value: 'REVIEWER', label: 'Reviewer' },
];

const formSchema = z.object({
  journalId: z.string().min(1, 'Please select a journal'),
  role: z.string().min(1, 'Please select a role'),
});

export function EditStaffDialog({ open, onOpenChange, staff, journals = [] }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      journalId: '',
      role: '',
    },
  });

  const { mutate: updateStaff, isPending } = useUpdateJournalStaff({
    onSuccess: () => {
      toast.success('Staff member updated successfully');
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          'Failed to update staff member'
      );
    },
  });

  useEffect(() => {
    if (staff && open) {
      form.reset({
        journalId: staff.journal_id || '',
        role: staff.role || '',
      });
    }
  }, [staff, open, form]);

  const onSubmit = (data) => {
    if (!staff) return;

    updateStaff({
      journalId: data.journalId,
      userId: staff.profile_id,
      currentRole: staff.role,
      role: data.role,
      profile_id: staff.profile_id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>Update staff member information</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{staff?.name}</p>
                <p className="text-sm text-muted-foreground">{staff?.email}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {journals.map((journal) => (
                        <SelectItem key={journal.id} value={journal.id}>
                          {journal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STAFF_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
