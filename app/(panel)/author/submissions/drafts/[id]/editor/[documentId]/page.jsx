"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Download,
  AlertCircle,
  FileText,
  Send,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  loadDocument,
  downloadDocx,
} from "@/features/panel/author/api/superdocApi";
import { LoadingScreen, SuperDocEditor } from "@/features";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSubmitUpdatedDocument } from "@/features/panel/author/hooks/mutation/useSubmitUpdatedDocument";

export default function SuperDocEditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId;
  const submissionId = params.id;
  const userData = useSelector((state) => state.auth.userData);

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

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: () => downloadDocx(documentId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = documentData?.file_name || "document.docx";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Document downloaded successfully");
    },
    onError: () => {
      toast.error("Failed to download document");
    },
  });

  // Submit mutation
  const submitMutation = useSubmitUpdatedDocument({
    documentId,
    submissionId,
    onSuccess: () => {
      toast.success("Document submitted for review");
      router.push(`/author/submissions/drafts/${submissionId}`);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to submit document");
    },
  });

  // Handlers
  const handleDownload = () => {
    downloadMutation.mutate();
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const handleBack = () => {
    router.push(`/author/submissions/drafts/${submissionId}`);
  };

  const handleSaveSuccess = (data) => {
    // Optionally refresh document data or update cache
    console.log("Document saved:", data);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (loadError) {
    return (
      <Card className="flex flex-col">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load document: {loadError.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!documentData) {
    return null;
  }

  return (
    <Card className="flex flex-col">
      <CardContent>
        {/* Header */}
        <CardHeader className="border-b pb-3 px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <div>
                  <h1 className="font-semibold">
                    {documentData.title || "Document Editor"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {documentData.file_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download
              </Button>
              {documentData.can_edit && (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit for Review
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Main Content */}
        <div className="overflow-hidden">
          <div className="mt-4">
            {/* Document Info */}
            <div className="p-3 border rounded-lg bg-muted/50 mb-4">
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

            {/* SuperDoc Editor */}
            <SuperDocEditor
              documentData={documentData}
              userData={userData}
              onSaveSuccess={handleSaveSuccess}
              className="border rounded-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
