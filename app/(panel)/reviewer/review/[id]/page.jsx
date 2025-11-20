"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Building2,
  Eye,
  Download,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { RoleBasedRoute } from "@/features";
import { useGetReviewAssignmentById } from "@/features/panel/reviewer/hooks/useGetReviewAssignmentById";
import { ReviewSubmissionForm } from "@/features/panel/reviewer/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.id;

  // Fetch assignment details
  const {
    data: assignment,
    isLoading,
    error,
  } = useGetReviewAssignmentById(assignmentId);

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: {
        variant: "outline",
        className: "border-yellow-500 text-yellow-600",
      },
      ACCEPTED: { variant: "default", className: "bg-blue-600" },
      DECLINED: { variant: "destructive", className: "" },
      COMPLETED: { variant: "secondary", className: "bg-green-600 text-white" },
      CANCELLED: {
        variant: "outline",
        className: "border-gray-500 text-gray-600",
      },
    };

    return variants[status] || variants.PENDING;
  };

  if (isLoading) {
    return (
      <RoleBasedRoute allowedRoles={["REVIEWER"]}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleBasedRoute>
    );
  }

  if (error || !assignment) {
    return (
      <RoleBasedRoute allowedRoles={["REVIEWER"]}>
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive">
                  Failed to load review assignment details
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.back()}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleBasedRoute>
    );
  }

  const badgeProps = getStatusBadge(assignment.status);
  const submission = assignment.submission_details;

  return (
    <RoleBasedRoute allowedRoles={["REVIEWER"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Review Assignment</h1>
            <p className="text-muted-foreground">
              Review manuscript and provide feedback
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Assignment Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-2xl">
                  {assignment.submission_title || "Untitled Submission"}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Invited {format(new Date(assignment.invited_at), "PPP")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Due {format(new Date(assignment.due_date), "PPP")}
                  </div>
                </div>
              </div>
              <Badge {...badgeProps}>
                {assignment.status_display || assignment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Invited At</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(assignment.invited_at), "PPP p")}
                </p>
              </div>
              {assignment.accepted_at && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Accepted At</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(assignment.accepted_at), "PPP p")}
                  </p>
                </div>
              )}
              {assignment.declined_at && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">Declined At</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(assignment.declined_at), "PPP p")}
                  </p>
                </div>
              )}
              {assignment.completed_at && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium mb-1">Completed At</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(assignment.completed_at), "PPP p")}
                  </p>
                </div>
              )}
            </div>

            {/* Days Remaining / Overdue */}
            {assignment.days_remaining != null &&
              assignment.status === "ACCEPTED" && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    assignment.is_overdue
                      ? "bg-destructive/10 border border-destructive/20 text-destructive"
                      : assignment.days_remaining <= 3
                      ? "bg-amber-50 border border-amber-200 text-amber-700"
                      : "bg-green-50 border border-green-200 text-green-700"
                  }`}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {assignment.is_overdue
                      ? `${Math.abs(assignment.days_remaining)} days overdue`
                      : `${assignment.days_remaining} days remaining`}
                  </span>
                </div>
              )}

            {/* Invitation Message */}
            {assignment.invitation_message && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Invitation Message</h3>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {assignment.invitation_message}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Decline Reason */}
            {assignment.status === "DECLINED" && assignment.decline_reason && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-destructive">
                    Decline Reason
                  </h3>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {assignment.decline_reason}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Assigned By */}
            {assignment.assigned_by_info && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Assigned By</h3>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        {assignment.assigned_by_info.display_name ||
                          assignment.assigned_by_info.full_name}
                      </p>
                      {assignment.assigned_by_info.user_email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {assignment.assigned_by_info.user_email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Submission Details */}
        {submission && (
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Submission Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {assignment.status === "ACCEPTED" && (
                <TabsTrigger value="review">Submit Review</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manuscript Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Title</h3>
                    <p className="text-muted-foreground">{submission.title}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Submission Number</h3>
                    <p className="text-muted-foreground">
                      {submission.submission_number}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Journal</h3>
                    <p className="text-muted-foreground">
                      {submission.journal_name || "N/A"}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Abstract</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {submission.abstract || "No abstract provided"}
                    </p>
                  </div>

                  {submission.metadata_json?.keywords && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {submission.metadata_json.keywords.map(
                            (keyword, index) => (
                              <Badge key={index} variant="outline">
                                {keyword}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Corresponding Author</h3>
                    <div>
                      <p className="font-medium">
                        {submission.corresponding_author_name || "N/A"}
                      </p>
                      {submission.corresponding_author_email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {submission.corresponding_author_email}
                        </p>
                      )}
                      {submission.corresponding_author_affiliation && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {submission.corresponding_author_affiliation}
                        </p>
                      )}
                    </div>
                  </div>

                  {submission.author_contributions &&
                    submission.author_contributions.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-3">Co-Authors</h3>
                          <div className="space-y-2">
                            {submission.author_contributions.map(
                              (author, index) => (
                                <div
                                  key={index}
                                  className="p-3 border rounded-lg flex items-center justify-between"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {author.profile?.display_name ||
                                        "Unknown Author"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {author.contrib_role_display} • Order:{" "}
                                      {author.order}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manuscript Files</CardTitle>
                  <CardDescription>
                    Download and review the submitted documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!submission.documents ||
                  submission.documents.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No documents found</h3>
                      <p className="text-sm text-muted-foreground">
                        This submission has no documents attached
                      </p>
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
                                      {(doc.file_size / 1024 / 1024).toFixed(2)}{" "}
                                      MB
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/reviewer/review/${assignmentId}/document/${doc.id}`
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View in Editor
                            </Button>
                            {doc.original_file && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(doc.original_file, "_blank")
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {assignment.status === "ACCEPTED" && (
              <TabsContent value="review" className="space-y-4 mt-4">
                {!assignment.review ? (
                  <ReviewSubmissionForm assignment={assignment} />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">
                          Review Already Submitted
                        </h3>
                        <p className="text-muted-foreground">
                          You have already submitted your review for this manuscript
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </RoleBasedRoute>
  );
}
