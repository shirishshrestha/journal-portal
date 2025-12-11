"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Download,
  CheckCircle,
  Loader2,
  Edit,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import {
  useCopyeditingFiles,
  useConfirmFileFinal,
  useCopyEditedFiles,
} from "../../hooks";
import { ConfirmationPopup } from "@/features/shared";

/**
 * Component for authors to review and confirm copyedited files
 * Shows files with COPYEDITED status that need author confirmation
 */
export function AuthorConfirmCopyeditedFiles({ submissionId, assignmentId }) {
  const router = useRouter();
  const params = useParams();
  const submissionIdFromParams = params?.id;

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmationNotes, setConfirmationNotes] = useState("");

  // Fetch copyediting files with COPYEDITED status
  const {
    data: filesData,
    isPending,
    error,
  } = useCopyEditedFiles({
    assignmentId,
  });

  // Fetch files with AUTHOR_FINAL status
  const { data: confirmedFilesData, isPending: isConfirmedLoading } =
    useCopyeditingFiles(
      {
        submission: assignmentId,
        file_type: "AUTHOR_FINAL",
      },
      { enabled: !!assignmentId }
    );

  const files = filesData?.results || [];
  const confirmedFiles = confirmedFilesData?.results || [];

  // Confirm file mutation
  const confirmMutation = useConfirmFileFinal();

  const handleConfirmClick = (file) => {
    setSelectedFile(file);
    setConfirmationNotes("");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedFile) return;

    confirmMutation.mutate(
      {
        fileId: selectedFile.id,
        data: {
          confirmation_notes: confirmationNotes,
        },
      },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setSelectedFile(null);
          setConfirmationNotes("");
        },
      }
    );
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileCard = (file, isConfirmed = false) => (
    <div
      key={file.id}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="relative">
          <FileText className="h-8 w-8 text-primary stroke-[1.5] shrink-0" />
          {isConfirmed && (
            <CheckCircle className="h-4 w-4 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium truncate">{file.original_filename}</p>
            {file.version && (
              <Badge variant="secondary" className="text-xs">
                v{file.version}
              </Badge>
            )}
            {isConfirmed && (
              <Badge variant="success" className="text-xs">
                Confirmed
              </Badge>
            )}
            {!isConfirmed && (
              <Badge variant="warning" className="text-xs">
                Awaiting Confirmation
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center">
              {file.file_type_display || file.file_type}
            </span>
            {file.file_size && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
              </>
            )}
            {file.created_at && (
              <>
                <span className="hidden sm:inline">•</span>
                <span>{format(new Date(file.created_at), "MMM d, yyyy")}</span>
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
          variant="secondary"
          size="sm"
          onClick={() =>
            router.push(
              `/author/submissions/active/${submissionIdFromParams}/copyediting/edit/${file.id}?readOnly=${isConfirmed}`
            )
          }
          title={isConfirmed ? "View in Editor" : "Review and Edit in Editor"}
        >
          {isConfirmed ? (
            <>
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">View</span>
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Review & Edit</span>
            </>
          )}
        </Button>
        {!isConfirmed && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleConfirmClick(file)}
            disabled={confirmMutation.isPending}
            title="Confirm this file as final"
          >
            <CheckCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Confirm Final</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownload(file.id, file.original_filename)}
          title="Download file"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Review Copyedited Files</CardTitle>
              <CardDescription>
                Review the copyedited files and confirm them as final. Once
                confirmed, the editor can complete the copyediting stage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPending ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading files...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading copyedited files</p>
            </div>
          ) : (
            <>
              {/* Files awaiting confirmation */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Awaiting Your Confirmation ({files.length})
                    </h3>
                    <Badge variant="warning">{files.length} pending</Badge>
                  </div>
                  {files.map((file) => renderFileCard(file, false))}
                </div>
              )}

              {/* Confirmed files */}
              {confirmedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">
                      Confirmed Files ({confirmedFiles.length})
                    </h3>
                    <Badge variant="success">
                      {confirmedFiles.length} confirmed
                    </Badge>
                  </div>
                  {confirmedFiles.map((file) => renderFileCard(file, true))}
                </div>
              )}

              {/* Empty state */}
              {files.length === 0 && confirmedFiles.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">
                    No Copyedited Files Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The copyeditor has not yet completed editing the files. Once
                    they submit copyedited files, they will appear here for your
                    review.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationPopup
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Confirm File as Final"
        description={
          <>
            <p className="mb-4">
              You are about to confirm this file as final. Please review it
              carefully before confirming.
            </p>
          </>
        }
        confirmText="Confirm Final"
        cancelText="Cancel"
        isPending={confirmMutation.isPending}
        isSuccess={confirmMutation.isSuccess}
        onConfirm={handleConfirm}
        variant="primary"
        icon={<CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />}
      />
    </>
  );
}
