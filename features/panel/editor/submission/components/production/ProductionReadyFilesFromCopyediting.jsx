"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { File, Download, Eye, Search, Upload } from "lucide-react";
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
import { useCopyeditingAssignments, useCopyeditingFiles } from "../../hooks";

export function ProductionReadyFilesFromCopyediting({ submissionId }) {
  const [searchQuery, setSearchQuery] = useState("");

  console.log(
    "Submission ID in ProductionReadyFilesFromCopyediting:",
    submissionId
  );

  // Get the copyediting assignment for this submission to fetch completed files
  const { data: copyeditingData, isLoading } = useCopyeditingAssignments({
    submission: submissionId,
  });

  console.log(
    "Copyediting Data in ProductionReadyFilesFromCopyediting:",
    copyeditingData
  );

  const copyeditingAssignment = copyeditingData?.results?.[0];

  const {
    data: filesData,
    isPending: isFilesPending,
    error,
  } = useCopyeditingFiles(
    {
      assignmentId: copyeditingAssignment?.id,
    },
    { enabled: !!copyeditingData }
  );

  console.log("Files Data in ProductionReadyFilesFromCopyediting:", filesData);

  // Use filesData from useCopyeditingFiles, filter for FINAL or AUTHOR_FINAL
  const productionReadyFiles =
    filesData?.filter(
      (file) => file.file_type === "FINAL" || file.file_type === "AUTHOR_FINAL"
    ) || [];

  const filteredFiles = productionReadyFiles.filter((file) =>
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Production Ready Files</CardTitle>
            <CardDescription className="mt-1">
              Final copyedited files ready to be used for creating galleys
            </CardDescription>
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
        ) : !copyeditingAssignment ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <File className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Copyediting Completed
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Files from the copyediting stage will appear here once copyediting
              is completed.
            </p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <File className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files available</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchQuery
                ? "No files match your search criteria."
                : "Production ready files will appear here once copyediting is completed and files are marked as final."}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
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
                          {file.original_filename || "Untitled"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {file.file_type === "AUTHOR_FINAL"
                          ? "Author Final"
                          : "Final"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {file.uploaded_by?.display_name ||
                          file.uploaded_by?.user_name ||
                          file.uploaded_by?.user_email ||
                          "Unknown"}
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
  );
}
