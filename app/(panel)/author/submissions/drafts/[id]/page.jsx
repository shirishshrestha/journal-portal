"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Trash2,
  Calendar,
  User,
  Edit,
  Send,
  History,
} from "lucide-react";
import { format } from "date-fns";
import {
  RoleBasedRoute,
  LoadingScreen,
  useDeleteSubmission,
  DocumentUploadModal,
  useGetSubmissionById,
  DocumentVersionsModal,
  ConfirmationPopup,
} from "@/features";
import Link from "next/link";
import { useSubmitForReview } from "@/features/panel/author/hooks/mutation/useSubmitForReview";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DraftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;
  const {
    data: submission,
    isPending,
    error,
  } = useGetSubmissionById(submissionId);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  console.log("this is a log statement", selectedDocumentId);

  const deleteSubmissionMutation = useDeleteSubmission();

  const submitForReviewMutation = useSubmitForReview();
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
            <div className="rounded-lg border bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Journal Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Title:
                  </span>
                  <span className="text-foreground font-medium">
                    {submission?.journal.title}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Short Name:
                  </span>
                  <Badge variant="secondary" className="font-medium">
                    {submission?.journal.short_name}
                  </Badge>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Publisher:
                  </span>
                  <span className="text-muted-foreground">
                    {submission?.journal.publisher}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Submission Count:
                  </span>
                  <Badge variant="outline" className="font-medium">
                    {submission?.journal.submission_count}
                  </Badge>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    ISSN (Print):
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {submission?.journal.issn_print}
                  </code>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    ISSN (Online):
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {submission?.journal.issn_online}
                  </code>
                </div>

                {submission?.journal.website_url && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground/80 min-w-[140px]">
                      Website:
                    </span>
                    <a
                      href={submission.journal.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {submission.journal.website_url}
                    </a>
                  </div>
                )}

                {submission?.journal.contact_email && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-foreground/80 min-w-[140px]">
                      Contact Email:
                    </span>
                    <a
                      href={`mailto:${submission.journal.contact_email}`}
                      className="text-primary hover:underline"
                    >
                      {submission.journal.contact_email}
                    </a>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Status:
                  </span>
                  <Badge
                    variant={
                      submission?.journal.is_active ? "default" : "secondary"
                    }
                    className="gap-1"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        submission?.journal.is_active
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {submission?.journal.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Submissions:
                  </span>
                  <Badge
                    variant={
                      submission?.journal.is_accepting_submissions
                        ? "default"
                        : "secondary"
                    }
                    className="gap-1"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        submission?.journal.is_accepting_submissions
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {submission?.journal.is_accepting_submissions
                      ? "Accepting"
                      : "Not Accepting"}
                  </Badge>
                </div>

                <div className="flex items-start gap-2 ">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Editor in Chief:
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">
                      {submission?.journal.editor_in_chief?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-medium text-foreground/80 min-w-[140px]">
                    Created:
                  </span>
                  <span className="text-muted-foreground">
                    {submission?.journal.created_at
                      ? format(new Date(submission.journal.created_at), "PPP")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {submission?.journal.description && (
                <div className="mt-5 pt-5 border-t">
                  <span className="font-medium text-foreground/80 block mb-2">
                    Description:
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-primary/30 italic">
                    {submission.journal.description}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Abstract</h3>
              <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border bg-muted/30 p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: submission?.abstract }}
                  className="text-muted-foreground whitespace-pre-wrap"
                />
              </ScrollArea>
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
              <div className=" grid grid-cols-1 md:grid-cols-2  gap-4">
                {submission.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-primary stroke-[1.5px]" />
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDocumentId(doc.id);
                          setVersionsDialogOpen(true);
                        }}
                      >
                        <History className="h-4 w-4 mr-1 stroke-[1.5px]" />
                        Versions
                      </Button>
                      <Link
                        href={`/author/submissions/drafts/${submissionId}/editor/${doc.id}`}
                      >
                        <Button
                          variant="outline"
                          className={"font-medium"}
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-1 stroke-[1.5px]" />
                          Edit
                        </Button>
                      </Link>
                    </div>
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

      {/* Document Versions Modal */}
      <DocumentVersionsModal
        open={versionsDialogOpen}
        onOpenChange={setVersionsDialogOpen}
        documentId={selectedDocumentId}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Submission"
        description={`Are you sure you want to delete "${submission?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        isPending={deleteSubmissionMutation.isPending}
        isSuccess={deleteSubmissionMutation.isSuccess}
        icon={<Trash2 className="h-6 w-6 text-destructive" />}
      />
    </RoleBasedRoute>
  );
}
