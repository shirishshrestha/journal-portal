'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddJournalStaff } from '../../hooks';

const STAFF_ROLES = [
  { value: 'SECTION_EDITOR', label: 'Section Editor' },
  { value: 'ASSOCIATE_EDITOR', label: 'Associate Editor' },
  { value: 'COPY_EDITOR', label: 'Copy Editor' },
  { value: 'PRODUCTION_EDITOR', label: 'Production Editor' },
  { value: 'LAYOUT_EDITOR', label: 'Layout Editor' },
  { value: 'MANAGING_EDITOR', label: 'Managing Editor' },
];

export function AddStaffDialog({ open, onOpenChange, journals = [] }) {
  const [userEmail, setUserEmail] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const { mutate: addStaff, isPending } = useAddJournalStaff({
    onSuccess: () => {
      onOpenChange(false);
      setUserEmail('');
      setSelectedJournalId('');
      setSelectedRole('');
    },
  });

  const handleSave = () => {
    if (!userEmail || !selectedJournalId || !selectedRole) return;

    addStaff({
      journalId: selectedJournalId,
      user_email: userEmail,
      role: selectedRole,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
          <DialogDescription>Add a new staff member to a journal</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              placeholder="staff.member@university.edu"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the email of an existing user in the system
            </p>
          </div>

          <div className="space-y-2">
            <Label>Journal</Label>
            <Select value={selectedJournalId} onValueChange={setSelectedJournalId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a journal" />
              </SelectTrigger>
              <SelectContent>
                {journals.map((journal) => (
                  <SelectItem key={journal.id} value={journal.id.toString()}>
                    {journal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!userEmail || !selectedJournalId || !selectedRole || isPending}
          >
            {isPending ? 'Adding...' : 'Add Staff Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
