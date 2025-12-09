"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ErrorCard,
  LoadingScreen,
  useGetEditorSubmissionById,
} from "@/features";

export default function CopyeditingEditPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.id;
  const fileId = params?.fileId;

  const {
    data: submission,
    isPending: isSubmissionPending,
    error: submissionError,
  } = useGetEditorSubmissionById(submissionId);

  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");

  const handleBack = () => {
    router.push(`/editor/submissions/${submissionId}/copyediting`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save file mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("File saved successfully");
    } catch (error) {
      toast.error("Failed to save file");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSubmissionPending) {
    return <LoadingScreen />;
  }

  if (submissionError) {
    return <ErrorCard error={submissionError} />;
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Copyediting File
            </h1>
            <p className="text-muted-foreground mt-1">
              {submission?.title || "Untitled Submission"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Original
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      {/* File Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File Information</CardTitle>
              <CardDescription>File ID: {fileId}</CardDescription>
            </div>
            <Badge>Draft</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">File Name:</span>
              <span className="font-medium">manuscript.docx</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upload Date:</span>
              <span className="font-medium">Jan 20, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">File Size:</span>
              <span className="font-medium">2.4 MB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SuperDoc Editor Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Document Editor</CardTitle>
          <CardDescription>
            Use the editor below to make copyediting changes to the manuscript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[600px] border rounded-md p-4 bg-background">
            <div className="text-center text-muted-foreground py-20">
              <p className="text-lg font-medium mb-2">
                SuperDoc Editor Integration
              </p>
              <p className="text-sm">
                This is where the SuperDoc editor component will be integrated
              </p>
              <p className="text-sm mt-4">
                File ID:{" "}
                <code className="bg-muted px-2 py-1 rounded">{fileId}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>
            Track all changes made to this document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Current Version</p>
                <p className="text-sm text-muted-foreground">
                  Last modified: Just now
                </p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="text-center text-sm text-muted-foreground py-4">
              No previous versions available
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
