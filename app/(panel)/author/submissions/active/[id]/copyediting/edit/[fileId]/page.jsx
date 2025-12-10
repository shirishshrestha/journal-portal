"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ErrorCard,
  LoadingScreen,
  CopyeditingSuperDocEditor,
  useGetSubmissionById,
  useGetMe,
} from "@/features";

/**
 * Author Copyediting File Editor Page
 * Uses CopyeditingSuperDocEditor for editing copyedited files
 * Route: /author/submissions/active/[id]/copyediting/edit/[fileId]
 *
 * Permissions:
 * - Authors can edit copyedited files (with tracked changes)
 * - Draft files are read-only for authors (handled in CopyeditingDraftFiles component)
 */
export default function AuthorCopyeditingFileEditorPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.id;
  const fileId = params?.fileId;

  const { data: user } = useGetMe();

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
          <h1 className="text-3xl font-bold tracking-tight">
            Review & Edit Copyedited File
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
            You can review tracked changes, accept/reject edits, and make
            additional changes.
          </p>
        </div>
      </div>

      {/* CopyeditingSuperDocEditor */}
      <Card className="p-0 overflow-hidden">
        <CopyeditingSuperDocEditor
          fileId={fileId}
          userData={{
            first_name: user?.first_name,
            email: user?.email,
          }}
          readOnly={true}
          commentsReadOnly={false}
          onSaveSuccess={handleSaveSuccess}
        />
      </Card>
    </div>
  );
}
