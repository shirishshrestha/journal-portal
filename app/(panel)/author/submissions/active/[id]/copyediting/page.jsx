"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ErrorCard,
  LoadingScreen,
  useCopyeditingAssignments,
  useGetSubmissionById,
} from "@/features";
import { CopyeditingDraftFiles } from "@/features/panel/editor/submission/components/copyediting/CopyeditingDraftFiles";
import { CopyeditingParticipants } from "@/features/panel/editor/submission/components/copyediting/CopyeditingParticipants";
import { CopyeditingDiscussions } from "@/features/panel/editor/submission/components";
import { CopyeditingAssignmentCard } from "@/features/panel/editor/submission/components/copyediting/CopyeditingAssignmentCard";
import { AuthorConfirmCopyeditedFiles } from "@/features/panel/editor/submission/components/copyediting/AuthorConfirmCopyeditedFiles";
import { AuthorViewFinalFiles } from "@/features/panel/author/components/copyediting/AuthorViewFinalFiles";
import { Card } from "@/components/ui/card";

/**
 * Author Copyediting Page
 *
 * Same UI as editor copyediting page but with author permissions:
 * - Can reply to discussions
 * - Can edit copyedited files (with tracked changes)
 * - Cannot edit draft files (read-only)
 * - Cannot assign/remove copyeditors or participants
 */
export default function AuthorCopyeditingPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;

  // Fetch submission details
  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useGetSubmissionById(submissionId);

  const {
    data: assignmentsData,
    isPending: isAssignmentsPending,
    error: isAssignmentsError,
  } = useCopyeditingAssignments({ submission: submissionId });

  // Get the first (active) assignment
  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  if (submissionError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard
          title="Error Loading Submission"
          onRetry={refetchSubmission}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumbs and actions */}
      {(isSubmissionLoading || isAssignmentsPending) && <LoadingScreen />}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          onClick={() =>
            router.push(`/author/submissions/active/${submissionId}`)
          }
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submission
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Copyediting Workflow
            </h1>
            <p className="text-muted-foreground mt-2">
              {submission?.title || "Loading..."}
            </p>
            {submission?.submission_id && (
              <p className="text-sm text-muted-foreground mt-1">
                Submission ID: {submission.submission_id}
              </p>
            )}
          </div>

          {/* Help Sheet */}
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Copyediting Help
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader className="p-0">
                  <SheetTitle>Copyediting Workflow Guide</SheetTitle>
                  <SheetDescription>
                    Understanding the copyediting process
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is Copyediting?</h3>
                    <p className="text-sm text-muted-foreground">
                      After your manuscript is accepted, it undergoes
                      copyediting to improve clarity, grammar, and formatting
                      consistency.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Your Role as Author</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Review copyedited files with tracked changes</li>
                      <li>Accept or reject suggested edits</li>
                      <li>Respond to queries in discussions</li>
                      <li>Provide clarifications when requested</li>
                      <li>Approve final copyedited version</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What You Can Do</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>✓ View draft files (read-only)</li>
                      <li>✓ Edit copyedited files (make changes)</li>
                      <li>✓ Reply to discussions</li>
                      <li>✓ View all participants</li>
                      <li>✗ Cannot edit original draft files</li>
                      <li>✗ Cannot assign/remove participants</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Workflow Steps</h3>
                    <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Copyeditor is assigned to your manuscript</li>
                      <li>Copyeditor reviews and edits draft files</li>
                      <li>You review copyedited files with tracked changes</li>
                      <li>Discuss queries via the Discussions tab</li>
                      <li>Make any necessary changes to copyedited files</li>
                      <li>Copyeditor reviews your changes</li>
                      <li>Final version is approved and moves to production</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tips for Authors</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Review all tracked changes carefully</li>
                      <li>Respond to queries promptly</li>
                      <li>Use discussions for clarification</li>
                      <li>Check for consistency in terminology</li>
                      <li>Verify all figures and tables are correct</li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Separator />

      {/* Assignment Info Card */}
      <Card className="p-6">
        <CopyeditingAssignmentCard
          assignment={assignment}
          isPending={isAssignmentsPending}
        />
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="draft" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="draft" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Draft Files</span>
            <span className="sm:hidden">Draft</span>
          </TabsTrigger>
          <TabsTrigger value="copyedited" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Copyedited Files</span>
            <span className="sm:hidden">Edited</span>
          </TabsTrigger>
          <TabsTrigger value="final" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Final Files</span>
            <span className="sm:hidden">Final</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
        </TabsList>

        {/* Draft Files Tab - Read Only for Authors */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CopyeditingDraftFiles
                assignmentId={assignmentId}
                submission={submission}
                submissionId={submissionId}
                readOnly={true} // Authors cannot edit draft files
              />
            </div>
            <div>
              <CopyeditingParticipants
                assignmentId={assignmentId}
                isAuthorView={true} // Hide add/remove participant buttons
              />
            </div>
          </div>
        </TabsContent>

        {/* Copyedited Files Tab - Author Confirmation */}
        <TabsContent value="copyedited" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AuthorConfirmCopyeditedFiles
                assignmentId={assignmentId}
                submission={submission}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants
                assignmentId={assignmentId}
                isAuthorView={true}
              />
            </div>
          </div>
        </TabsContent>

        {/* Final Files Tab - Read Only View */}
        <TabsContent value="final" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AuthorViewFinalFiles
                assignmentId={assignmentId}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants
                assignmentId={assignmentId}
                isAuthorView={true}
              />
            </div>
          </div>
        </TabsContent>

        {/* Discussions Tab - Authors can reply */}
        <TabsContent value="discussions" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CopyeditingDiscussions
                assignmentId={assignmentId}
                submissionId={submissionId}
                isAuthorView={true} // Authors can reply but maybe not start new discussions
              />
            </div>
            <div>
              <CopyeditingParticipants
                assignmentId={assignmentId}
                isAuthorView={true}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
