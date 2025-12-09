"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  File,
  Download,
  Eye,
  Upload,
  Search,
  Loader2,
  CheckCircle2,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApproveProductionFile, useUploadProductionFile } from "../../hooks";

/**
 * Component to manage production galley files
 * Displays galleys in different formats (PDF, HTML, XML, EPUB, etc.)
 */
export function ProductionGalleys({ submission, submissionId, assignmentId }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    galley_format: "PDF",
    label: "PDF",
    description: "",
    file: null,
  });

  // Fetch production galley files
  const {
    data: files = [],
    isLoading,
    error,
  } = useProductionFiles(assignmentId, {
    file_type: "GALLEY",
  });

  // Mutations
  const uploadMutation = useUploadProductionFile(assignmentId);
  const approveMutation = useApproveProductionFile(assignmentId);
  const publishMutation = usePublishProductionFile(assignmentId);

  const resetUploadForm = () => {
    setUploadData({
      galley_format: "PDF",
      label: "PDF",
      description: "",
      file: null,
    });
  };

  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    resetUploadForm();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = () => {
    if (!uploadData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("file_type", "GALLEY");
    formData.append("galley_format", uploadData.galley_format);
    if (uploadData.description) {
      formData.append("description", uploadData.description);
    }

    uploadMutation.mutate(formData, {
      onSuccess: handleUploadSuccess,
    });
  };

  const handleFormatChange = (format) => {
    setUploadData((prev) => ({
      ...prev,
      galley_format: format,
      label: format,
    }));
  };

  const filteredFiles = files?.results?.filter((file) =>
    file.original_filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "PDF":
        return <FileText className="h-4 w-4" />;
      case "HTML":
        return <Globe className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Galley Files</CardTitle>
              <CardDescription className="mt-1">
                Final publication-ready files in various formats
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={!assignmentId}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Galley
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search galley files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Files Table */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading galley files</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <File className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No galley files</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                {searchQuery
                  ? "No files match your search criteria."
                  : "Upload galley files in different formats (PDF, HTML, XML, EPUB) for publication."}
              </p>
              {!searchQuery && assignmentId && (
                <Button
                  onClick={() => setIsUploadDialogOpen(true)}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Galley
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Format</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFormatIcon(file.galley_format)}
                        <Badge variant="secondary">
                          {file.galley_format_display || file.galley_format}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{file.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.original_filename}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>v{file.version}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {format(new Date(file.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-muted-foreground">
                          {file.uploaded_by?.user?.first_name}{" "}
                          {file.uploaded_by?.user?.last_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {file.is_published ? (
                          <Badge variant="success" className="w-fit">
                            <Globe className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : file.is_approved ? (
                          <Badge variant="outline" className="w-fit">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="w-fit">
                            Pending Review
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(file.file_url)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDownload(
                              file.file_url,
                              file.original_filename
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!file.is_approved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => approveMutation.mutate(file.id)}
                            disabled={approveMutation.isPending}
                          >
                            {approveMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                        )}
                        {file.is_approved && !file.is_published && (
                          <Button
                            size="sm"
                            onClick={() => publishMutation.mutate(file.id)}
                            disabled={publishMutation.isPending}
                          >
                            {publishMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Publish"
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Galley File</DialogTitle>
            <DialogDescription>
              Upload a publication-ready galley file in a specific format
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={uploadData.galley_format}
                onValueChange={handleFormatChange}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="EPUB">EPUB</SelectItem>
                  <SelectItem value="MOBI">MOBI</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={uploadData.label}
                onChange={(e) =>
                  setUploadData((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="e.g., PDF, Full Text HTML"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.html,.xml,.epub,.mobi"
              />
              {uploadData.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadData.file.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Add notes about this galley file..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                resetUploadForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadData.file || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
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
