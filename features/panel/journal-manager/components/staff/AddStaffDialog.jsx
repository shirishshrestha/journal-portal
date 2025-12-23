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
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/features/shared/components';
import { useAddJournalStaff } from '../../hooks';
import { toast } from 'sonner';
import { useGetUsers } from '@/features/panel/admin';

const STAFF_ROLES = [
  { value: 'SECTION_EDITOR', label: 'Section Editor' },
  { value: 'ASSOCIATE_EDITOR', label: 'Associate Editor' },
  { value: 'GUEST_EDITOR', label: 'Guest Editor' },
  { value: 'MANAGING_EDITOR', label: 'Managing Editor' },
  { value: 'REVIEWER', label: 'Reviewer' },
];

const getRoleForQuery = (staffRole) => {
  const roleMapping = {
    EDITOR_IN_CHIEF: 'EDITOR',
    MANAGING_EDITOR: 'EDITOR',
    ASSOCIATE_EDITOR: 'EDITOR',
    SECTION_EDITOR: 'EDITOR',
    COPY_EDITOR: 'EDITOR',
    PRODUCTION_EDITOR: 'EDITOR',
    LAYOUT_EDITOR: 'EDITOR',
    REVIEWER: 'REVIEWER',
    GUEST_EDITOR: 'EDITOR',
  };
  return roleMapping[staffRole] || 'EDITOR';
};

const formSchema = z.object({
  role: z.string().min(1, 'Please select a role'),
  userId: z.string().min(1, 'Please select a user'),
  journalId: z.string().min(1, 'Please select a journal'),
});

export function AddStaffDialog({ open, onOpenChange, journals = [] }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      userId: '',
      journalId: '',
    },
  });

  const selectedRole = form.watch('role');

  const {
    data: usersData,
    isPending: loadingUsers,
    error: usersError,
  } = useGetUsers(
    { userRole: getRoleForQuery(selectedRole) },
    {
      enabled: !!selectedRole && open,
    }
  );

  const { mutate: addStaff, isPending } = useAddJournalStaff({
    onSuccess: () => {
      toast.success('Staff member added successfully');
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add staff member');
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ role: '', userId: '', journalId: '' });
    }
  }, [open, form]);

  const onSubmit = (data) => {
    addStaff({
      journalId: data.journalId,
      profile_id: data.userId,
      role: data.role,
    });
  };

  const userOptions =
    usersData?.results?.map((user) => ({
      value: user.profile.id,
      label: `${user.first_name} ${user.last_name} (${user.email})`,
      description: user.email,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>Search for a user and assign them to a journal</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={userOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        !selectedRole
                          ? 'Select a role first'
                          : loadingUsers
                            ? 'Loading users...'
                            : 'Select a user'
                      }
                      emptyText={
                        !selectedRole
                          ? 'Please select a role first'
                          : usersError
                            ? 'Error loading users'
                            : userOptions.length === 0
                              ? `No users found with selected role`
                              : 'No user found.'
                      }
                      searchPlaceholder="Search users by name or email..."
                      disabled={!selectedRole || loadingUsers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a journal" />
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
                {isPending ? 'Adding...' : 'Add Staff Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
