"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { File, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyeditingAssignments, useCopyeditingFiles } from "../../hooks";
import DataTable from "@/features/shared/components/DataTable";

export function ProductionReadyFilesFromCopyediting({ submissionId }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get the copyediting assignment for this submission to fetch completed files
  const { data: copyeditingData, isLoading } = useCopyeditingAssignments({
    submission: submissionId,
  });

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

  // DataTable columns definition
  const columns = [
    {
      key: "original_filename",
      header: "File Name",
      cellClassName: "font-medium",
      render: (row) => (
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-xs">
            {row.original_filename || "Untitled"}
          </span>
        </div>
      ),
    },
    {
      key: "file_type",
      header: "Type",
      render: (row) => (
        <Badge variant="secondary" className="text-xs">
          {row.file_type === "AUTHOR_FINAL" ? "Author Final" : "Final"}
        </Badge>
      ),
    },
    {
      key: "uploaded_by",
      header: "Uploaded By",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.uploaded_by?.display_name ||
            row.uploaded_by?.user_name ||
            row.uploaded_by?.user_email ||
            "Unknown"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.created_at
            ? format(new Date(row.created_at), "MMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.file_url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDownload(row.file_url, row.original_filename)
              }
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="gap-3">
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
          {/* DataTable for files */}
        </CardContent>
      </Card>
      <DataTable
        data={filteredFiles}
        columns={columns}
        emptyMessage={
          !copyeditingAssignment
            ? "No Copyediting Completed. Files from the copyediting stage will appear here once copyediting is completed."
            : searchQuery
            ? "No files match your search criteria."
            : "Production ready files will appear here once copyediting is completed and files are marked as final."
        }
        isPending={isLoading}
        hoverable={true}
        tableClassName="bg-card border flex justify-center"
      />
    </>
  );
}
