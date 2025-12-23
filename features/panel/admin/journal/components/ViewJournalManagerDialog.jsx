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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Building2, UserX } from 'lucide-react';
import { useRemoveJournalManager } from '../hooks/mutation/useJournalManagerMutations';
import { ConfirmationPopup } from '@/features/shared';

export function ViewJournalManagerDialog({ open, onOpenChange, journalManager, journalId }) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const removeJournalManagerMutation = useRemoveJournalManager();

  const handleRemove = () => {
    if (!journalManager || !journalId) return;

    removeJournalManagerMutation.mutate(
      {
        journalId: journalId,
        userId: journalManager.profile_id,
      },
      {
        onSuccess: () => {
          setShowRemoveConfirm(false);
          onOpenChange(false);
        },
      }
    );
  };

  if (!journalManager) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Journal Manager Details
            </DialogTitle>
            <DialogDescription>
              Current journal manager information and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Info */}
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{journalManager.name}</h3>
                  <Badge className="bg-red-100 text-red-800 border-red-200">Journal Manager</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {journalManager.email}
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Permissions</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Manage journal settings and configuration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Assign and modify staff members</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Configure organizational structure</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Monitor journal performance metrics</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Warning */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Note:</strong> Removing the journal manager will revoke all management
                permissions for this journal.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRemoveConfirm(true)}
              className="gap-2"
            >
              <UserX className="h-4 w-4" />
              Remove Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Popup */}
      <ConfirmationPopup
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove Journal Manager"
        description={`Are you sure you want to remove ${journalManager.name} as journal manager? They will lose all management permissions for this journal.`}
        confirmText="Remove"
        variant="danger"
        onConfirm={handleRemove}
        isPending={removeJournalManagerMutation.isPending}
        isSuccess={removeJournalManagerMutation.isSuccess}
        icon={<UserX className="h-6 w-6 text-destructive" />}
      />
    </>
  );
}
