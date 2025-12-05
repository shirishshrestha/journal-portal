"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Component to display submission documents
 */
export function SubmissionDocuments({ submission, submissionId }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Submitted manuscript files and supporting documents
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!submission.documents || submission.documents.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No documents found</h3>
            <p className="text-sm text-muted-foreground">
              This submission has no documents attached
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {submission.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary stroke-[1.5]" />
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{doc.document_type_display}</span>
                      <span>•</span>
                      <span>{doc.file_name}</span>
                      {doc.file_size && (
                        <>
                          <span>•</span>
                          <span>
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.file_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/editor/submissions/${submissionId}/documents/${doc.id}`
                        )
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                  {doc.original_file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.original_file, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
