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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Eye,
  Download,
  Upload,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  useCopyeditingFiles,
  useUploadCopyeditingFile,
  useApproveCopyeditingFile,
} from "../../hooks";

/**
 * Component to display copyedited files
 * Shows edited manuscript files with tracking and version history
 */
export function CopyeditedFiles({ submission, submissionId, assignmentId }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    file_type: "COPYEDITED",
    description: "",
    file: null,
  });

  // Fetch copyediting files
  const {
    data: filesData,
    isLoading,
    error,
  } = useCopyeditingFiles(
    {
      submission: submissionId,
      file_type: "COPYEDITED",
    },
    { enabled: !!submissionId }
  );

  const files = filesData?.results || [];

  // Upload file mutation
  const uploadMutation = useUploadCopyeditingFile();

  // Approve file mutation
  const approveMutation = useApproveCopyeditingFile();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = () => {
    if (!uploadData.file) {
      return;
    }

    const formData = new FormData();
    formData.append("submission", submissionId);
    if (assignmentId) {
      formData.append("assignment", assignmentId);
    }
    formData.append("file_type", uploadData.file_type);
    formData.append("description", uploadData.description);
    formData.append("file", uploadData.file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setIsUploadModalOpen(false);
        setUploadData({ file_type: "COPYEDITED", description: "", file: null });
      },
    });
  };

  const handleApprove = (fileId) => {
    approveMutation.mutate(fileId);
  };

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading files...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading copyedited files</p>
            </div>
          ) : files.length === 0 ? (
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
              {files &&
                files?.results?.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <FileText className="h-8 w-8 text-primary stroke-[1.5] shrink-0" />
                        {file.is_approved && (
                          <CheckCircle className="h-4 w-4 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">
                            {file.original_filename}
                          </p>
                          {file.version && (
                            <Badge variant="secondary" className="text-xs">
                              v{file.version}
                            </Badge>
                          )}
                          {file.is_approved && (
                            <Badge variant="success" className="text-xs">
                              Approved
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center">
                            {file.file_type_display || file.file_type}
                          </span>
                          {file.file_size && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                {(file.file_size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </>
                          )}
                          {file.created_at && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                {format(
                                  new Date(file.created_at),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        {file.uploaded_by && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded by: {file.uploaded_by.user?.first_name}{" "}
                            {file.uploaded_by.user?.last_name}
                          </p>
                        )}
                        {file.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                      {!file.is_approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(file.id)}
                          disabled={approveMutation.isPending}
                          title="Approve this file"
                        >
                          <CheckCircle className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDownload(file.id, file.original_filename)
                        }
                        title="Download file"
                      >
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Copyedited File</DialogTitle>
            <DialogDescription>
              Upload a file with copyediting changes applied
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the changes made..."
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadData.file || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
