"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, History, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  DocumentUploadModal,
  DocumentVersionsModal,
} from "@/features/panel/author";

/**
 * Component to display draft files in copyediting workflow
 * Shows original submission files for copyeditor reference
 */
export function CopyeditingDraftFiles({ submission, submissionId }) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const handleViewVersions = (docId) => {
    setSelectedDocumentId(docId);
    setIsVersionModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Draft Files</CardTitle>
              <CardDescription>
                Original submission files provided by the author. These serve as
                the base for copyediting.
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              size="sm"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!submission?.documents || submission.documents.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No draft files found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload the original submission files to begin copyediting
              </p>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload First File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {submission.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-primary stroke-[1.5] shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="inline-flex items-center">
                          {doc.document_type_display || doc.document_type}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span
                          className="truncate max-w-[200px]"
                          title={doc.file_name}
                        >
                          {doc.file_name}
                        </span>
                        {doc.file_size && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </>
                        )}
                        {doc.uploaded_at && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersions(doc.id)}
                      title="View version history"
                    >
                      <History className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Versions</span>
                    </Button>

                    {doc.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/editor/submissions/${submissionId}/documents/${doc.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    )}

                    {doc.original_file && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.original_file, "_blank")}
                      >
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <DocumentUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        submissionId={submissionId}
      />

      {/* Version History Modal */}
      {selectedDocumentId && (
        <DocumentVersionsModal
          open={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          documentId={selectedDocumentId}
        />
      )}
    </>
  );
}
