"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  Download,
  AlertCircle,
  FileText,
  Send,
  MessageSquare,
  User,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  loadDocument,
  saveYjsState,
  downloadDocx,
  submitUpdatedDocument,
  getReviewComments,
} from "@/features/panel/author/api/superdocApi";
import { SuperDocEditor, useCurrentRole } from "@/features";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSubmitUpdatedDocument } from "@/features/panel/author/hooks/mutation/useSubmitUpdatedDocument";

export default function SuperDocEditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId;
  const submissionId = params.id;

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const superDocEditorRef = useRef(null);
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);
  const { currentRole } = useCurrentRole();

  // Load document data
  const {
    data: documentData,
    isPending: isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["superdoc-document", documentId],
    queryFn: () => loadDocument(documentId),
    enabled: !!documentId,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (yjsStateBase64) => saveYjsState(documentId, yjsStateBase64),
    onSuccess: () => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to save document");
      setIsSaving(false);
    },
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (docId) => downloadDocx(docId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentData?.file_name || "document.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document downloaded successfully");
    },
    onError: () => {
      toast.error("Failed to download document");
    },
  });

  // Submit mutation for notifying reviewers

  const submitMutation = useSubmitUpdatedDocument({
    documentId,
    submissionId,
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to submit document");
    },
  });

  // Handle save from SuperDoc editor
  const handleSaveFromEditor = useCallback(
    async (yjsStateBase64) => {
      setIsSaving(true);
      await saveMutation.mutateAsync(yjsStateBase64);
    },
    [saveMutation]
  );

  // Handle unsaved changes state
  const handleUnsavedChanges = useCallback((hasChanges) => {
    setHasUnsavedChanges(hasChanges);
  }, []);

  // Manual save handler
  const handleSave = useCallback(async () => {
    if (!superDocEditorRef.current?.manualSave) {
      toast.error("Editor not initialized");
      return;
    }

    setIsSaving(true);
    const success = await superDocEditorRef.current.manualSave(false);
    setIsSaving(false);
  }, []);

  const handleDownload = () => {
    downloadMutation.mutate(documentId);
  };

  const handleSubmit = () => {
    if (hasUnsavedChanges) {
      toast.error("Please save your changes before submitting");
      return;
    }
    submitMutation.mutate();
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        !confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        return;
      }
    }
    router.push(`/author/submissions/drafts/${submissionId}`);
  };

  return (
    <Card className=" flex flex-col">
      <CardContent>
        {/* Header */}
        <CardHeader className="border-b pb-3! px-0 ">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <div>
                  <h1 className="font-semibold">
                    {documentData?.title || "Document Editor"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {documentData?.file_name}
                  </p>
                </div>
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="ml-2">
                    Unsaved Changes
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="secondary" className="ml-2">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Saving...
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!documentData || downloadMutation.isPending}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download
              </Button>
              {documentData?.can_edit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(false)}
                    disabled={saveMutation.isPending || !hasUnsavedChanges}
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending || hasUnsavedChanges}
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Submit for Review
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Main Content */}
        <div className=" overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {loadError && (
            <div className="p-8">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load document: {loadError.message}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {documentData && (
            <div className=" gap-4 ">
              {/* Main Editor Area */}
              <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
                {/* Document Info */}
                <div className="p-3 border rounded-lg bg-muted/50 shrink-0">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">File:</span>{" "}
                      {documentData.file_name}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>{" "}
                      {(documentData.file_size / 1024).toFixed(2)} KB
                    </div>
                    <div>
                      <span className="font-medium">Last Edited:</span>{" "}
                      {new Date(documentData.last_edited_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* SuperDoc Editor Container */}
                <SuperDocEditor
                  documentData={documentData}
                  userData={userData}
                  userRole={currentRole}
                  onSave={handleSaveFromEditor}
                  onUnsavedChanges={handleUnsavedChanges}
                  editorRef={superDocEditorRef}
                  className=" border rounded-lg "
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
