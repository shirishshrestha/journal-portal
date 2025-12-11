"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCopyeditingFiles } from "@/features/panel/editor/submission/hooks";
import { toast } from "sonner";

/**
 * Component for authors to view final copyedited files
 * Shows read-only view of files that have completed the copyediting workflow
 */
export function AuthorViewFinalFiles({ assignmentId, submissionId }) {
  const router = useRouter();

  // Fetch files for this assignment
  const { data: finalFiles, isLoading } = useCopyeditingFiles({
    assignmentId,
    file_type: "AUTHOR_FINAL",
  });

  const handleViewFile = (fileId) => {
    // Navigate to read-only SuperDoc editor
    router.push(
      `/author/submissions/active/${submissionId}/copyediting/edit/${fileId}?readOnly=true`
    );
  };

  const handleDownloadFile = (file) => {
    if (file.file) {
      window.open(file.file, "_blank");
    } else {
      toast.error("File not available for download");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Final Files</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Loading final files...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finalFiles.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Final Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No final files available yet. Files will appear here once the
                copyediting process is completed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Final Files
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            These are the finalized copyedited files ready for production.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {finalFiles.map((file) => (
              <Card
                key={file.id}
                className="border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <CardContent className="">
                  <div className="flex items-start justify-between gap-4">
                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                        <h4 className="font-medium text-green-900 dark:text-green-100 truncate">
                          {file.label || "Untitled File"}
                        </h4>
                        <Badge
                          variant="outline"
                          className="shrink-0 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
                        >
                          AUTHOR FINAL
                        </Badge>
                      </div>

                      {/* File metadata */}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {file.version && (
                          <p>
                            <span className="font-medium">Version:</span>{" "}
                            {file.version}
                          </p>
                        )}
                        {file.completed_at && (
                          <p>
                            <span className="font-medium">Completed:</span>{" "}
                            {format(
                              new Date(file.completed_at),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </p>
                        )}
                        {file.copyeditor && (
                          <p>
                            <span className="font-medium">Copyeditor:</span>{" "}
                            {file.copyeditor.user_name || file.copyeditor.email}
                          </p>
                        )}
                        {file.description && (
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Description:</span>{" "}
                            {file.description}
                          </p>
                        )}
                      </div>

                      {/* Completion notes */}
                      {file.completion_notes && (
                        <div className="mt-3 p-3 bg-green-100/50 dark:bg-green-900/40 rounded-md border border-green-200 dark:border-green-700">
                          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                            Completion Notes:
                          </p>
                          <p className="text-sm text-green-800 dark:text-green-300">
                            {file.completion_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewFile(file.id)}
                        className="border-green-600 dark:border-green-700 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadFile(file)}
                        disabled={!file.file}
                        className="border-green-600 dark:border-green-700 text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Copyediting Complete
                </p>
                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                  All files have completed the copyediting process and are ready
                  for the next stage of production.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
