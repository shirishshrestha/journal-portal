"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  UserPlus,
  MessageSquare,
  FileText,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  useGetEditorSubmissionById,
} from "@/features";
import {
  AssignProductionAssistantDialog,
  ProductionDiscussions,
  ProductionParticipants,
  ProductionReadyFiles,
  ProductionReadyFilesFromCopyediting,
} from "@/features/panel/editor/submission/components";
import {
  useProductionAssignments,
  useStartProductionAssignment,
  useCompleteProductionAssignment,
} from "@/features/panel/editor/submission/hooks";
import { format } from "date-fns";

export default function ProductionWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id;
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Fetch submission details
  const {
    data: submission,
    isPending: isSubmissionLoading,
    error: submissionError,
    refetch: refetchSubmission,
  } = useGetEditorSubmissionById(submissionId);

  // Fetch production assignment
  const { data: assignmentsData, isPending: assignmentsLoading } =
    useProductionAssignments({ submission: submissionId });

  const assignment = assignmentsData?.results?.[0];

  // Mutations
  const startMutation = useStartProductionAssignment();
  const completeMutation = useCompleteProductionAssignment();

  const handleStartProduction = () => {
    if (!assignment?.id) return;
    startMutation.mutate(assignment.id);
  };

  const handleCompleteProduction = () => {
    if (!assignment?.id) return;
    completeMutation.mutate({
      assignmentId: assignment.id,
      data: { completion_notes: "" },
    });
  };

  const handleScheduleForPublication = () => {
    router.push(`/editor/submissions/${submissionId}/publication`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Pending",
        variant: "secondary",
        icon: Clock,
      },
      IN_PROGRESS: {
        label: "In Progress",
        variant: "default",
        icon: PlayCircle,
      },
      COMPLETED: {
        label: "Completed",
        variant: "success",
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: "Cancelled",
        variant: "destructive",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isSubmissionLoading || assignmentsLoading) {
    return <LoadingScreen />;
  }

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
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/editor/submissions/${submissionId}`)}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submission
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Production Workflow
            </h1>
            <p className="text-muted-foreground mt-2">
              {submission?.title || "Untitled Submission"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Submission ID: {submissionId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {assignment?.status === "COMPLETED" && (
              <Button onClick={handleScheduleForPublication} variant="default">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Schedule for Publication
              </Button>
            )}

            {!assignment && (
              <Button
                onClick={() => setIsAssignDialogOpen(true)}
                variant="default"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Production Assistant
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
                  <SheetTitle>Production Help</SheetTitle>
                  <SheetDescription>
                    Guidance for managing the production workflow
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-base mb-2">Production</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      During the Production stage, the editor assigns production
                      assistants who will help prepare the final publication
                      files, known as galleys. For more detailed information,
                      see Learning OJS 3: Production.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Orientation</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      The Production stage provides panels to create files ready
                      for publication and manage the production team.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">
                      Production Ready Files
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Upload and manage galley files (PDF, HTML, XML, EPUB,
                      MOBI) that are ready for publication. Each galley should
                      have a clear label and format specified.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">
                      Production Discussions
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Editors and production assistants can use this panel to
                      initiate conversations if there are any details that need
                      to be clarified before the final publication files can be
                      created.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Participants</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Editors can add production assistants, layout editors, or
                      other collaborators from this panel. Participants have
                      access to files and discussions.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">
                      Publishing the Submission
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Once all galley files are uploaded and approved, complete
                      the production workflow. Then use the Schedule for
                      Publication button to set publication date, volume, issue,
                      and other metadata.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Separator />

      {/* Production Assignment Status Card */}
      {assignment ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Production Assignment</CardTitle>
                <CardDescription className="mt-1">
                  Current production status and details
                </CardDescription>
              </div>
              {getStatusBadge(assignment.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Production Assistant
                </p>
                <p className="text-sm font-semibold mt-1">
                  {assignment.production_assistant?.user?.first_name}{" "}
                  {assignment.production_assistant?.user?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned By
                </p>
                <p className="text-sm font-semibold mt-1">
                  {assignment.assigned_by?.user?.first_name}{" "}
                  {assignment.assigned_by?.user?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Due Date
                </p>
                <p className="text-sm font-semibold mt-1">
                  {assignment.due_date
                    ? format(new Date(assignment.due_date), "MMM dd, yyyy")
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned On
                </p>
                <p className="text-sm font-semibold mt-1">
                  {format(new Date(assignment.assigned_at), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            {assignment.instructions && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Instructions
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {assignment.instructions}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              {assignment.status === "PENDING" && (
                <Button
                  onClick={handleStartProduction}
                  disabled={startMutation.isPending}
                  size="sm"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Production
                </Button>
              )}
              {assignment.status === "IN_PROGRESS" && (
                <Button
                  onClick={handleCompleteProduction}
                  disabled={completeMutation.isPending}
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Production
                </Button>
              )}
              {assignment.status === "COMPLETED" && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Production Completed</AlertTitle>
                  <AlertDescription>
                    This submission is ready for publication scheduling.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Production Assignment</AlertTitle>
          <AlertDescription>
            Assign a production assistant to begin the production workflow.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="copyedited-files" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="copyedited-files" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Production Ready</span>
            <span className="sm:hidden">Ready</span>
          </TabsTrigger>
          <TabsTrigger value="galley-files" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Galley Files</span>
            <span className="sm:hidden">Galleys</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="participants" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Participants</span>
            <span className="sm:hidden">Team</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copyedited-files" className="space-y-4">
          <ProductionReadyFilesFromCopyediting submissionId={submissionId} />
        </TabsContent>

        <TabsContent value="galley-files" className="space-y-4">
          <ProductionReadyFiles submissionId={submissionId} />
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <ProductionDiscussions submissionId={submissionId} />
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <ProductionParticipants submissionId={submissionId} />
        </TabsContent>
      </Tabs>

      {/* Assign Production Assistant Dialog */}
      <AssignProductionAssistantDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        submissionId={submissionId}
      />
    </div>
  );
}
