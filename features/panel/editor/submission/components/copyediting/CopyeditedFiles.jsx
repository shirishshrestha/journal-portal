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
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Download,
  History,
  Upload,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  DocumentUploadModal,
  DocumentVersionsModal,
} from "@/features/panel/author";

/**
 * Component to display copyedited files
 * Shows edited manuscript files with tracking and version history
 */
export function CopyeditedFiles({ submission, submissionId }) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const handleViewVersions = (docId) => {
    setSelectedDocumentId(docId);
    setIsVersionModalOpen(true);
  };

  // Filter for copyedited files (REVISED_MANUSCRIPT, FINAL_VERSION types)
  const copyeditedDocs =
    submission?.documents?.filter(
      (doc) =>
        doc.document_type === "REVISED_MANUSCRIPT" ||
        doc.document_type === "FINAL_VERSION" ||
        doc.document_type === "COPYEDITED"
    ) || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Copyedited Files</CardTitle>
              <CardDescription>
                Manuscript files with copyediting changes applied. Upload edited
                versions here.
              </CardDescription>
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)} size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Copyedited File
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {copyeditedDocs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No copyedited files yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload files with copyediting changes applied
              </p>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Copyedited File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {copyeditedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <FileText className="h-8 w-8 text-primary stroke-[1.5] shrink-0" />
                      <CheckCircle className="h-4 w-4 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{doc.title}</p>
                        {doc.version_number && (
                          <Badge variant="secondary" className="text-xs">
                            v{doc.version_number}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
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
                        {doc.last_modified_at && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span title="Last modified">
                              Modified{" "}
                              {format(
                                new Date(doc.last_modified_at),
                                "MMM d, yyyy HH:mm"
                              )}
                            </span>
                          </>
                        )}
                      </div>
                      {doc.last_edited_by && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Edited by:{" "}
                          {doc.last_edited_by.name || doc.last_edited_by.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersions(doc.id)}
                      title="View all versions and changes"
                    >
                      <History className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">History</span>
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

          {copyeditedDocs.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
              <h4 className="font-medium text-sm mb-2">Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  Use the History button to compare versions and track changes
                </li>
                <li>View files in SuperDoc for collaborative editing</li>
                <li>Download the final version to share with authors</li>
              </ul>
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
