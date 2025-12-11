"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { File, Download, Eye, Upload, Search, Loader2 } from "lucide-react";
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

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useApproveProductionFile,
  useProductionFiles,
  useUploadProductionFile,
  useProductionAssignments,
} from "../../hooks";

export function ProductionReadyFiles({ submissionId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    file_type: "GALLEY",
    galley_format: "PDF",
    label: "",
    description: "",
    file: null,
  });

  // Get the production assignment for this submission
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useProductionAssignments({ submission: submissionId });

  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  // Fetch files from API
  const {
    data: filesData,
    isLoading: filesLoading,
    error,
  } = useProductionFiles(
    { submission: submissionId },
    { enabled: !!submissionId }
  );

  // Mutations
  const uploadMutation = useUploadProductionFile();
  const approveMutation = useApproveProductionFile();

  const files = filesData?.results || [];
  const isLoading = assignmentsLoading || filesLoading;

  const filteredFiles = files.filter((file) =>
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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUpload = () => {
    if (!uploadData.file) {
      toast.error("Please select a file");
      return;
    }

    if (!uploadData.label) {
      toast.error("Please enter a label for the galley");
      return;
    }

    if (!assignmentId) {
      toast.error("No production assignment found");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("file_type", uploadData.file_type);
    formData.append("galley_format", uploadData.galley_format);
    formData.append("label", uploadData.label);
    formData.append("assignment", assignmentId);
    formData.append("submission", submissionId);

    if (uploadData.description) {
      formData.append("description", uploadData.description);
    }

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setIsUploadDialogOpen(false);
        setUploadData({
          file_type: "GALLEY",
          galley_format: "PDF",
          label: "",
          description: "",
          file: null,
        });
      },
    });
  };

  const handleApprove = (fileId) => {
    approveMutation.mutate(fileId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Production Ready Files</CardTitle>
              <CardDescription className="mt-1">
                Files prepared during copyediting, ready for final production
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
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
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No files available</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery
                  ? "No files match your search criteria."
                  : "Production ready files will appear here once they are uploaded from the copyediting stage."}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file, index) => (
                    <TableRow key={file.id || index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-xs">
                            {file.original_filename || file.label || "Untitled"}
                          </span>
                          {file.galley_format && (
                            <Badge variant="secondary" className="text-xs">
                              {file.galley_format}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {file.uploaded_by?.user?.first_name}{" "}
                          {file.uploaded_by?.user?.last_name || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {file.created_at
                            ? format(new Date(file.created_at), "MMM d, yyyy")
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {file.file_url && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(file.file_url)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDownload(
                                    file.file_url,
                                    file.original_filename
                                  )
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Production File (Galley)</DialogTitle>
            <DialogDescription>
              Upload galley files ready for publication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.html,.xml,.epub,.mobi"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, HTML, XML, EPUB, MOBI
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                placeholder="e.g., PDF, Full Text HTML"
                value={uploadData.label}
                onChange={(e) =>
                  setUploadData({ ...uploadData, label: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Display label for this galley file
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="galley-format">Galley Format</Label>
              <select
                id="galley-format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={uploadData.galley_format}
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    galley_format: e.target.value,
                  })
                }
              >
                <option value="PDF">PDF</option>
                <option value="HTML">HTML</option>
                <option value="XML">XML</option>
                <option value="EPUB">EPUB</option>
                <option value="MOBI">MOBI</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add notes about this file..."
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
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={
                !uploadData.file ||
                !uploadData.label ||
                uploadMutation.isPending
              }
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
