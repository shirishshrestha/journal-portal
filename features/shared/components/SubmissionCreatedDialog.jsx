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

export function SubmissionCreatedDialog({ open, onOpenChange, submissionId }) {
  const router = useRouter();

  const handleUploadDocuments = () => {
    router.push(`/author/submissions/drafts/${submissionId}`);
    onOpenChange(false);
  };

  const handleGoToDrafts = () => {
    router.push("/author/submissions/drafts");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submission Created Successfully!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Upload the required documents and submit your submission for
              review.
            </p>
            <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                You can upload documents later from the draft submissions page
                by clicking &quot;View Submission&quot; in the dropdown menu.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleGoToDrafts}>
            Go to Drafts
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleUploadDocuments}>
            Upload Documents
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
