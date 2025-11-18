"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionById } from "@/features/panel/author/api/submissionsApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Upload,
  Eye,
  Send,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { RoleBasedRoute, LoadingScreen } from "@/features";
import DocumentUploadModal from "@/features/panel/author/components/submission/DocumentUploadModal";
import DocumentViewModal from "@/features/panel/author/components/submission/DocumentViewModal";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";
import { useDeleteSubmission } from "@/features/panel/author/hooks/mutation/useDeleteSubmission";
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

export default function DraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: submission,
    isPending,
    error,
  } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });

  const submitForReviewMutation = useSubmitForReview();
  const deleteSubmissionMutation = useDeleteSubmission();

  const handleSubmitForReview = () => {
    submitForReviewMutation.mutate(submissionId, {
      onSuccess: () => {
        router.push("/author/submissions/unassigned");
      },
    });
  };

  const handleDelete = () => {
    deleteSubmissionMutation.mutate(submissionId, {
      onSuccess: () => {
        router.push("/author/submissions/drafts");
      },
    });
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
            onClick={() => router.push("/author/submissions/drafts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drafts
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
              onClick={() => router.push("/author/submissions/drafts")}
              className={"hover:text-primary-foreground"}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Drafts
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              onClick={handleSubmitForReview}
              disabled={
                !submission?.documents ||
                submission.documents.length === 0 ||
                submitForReviewMutation.isPending
              }
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {submitForReviewMutation.isPending
                ? "Submitting..."
                : "Submit for Review"}
            </Button>
          </div>
        </div>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{submission?.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created {format(new Date(submission?.created_at), "PPP")}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {submission?.corresponding_author_name}
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{submission?.status_display}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Journal</h3>
              <p className="text-muted-foreground">
                {submission?.journal_name}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Abstract</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {submission?.abstract}
              </p>
            </div>

            {submission?.metadata_json?.keywords && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {submission.metadata_json.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Manage manuscript files and supporting documents
                </CardDescription>
              </div>
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!submission?.documents || submission.documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No documents uploaded</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your manuscript and supporting documents to submit for
                  review
                </p>
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {submission.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{doc.document_type_display}</span>
                          <span>•</span>
                          <span>{doc.file_name}</span>
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>
                                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewModalOpen(true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Co-authors Section */}
        {submission?.author_contributions &&
          submission.author_contributions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Co-authors</CardTitle>
                <CardDescription>
                  Authors contributing to this manuscript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submission.author_contributions.map((author, index) => (
                    <div
                      key={author.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {author.profile?.display_name || "Unknown Author"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {author.contrib_role_display} • Order: {author.order}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        submissionId={submissionId}
      />

      {/* Document View Modal */}
      <DocumentViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        submissionId={submissionId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your submission &quot;
              {submission?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSubmissionMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RoleBasedRoute>
  );
}
