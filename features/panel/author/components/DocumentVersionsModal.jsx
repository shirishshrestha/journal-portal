"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, User, Hash } from "lucide-react";
import { format } from "date-fns";
import { LoadingScreen, useDownloadDocument } from "@/features";
import { useGetDocumentVersions } from "../hooks";

export default function DocumentVersionsModal({
  open,
  onOpenChange,
  documentId,
}) {
  const {
    data: versions,
    isPending: loading,
    error,
    refetch,
  } = useGetDocumentVersions(documentId, open);

  const downloadMutation = useDownloadDocument();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[55%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Version History</DialogTitle>
          <DialogDescription>
            {versions
              ? `${versions.total_versions} version${
                  versions.total_versions !== 1 ? "s" : ""
                } available for ${versions.document_title}`
              : "Loading versions..."}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="py-8">
            <LoadingScreen />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">
              {error.message || "Failed to load versions"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && versions && (
          <div className="space-y-4">
            {versions.versions.map((version, index) => (
              <div key={version.id}>
                <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">
                        Version {version.version_number}
                      </h3>
                      {version.is_current && (
                        <Badge variant="default">Current</Badge>
                      )}
                      {version.immutable_flag && (
                        <Badge variant="secondary">Locked</Badge>
                      )}
                    </div>

                    {version.change_summary && (
                      <p className="text-sm text-muted-foreground">
                        {version.change_summary}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(version.created_at), "PPp")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{version.created_by.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {version.file_name} (
                          {(version.file_size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="truncate" title={version.file_hash}>
                          {version.file_hash.substring(0, 16)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {version.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadMutation.mutate({
                            url: `submissions/documents/versions/${version.id}/download/`,
                            fileName: version.file_name,
                          })
                        }
                        disabled={downloadMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>

                {index < versions.versions.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}

            {versions.versions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No versions found for this document
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
