'use client';

import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, UserPlus, Trash2, X } from 'lucide-react';
import { useGetJournalManagers, useRemoveJournalManager } from '../hooks';
import { AssignJournalManagerDialog } from './AssignJournalManagerDialog';
import { ConfirmationPopup } from '@/features/shared';

export function JournalDetailsDrawer({ journal, isOpen, onClose }) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [managerToRemove, setManagerToRemove] = useState(null);

  const { data: managersData, isLoading: isLoadingManagers } = useGetJournalManagers(journal?.id, {
    enabled: !!journal?.id && isOpen,
  });

  const removeManagerMutation = useRemoveJournalManager({
    onSuccess: () => {
      setIsRemoveDialogOpen(false);
      setManagerToRemove(null);
    },
  });

  const handleRemoveManager = (manager) => {
    setManagerToRemove(manager);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemove = () => {
    if (managerToRemove && journal?.id) {
      removeManagerMutation.mutate({
        journalId: journal.id,
        userId: managerToRemove.user_id,
      });
    }
  };

  if (!journal) return null;

  const managers = managersData || [];

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-full min-w-full sm:min-w-2xl sm:max-w-4xl ">
        <DrawerHeader>
          <DrawerTitle>{journal?.title || '-'}</DrawerTitle>
          <DrawerDescription>{journal?.publisher || '-'}</DrawerDescription>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 z-10"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5 " />
          </Button>
        </DrawerHeader>

        <div className="space-y-6 px-4 pb-6 overflow-y-auto">
          {/* Status Badges */}
          <div className="flex gap-2">
            <Badge variant={journal?.is_active ? 'default' : 'outline'}>
              {journal?.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={journal?.is_accepting_submissions ? 'default' : 'secondary'}>
              {journal?.is_accepting_submissions ? 'Accepting Submissions' : 'Not Accepting'}
            </Badge>
          </div>

          {/* Basic Information */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Short Name
                </p>
                <p className="text-sm font-mono">{journal?.short_name || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Publisher
                </p>
                <p className="text-sm">{journal?.publisher || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Submission Count
                </p>
                <p className="text-2xl font-semibold text-primary">
                  {journal?.submission_count ?? '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ISSNs */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  ISSN Print
                </p>
                <p className="text-sm font-mono">{journal?.issn_print || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  ISSN Online
                </p>
                <p className="text-sm font-mono">{journal?.issn_online || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Editor-in-Chief */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Editor-in-Chief
                </p>
                <p className="text-sm font-medium">{journal?.editor_in_chief?.name || '-'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {journal?.editor_in_chief?.email || '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </p>
                <p
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: journal?.description || '-',
                  }}
                />
                {/* Assign Manager Dialog */}
                <AssignJournalManagerDialog
                  open={isAssignDialogOpen}
                  onOpenChange={setIsAssignDialogOpen}
                  journalId={journal?.id}
                />

                {/* Remove Manager Confirmation */}
                <ConfirmationPopup
                  open={isRemoveDialogOpen}
                  onOpenChange={setIsRemoveDialogOpen}
                  title="Remove Journal Manager"
                  description={`Are you sure you want to remove "${managerToRemove?.user_name}" as a journal manager? They will lose access to manage this journal.`}
                  confirmText="Remove"
                  cancelText="Cancel"
                  variant="danger"
                  onConfirm={confirmRemove}
                  isPending={removeManagerMutation.isPending}
                  isSuccess={removeManagerMutation.isSuccess}
                  icon={<Trash2 className="h-6 w-6 text-destructive" />}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Contact Email
                </p>
                <p className="text-sm">{journal?.contact_email || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Website
                </p>
                <a
                  href={journal?.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {journal?.website_url || '-'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className=" space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Created At
                </p>
                <p className="text-sm">
                  {journal?.created_at ? new Date(journal.created_at).toLocaleString() : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
