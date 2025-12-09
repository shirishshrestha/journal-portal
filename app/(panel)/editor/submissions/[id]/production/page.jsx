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
  useGetEditorSubmissionById,
} from "@/features";
import {
  AssignProductionAssistantDialog,
  ProductionDiscussions,
  ProductionParticipants,
  ProductionReadyFiles,
} from "@/features/panel/editor/submission/components";

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

  const handleScheduleForPublication = () => {
    // Navigate to publication tab
    router.push(`/editor/submissions/${submissionId}/publication`);
  };

  if (isSubmissionLoading) {
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
    <div className=" space-y-6">
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
          <div>
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
            <Button onClick={handleScheduleForPublication} variant="default">
              <CalendarCheck className="h-4 w-4 mr-2" />
              Schedule for Publication
            </Button>

            <Button
              onClick={() => setIsAssignDialogOpen(true)}
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Production Assistant
            </Button>

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
                      The Production stage provides two panels to create files
                      ready for publication.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">
                      Production Ready Files
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      All files selected by the editor for production will
                      appear here. These typically include files that have been
                      prepared during the Copyediting stage. Production
                      assistants will use these files to generate the final
                      publication formats.
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
                      Editors can add production assistants or layout editors
                      from this panel. Learn more.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">
                      Publishing the Submission
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Editors and production assistants can create galley files
                      for publication. These typically represent separate
                      publication formats, such as PDF and HTML.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      Once the production-ready files have been transformed into
                      a galley file ready for publication, Editors can move from
                      the Workflow panel to the Publication tab by using the
                      Schedule for Publication button. The galley file will then
                      be uploaded in the Publication tab.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content Tabs */}
      <Tabs defaultValue="ready-files" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="ready-files" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Production Ready Files</span>
            <span className="sm:hidden">Files</span>
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

        <TabsContent value="ready-files" className="space-y-4">
          <ProductionReadyFiles
            submission={submission}
            submissionId={submissionId}
          />
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
