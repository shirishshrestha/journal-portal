"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  RoleBasedRoute,
  LoadingScreen,
  useGetSubmissionById,
  SubmissionDetailsCard,
  SubmissionDocumentsCard,
  CoAuthorsCard,
  DocumentVersionsModal,
} from "@/features";
import { Card, CardContent } from "@/components/ui/card";

export default function ArchivedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const {
    data: submission,
    isPending,
    error,
  } = useGetSubmissionById(submissionId);

  const handleViewVersions = (documentId) => {
    setSelectedDocumentId(documentId);
    setVersionsDialogOpen(true);
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/author/submissions/archived")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Archived Submissions
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load submission</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={["AUTHOR"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/author/submissions/archived")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Archived Submissions
            </Button>
          </div>
        </div>

        {/* Submission Details Card */}
        <SubmissionDetailsCard submission={submission} />

        {/* Documents Card - Read-only */}
        <SubmissionDocumentsCard
          submission={submission}
          onViewVersions={handleViewVersions}
          isEditable={true}
        />

        {/* Co-authors Card */}
        <CoAuthorsCard authorContributions={submission?.author_contributions} />
      </div>

      {/* Document Versions Modal */}
      <DocumentVersionsModal
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        documentId={selectedDocumentId}
      />
    </RoleBasedRoute>
  );
}
