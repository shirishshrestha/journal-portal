"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  FileText,
  Play,
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
  useGetEditorSubmissionById,
  useStartCopyeditingAssignment,
} from "@/features";
import {
  CopyeditedFiles,
  CopyeditingAssignmentCard,
  CopyeditingDiscussions,
  CopyeditingDraftFiles,
  CopyeditingParticipants,
  EditorCompleteCopyediting,
} from "@/features/panel/editor/submission/components";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";

export default function CopyeditingWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;
  const userEmail = useSelector((state) => state.auth.userData.email);

  // Fetch submission details
  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useGetEditorSubmissionById(submissionId);

  const {
    data: assignmentsData,
    isPending: isAssignmentsPending,
    error: isAssignmentsError,
    refetch: refetchAssignment,
  } = useCopyeditingAssignments({ submission: submissionId });

  // Get the first (active) assignment
  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  // Start copyediting mutation
  const startMutation = useStartCopyeditingAssignment();

  const handleStartCopyediting = () => {
    if (assignmentId) {
      startMutation.mutate(assignmentId);
    }
  };

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

  if (isAssignmentsError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard
          title="Error Loading Submission"
          onRetry={refetchAssignment}
        />
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      {/* Header with breadcrumbs and actions */}
      {(isSubmissionLoading || isAssignmentsPending) && <LoadingScreen />}
      <div className="flex flex-col gap-4">
        {assignmentsData &&
          assignmentsData?.results[0]?.copyeditor?.user_email === userEmail && (
            <Button
              variant="ghost"
              onClick={() => router.push(`/editor/submissions/${submissionId}`)}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Submission
            </Button>
          )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Copyediting Workflow
            </h1>
            <p className="text-muted-foreground mt-2">
              {submission?.title || "Untitled Submission"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Submission ID: {submissionId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {assignment && assignment.status === "PENDING" && (
              <Button
                onClick={handleStartCopyediting}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Copyediting
                  </>
                )}
              </Button>
            )}

            {/* Help Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto w-full sm:max-w-xl p-6 bg-card">
                <SheetHeader className={"p-0"}>
                  <SheetTitle>Copyediting Help</SheetTitle>
                  <SheetDescription>
                    Guidance for managing the copyediting workflow
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-base mb-2">
                      Copyediting
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The copyediting stage involves refining the manuscript for
                      grammar, style, formatting, and consistency. The
                      copyeditor collaborates with the author to prepare the
                      manuscript for publication.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Workflow Overview:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>
                        <strong>Assign Copyeditor:</strong> Select a qualified
                        copyeditor to work on this submission.
                      </li>
                      <li>
                        <strong>Draft Files:</strong> The copyeditor reviews the
                        original manuscript files provided by the author.
                      </li>
                      <li>
                        <strong>Discussions:</strong> The copyeditor and author
                        can communicate about queries, suggestions, or changes
                        through discussion threads.
                      </li>
                      <li>
                        <strong>Copyedited Files:</strong> The copyeditor
                        uploads the edited manuscript files with tracked changes
                        or clean copies.
                      </li>
                      <li>
                        <strong>Review & Approval:</strong> The author reviews
                        the copyedited files, discusses any concerns, and
                        approves the final version.
                      </li>
                      <li>
                        <strong>Completion:</strong> Once approved, the
                        manuscript proceeds to the production stage.
                      </li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Best Practices:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        Assign a copyeditor with appropriate expertise for the
                        manuscript&apos;s subject area.
                      </li>
                      <li>
                        Use discussions to clarify ambiguities instead of making
                        unilateral changes.
                      </li>
                      <li>
                        Maintain version history to track all edits and
                        revisions.
                      </li>
                      <li>
                        Use the collaborative document editor (SuperDoc) for
                        real-time editing when needed.
                      </li>
                      <li>
                        Ensure the author reviews and approves all copyedited
                        files before proceeding.
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Document Types:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        <strong>Draft Files:</strong> Original submission files
                        (read-only for copyeditor).
                      </li>
                      <li>
                        <strong>Copyedited Files:</strong> Files with
                        copyediting changes applied.
                      </li>
                      <li>
                        <strong>Version History:</strong> All previous versions
                        with change tracking.
                      </li>
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
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="copyedited" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Copyedited Files</span>
            <span className="sm:hidden">Edited</span>
          </TabsTrigger>
          <TabsTrigger value="complete" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Complete</span>
            <span className="sm:hidden">Done</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CopyeditingDraftFiles
                assignmentId={assignmentId}
                submission={submission}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants assignmentId={assignmentId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CopyeditingDiscussions
                assignmentId={assignmentId}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants assignmentId={assignmentId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="copyedited" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CopyeditedFiles
                assignmentId={assignmentId}
                submission={submission}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants assignmentId={assignmentId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="complete" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EditorCompleteCopyediting
                assignmentId={assignmentId}
                submission={submission}
                submissionId={submissionId}
              />
            </div>
            <div>
              <CopyeditingParticipants assignmentId={assignmentId} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
