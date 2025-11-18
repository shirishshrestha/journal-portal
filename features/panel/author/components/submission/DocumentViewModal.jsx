"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionDocuments } from "../../api/submissionsApi";

export default function DocumentViewModal({
  open,
  onOpenChange,
  submissionId,
}) {
  const router = useRouter();
  const {
    data: documents,
    isPending,
    error,
  } = useQuery({
    queryKey: ["submission-documents", submissionId],
    queryFn: () => getSubmissionDocuments(submissionId),
    enabled: open && !!submissionId,
  });

  const handleDownload = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleEdit = (docId) => {
    router.push(`/author/submissions/drafts/${submissionId}/editor/${docId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Documents</DialogTitle>
          <DialogDescription>
            View and download documents for this submission
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isPending && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <Card className="p-4 bg-destructive/10 border-destructive">
              <p className="text-sm text-destructive">
                Failed to load documents. Please try again.
              </p>
            </Card>
          )}

          {documents && documents.length === 0 && (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No documents found</p>
            </Card>
          )}

          {documents && documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {doc.document_type_display}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEdit(doc.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.file_url || doc.file)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
