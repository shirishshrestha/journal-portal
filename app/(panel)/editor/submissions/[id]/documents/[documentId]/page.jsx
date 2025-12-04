"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SuperDocEditor,
  LoadingScreen,
  ErrorCard,
  PDFViewer,
} from "@/features";
import { loadDocument } from "@/features/panel/author/api/superdocApi";
import { useSelector } from "react-redux";

export default function EditorDocumentViewPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id;
  const documentId = params.documentId;

  const { userData } = useSelector((state) => state?.auth?.userData);
  // Load document data using the same API as author
  const {
    data: documentData,
    isPending: isLoading,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ["superdoc-document", documentId],
    queryFn: () => loadDocument(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (loadError) {
    return (
      <ErrorCard
        title="Failed to Load Document"
        description={
          loadError?.message || "Unable to load the document. Please try again."
        }
        onRetry={refetch}
        onBack={() => router.push(`/editor/submissions/${submissionId}`)}
      />
    );
  }

  if (!documentData) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold capitalize">
            {documentData.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {documentData?.document_type} • View and Comment
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/editor/submissions/${submissionId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submission
        </Button>
      </div>

      <Card
        className={`flex flex-col ${
          documentData.file_name?.toLowerCase().endsWith(".pdf")
            ? "p-0 border-none"
            : ""
        }`}
      >
        {isLoading && <LoadingScreen />}
        <CardContent
          className={`${
            documentData.file_name?.toLowerCase().endsWith(".pdf") ? "p-0" : ""
          }`}
        >
          {documentData.file_name?.toLowerCase().endsWith(".pdf") ? (
            <PDFViewer
              fileUrl={documentData.file_url}
              fileName={documentData.file_name}
              showDownload={true}
              className="border rounded-lg"
            />
          ) : (
            <SuperDocEditor
              documentData={documentData}
              userData={userData}
              userRole="EDITOR"
              readOnly={true}
              commentsReadOnly={true}
              className="border rounded-lg"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
