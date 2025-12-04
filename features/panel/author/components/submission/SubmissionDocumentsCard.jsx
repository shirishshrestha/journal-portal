/**
 * SubmissionDocumentsCard - Displays and manages submission documents with edit/view capabilities
 * @module features/panel/author/components/submission/SubmissionDocumentsCard
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Edit, History } from "lucide-react";
import Link from "next/link";

/**
 * @param {Object} props
 * @param {Object} props.submission - Submission data
 * @param {Function} [props.onUpload] - Upload handler (for drafts)
 * @param {Function} [props.onViewVersions] - View versions handler (for drafts)
 * @param {Function} [props.onViewDocument] - View document handler (for unassigned/other statuses)
 * @param {string} [props.editBasePath] - Base path for edit link (e.g., "/author/submissions/drafts" or "/author/submissions/unassigned")
 * @param {boolean} [props.isEditable] - Whether documents can be edited
 */
export default function SubmissionDocumentsCard({
  submission,
  onUpload,
  onViewVersions,
  editBasePath,
  isEditable = false,
}) {
  const submissionId = submission?.id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              {isEditable
                ? "Manage manuscript files and supporting documents"
                : "Submitted manuscript files and supporting documents"}
            </CardDescription>
          </div>
          {isEditable && onUpload && (
            <Button onClick={onUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!submission?.documents || submission.documents.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">
              {isEditable ? "No documents uploaded" : "No documents found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isEditable
                ? "Upload your manuscript and supporting documents to submit for review"
                : "This submission has no documents attached"}
            </p>
            {isEditable && onUpload && (
              <Button onClick={onUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload First Document
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary stroke-[1.5px]" />
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
                <div className="flex gap-2">
                  {isEditable &&
                    !doc.file_name?.toLowerCase().endsWith(".pdf") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewVersions(doc.id)}
                      >
                        <History className="h-4 w-4 mr-1 stroke-[1.5px]" />
                        Versions
                      </Button>
                    )}
                  {isEditable && editBasePath && (
                    <Link
                      href={`${editBasePath}/${submissionId}/editor/${doc.id}`}
                    >
                      <Button
                        variant="outline"
                        className="font-medium"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1 stroke-[1.5px]" />
                        {doc.file_name?.toLowerCase().endsWith(".pdf")
                          ? "View"
                          : "Edit"}
                      </Button>
                    </Link>
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
