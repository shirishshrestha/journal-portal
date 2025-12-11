"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  FileX,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useCopyeditingFiles,
  useCompleteCopyeditingAssignment,
} from "../../hooks";
import { useRouter } from "next/navigation";

/**
 * EditorCompleteCopyediting Component
 *
 * Allows editors to complete copyediting assignment after authors confirm files.
 * Shows file status breakdown and validates all files are confirmed before completion.
 */
export function EditorCompleteCopyediting({ assignmentId, submissionId }) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const router = useRouter();

  // Fetch all copyediting files to check status
  const {
    data: filesData,
    isLoading,
    error,
  } = useCopyeditingFiles({
    assignmentId,
  });

  const completeMutation = useCompleteCopyeditingAssignment();

  // Categorize files by status
  const filesByStatus = useMemo(() => {
    const files = (filesData && filesData) || [];
    return {
      draft: files.filter((f) => f.file_type === "DRAFT"),
      copyedited: files.filter((f) => f.file_type === "COPYEDITED"),
      authorFinal: files.filter((f) => f.file_type === "AUTHOR_FINAL"),
      final: files.filter((f) => f.file_type === "FINAL"),
    };
  }, [filesData]);

  // Check if ready to complete
  const canComplete = useMemo(() => {
    // Every file must be confirmed by author (all files must be AUTHOR_FINAL, none COPYEDITED)
    // If there are any COPYEDITED files, not ready
    if (filesByStatus.copyedited.length > 0) {
      return false;
    }
    // If there are no files at all, not ready
    if (
      filesByStatus.draft.length +
        filesByStatus.copyedited.length +
        filesByStatus.authorFinal.length +
        filesByStatus.final.length ===
      0
    ) {
      return false;
    }
    // If there are files, all must be AUTHOR_FINAL or FINAL
    const totalFiles =
      filesByStatus.draft.length +
      filesByStatus.copyedited.length +
      filesByStatus.authorFinal.length +
      filesByStatus.final.length;
    const confirmedFiles =
      filesByStatus.authorFinal.length + filesByStatus.final.length;
    return totalFiles === confirmedFiles;
  }, [filesByStatus]);

  const handleComplete = () => {
    if (!assignmentId) return;

    completeMutation.mutate(
      {
        assignmentId,
        data: { completion_notes: completionNotes },
      },
      {
        onSuccess: () => {
          setIsCompleteDialogOpen(false);
          setCompletionNotes("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Copyediting</CardTitle>
          <CardDescription>
            Finalize copyediting and move submission to production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading file status...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Copyediting</CardTitle>
          <CardDescription>
            Finalize copyediting and move submission to production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading file status. Please try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Complete Copyediting</CardTitle>
          <CardDescription>
            Review file status and complete copyediting to move submission to
            production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Status Overview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">File Status Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Draft Files */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft Files</span>
                </div>
                <Badge variant="secondary">{filesByStatus.draft.length}</Badge>
              </div>
              {/* ...other status blocks unchanged... */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <FileX className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">
                  Awaiting Author Confirmation
                </span>
                <Badge
                  variant={
                    filesByStatus.copyedited.length > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {filesByStatus.copyedited.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Author Confirmed</span>
                <Badge
                  variant={
                    filesByStatus.authorFinal.length > 0
                      ? "success"
                      : "secondary"
                  }
                >
                  {filesByStatus.authorFinal.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Final (Production)</span>
                <Badge variant="secondary">{filesByStatus.final.length}</Badge>
              </div>
            </div>
          </div>

          {/* List of Files UI */}
          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-sm">Files</h3>
            {filesData && filesData.length > 0 ? (
              filesData.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileCheck className="h-8 w-8 text-primary stroke-[1.5] shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {file.original_filename}
                        </p>
                        {file.version && (
                          <Badge variant="secondary" className="text-xs">
                            v{file.version}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {file.file_type_display || file.file_type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                        {file.file_size && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {(file.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </>
                        )}
                        {file.created_at && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {new Date(file.created_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      {file.uploaded_by && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded by: {file.uploaded_by.user?.first_name}{" "}
                          {file.uploaded_by.user?.last_name}
                        </p>
                      )}
                      {file.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Navigate to SuperDoc editor page in read-only mode
                        router.push(
                          `/editor/submissions/${submissionId}/copyediting/edit/${file.id}?readOnly=true`
                        );
                      }}
                      title="View in SuperDoc (Read-Only)"
                    >
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No files found.</p>
              </div>
            )}
          </div>

          {/* Completion Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Completion Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                {canComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    Every file must be confirmed by author
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {canComplete
                      ? "All files confirmed by author."
                      : filesByStatus.copyedited.length > 0
                      ? `${filesByStatus.copyedited.length} file(s) awaiting confirmation`
                      : "No files confirmed yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {!canComplete && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {filesByStatus.copyedited.length > 0 ? (
                  <>
                    <strong>Waiting for author confirmation.</strong> The author
                    must review and confirm all copyedited files before you can
                    complete this assignment.
                  </>
                ) : filesByStatus.authorFinal.length === 0 ? (
                  <>
                    <strong>No files confirmed.</strong> At least one file must
                    be confirmed by the author before completion.
                  </>
                ) : (
                  <>
                    <strong>Not ready to complete.</strong> Please ensure all
                    requirements are met.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {canComplete && (
            <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-800 dark:text-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-50">
                <strong>Ready to complete!</strong> All files have been
                confirmed by the author. You can now complete the copyediting
                assignment and move the submission to production.
              </AlertDescription>
            </Alert>
          )}

          {/* Complete Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsCompleteDialogOpen(true)}
              disabled={!canComplete || !assignmentId}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Copyediting
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completion Confirmation Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Copyediting Assignment</DialogTitle>
            <DialogDescription>
              This will finalize all author-confirmed files and move the
              submission to production stage. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Summary</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • {filesByStatus.authorFinal.length} file(s) will be finalized
                </li>
                <li>• Submission will move to PRODUCTION stage</li>
                <li>• Assignment will be marked as COMPLETED</li>
              </ul>
            </div>

            {/* Optional Notes */}
            <div className="space-y-2">
              <Label htmlFor="completion-notes">
                Completion Notes (optional)
              </Label>
              <Textarea
                id="completion-notes"
                placeholder="Add any notes about the completion..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCompleteDialogOpen(false);
                setCompletionNotes("");
              }}
              disabled={completeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Assignment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
