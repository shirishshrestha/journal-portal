'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { useUpdateJournalStaff } from '../../hooks';

const STAFF_ROLES = [
  { value: 'SECTION_EDITOR', label: 'Section Editor' },
  { value: 'ASSOCIATE_EDITOR', label: 'Associate Editor' },
  { value: 'COPY_EDITOR', label: 'Copy Editor' },
  { value: 'PRODUCTION_EDITOR', label: 'Production Editor' },
  { value: 'LAYOUT_EDITOR', label: 'Layout Editor' },
  { value: 'MANAGING_EDITOR', label: 'Managing Editor' },
];

export function EditStaffDialog({ open, onOpenChange, staff, journals = [] }) {
  const [selectedJournalId, setSelectedJournalId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const { mutate: updateStaff, isPending } = useUpdateJournalStaff({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (staff) {
      setSelectedJournalId(staff.journal?.id?.toString() || '');
      setSelectedRole(staff.role || '');
    }
  }, [staff]);

  const handleSave = () => {
    if (!selectedJournalId || !selectedRole || !staff) return;

    updateStaff({
      journalId: selectedJournalId,
      userId: staff.user?.id,
      role: selectedRole,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>Update staff member information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{staff?.user?.name || staff?.user?.email}</p>
              <p className="text-sm text-muted-foreground">{staff?.user?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Journal</Label>
            <Select value={selectedJournalId} onValueChange={setSelectedJournalId}>
              <SelectTrigger>
                <SelectValue />
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
                <SelectValue />
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
          <Button onClick={handleSave} disabled={!selectedJournalId || !selectedRole || isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
