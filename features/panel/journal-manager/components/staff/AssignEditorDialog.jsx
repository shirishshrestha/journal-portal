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
import { Button } from '@/components/ui/button';
import { useGetJournalStaff, useUpdateJournalStaff } from '../../hooks';

export function AssignEditorDialog({ open, onOpenChange, journal, availableEditors = [] }) {
  const [selectedUserId, setSelectedUserId] = useState('');

  const { data: currentStaff } = useGetJournalStaff(journal?.id, { enabled: !!journal?.id });
  const { mutate: updateStaff, isPending } = useUpdateJournalStaff({
    onSuccess: () => {
      onOpenChange(false);
      setSelectedUserId('');
    },
  });

  const handleSave = () => {
    if (!selectedUserId || !journal) return;

    // Find the current editor-in-chief in the staff list
    const currentEditor = currentStaff?.find((staff) => staff.role === 'EDITOR_IN_CHIEF');

    updateStaff({
      journalId: journal.id,
      userId: currentEditor?.user?.id || selectedUserId,
      role: 'EDITOR_IN_CHIEF',
      user_id: selectedUserId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {journal?.editor_in_chief_name ? 'Change' : 'Assign'} Editor-in-Chief
          </DialogTitle>
          <DialogDescription>
            {journal?.editor_in_chief_name
              ? 'Select a new editor-in-chief for this journal'
              : 'Select an editor-in-chief for this journal'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Journal</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{journal?.name}</p>
              <p className="text-sm text-muted-foreground">{journal?.abbreviation}</p>
            </div>
          </div>

          {journal?.editor_in_chief_name && (
            <div className="space-y-2">
              <Label>Current Editor-in-Chief</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{journal.editor_in_chief_name}</p>
                <p className="text-sm text-muted-foreground">{journal.editor_in_chief_email}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>New Editor-in-Chief</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an editor" />
              </SelectTrigger>
              <SelectContent>
                {availableEditors.map((editor) => (
                  <SelectItem key={editor.id} value={editor.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{editor.name}</span>
                      <span className="text-xs text-muted-foreground">{editor.email}</span>
                    </div>
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
          <Button onClick={handleSave} disabled={!selectedUserId || isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
