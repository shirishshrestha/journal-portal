"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export function JournalCreatedDialog({ open, onOpenChange, journalId }) {
  const router = useRouter();

  const handleProceedToSettings = () => {
    router.push(`/editor/journals/${journalId}/settings`);
    onOpenChange(false);
  };

  const handleCancel = () => {
    router.push("/editor/journals");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Journal Created Successfully!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Complete the journal settings to be able to accept article
              submissions from authors.
            </p>
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                You can edit journal settings anytime from the journals table
                dropdown menu by selecting &quot;Settings&quot;.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Go to Journals
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleProceedToSettings}>
            Complete Settings
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
