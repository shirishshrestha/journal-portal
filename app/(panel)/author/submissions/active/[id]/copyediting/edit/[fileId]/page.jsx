"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ErrorCard,
  LoadingScreen,
  CopyeditingSuperDocEditor,
  useGetSubmissionById,
  useGetMe,
} from "@/features";
import { useConfirmFileFinal } from "@/features/panel/editor/submission/hooks";
import { toast } from "sonner";

/**
 * Author Copyediting File Editor Page
 * Uses CopyeditingSuperDocEditor for editing copyedited files
 * Route: /author/submissions/active/[id]/copyediting/edit/[fileId]
 *
 * Permissions:
 * - Authors can edit COPYEDITED files (readOnly=false from query param)
 * - Authors can view DRAFT files as read-only (readOnly=true from query param)
 * - Authors can view AUTHOR_FINAL files as read-only (readOnly=true from query param)
 */
export default function AuthorCopyeditingFileEditorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const submissionId = params?.id;
  const fileId = params?.fileId;

  // Get readOnly from URL query parameter (defaults to true for safety)
  const isReadOnly = searchParams?.get("readOnly") !== "false";

  const { data: user } = useGetMe();

  // Author uses confirm-final endpoint
  const confirmMutation = useConfirmFileFinal();

  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
  } = useGetSubmissionById(submissionId);

  const handleBack = () => {
    router.push(`/author/submissions/active/${submissionId}/copyediting`);
  };

  const handleSaveSuccess = (updatedFile) => {
    console.log("File saved successfully by author:", updatedFile);
  };

  const handleConfirmFinal = async (fileId) => {
    return new Promise((resolve, reject) => {
      confirmMutation.mutate(
        { fileId, data: {} },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            const message =
              error?.response?.data?.detail ||
              error?.message ||
              "Failed to confirm file";
            toast.error(message);
            reject(error);
          },
        }
      );
    });
  };

  if (isSubmissionLoading) {
    return <LoadingScreen />;
  }

  if (submissionError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard title="Error Loading Submission" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={handleBack} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Copyediting Workflow
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isReadOnly ? "View File" : "Review & Edit Copyedited File"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {submission?.title || "Loading..."}
          </p>
          {submission?.submission_id && (
            <p className="text-sm text-muted-foreground mt-1">
              Submission ID: {submission.submission_id}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {isReadOnly
              ? "You can view the file and tracked changes."
              : "You can review tracked changes, accept/reject edits, and make additional changes."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* CopyeditingSuperDocEditor */}

          <CopyeditingSuperDocEditor
            fileId={fileId}
            userData={{
              first_name: user?.first_name,
              email: user?.email,
            }}
            readOnly={isReadOnly}
            commentsReadOnly={false}
            onSaveSuccess={handleSaveSuccess}
            className="border rounded-lg"
            goBack={`/author/submissions/active/${submissionId}/copyediting`}
            onApprove={isReadOnly ? null : handleConfirmFinal}
            approveButtonText="Confirm as Final"
            approveDialogTitle="Confirm File as Final"
            approveDialogDescription="Are you sure you want to confirm this file as final? This will mark it as author-approved and ready for final completion."
            showApproveButton={!isReadOnly}
          />
        </CardContent>
      </Card>
    </div>
  );
}
