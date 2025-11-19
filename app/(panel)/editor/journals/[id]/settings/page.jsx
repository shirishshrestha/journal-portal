"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ContactSettings,
  GeneralSettings,
  LoadingScreen,
  StaffSettings,
  SubmissionSettings,
  TaxonomySettings,
  useGetJournalById,
} from "@/features";
import ErrorCard from "@/features/shared/components/ErrorCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const journalId = params.id;
  const [activeTab, setActiveTab] = useState("general");

  // Fetch journal data from backend
  const { data: journal, isPending, error } = useGetJournalById(journalId);

  if (isPending) {
    return (
      <div className="space-y-6">
        <LoadingScreen />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard
        title="Failed to load journal"
        description={error.message}
        onBack={() => router.push("/editor/journals")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={"hover:text-primary-foreground"}
              onClick={() => router.push("/editor/journals")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Journal Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                {journal?.title} ({journal?.short_name})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings journal={journal} />
        </TabsContent>

        <TabsContent value="taxonomy" className="space-y-4">
          <TaxonomySettings journalId={journalId} />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffSettings journalId={journalId} />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactSettings journal={journal} />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <SubmissionSettings journalId={journalId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
