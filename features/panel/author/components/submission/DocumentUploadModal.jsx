"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Upload } from "lucide-react";
import { useUploadDocument } from "../../hooks/mutation/useUploadDocument";
import { useMutation } from "@tanstack/react-query";
import { saveYjsState } from "../../api/superdocApi";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  { value: "MANUSCRIPT", label: "Manuscript" },
  { value: "SUPPLEMENTARY", label: "Supplementary Material" },
  { value: "COVER_LETTER", label: "Cover Letter" },
  { value: "REVIEWER_RESPONSE", label: "Response to Reviewers" },
  { value: "REVISED_MANUSCRIPT", label: "Revised Manuscript" },
  { value: "FINAL_VERSION", label: "Final Version" },
];

export default function DocumentUploadModal({
  open,
  onOpenChange,
  submissionId,
}) {
  const [document, setDocument] = useState({
    title: "",
    document_type: "MANUSCRIPT",
    description: "",
    file: null,
  });

  const uploadMutation = useUploadDocument();

  // Mutation to initialize Yjs state after document upload
  const initYjsStateMutation = useMutation({
    mutationFn: ({ documentId, yjsState }) =>
      saveYjsState(documentId, yjsState),
    onSuccess: () => {
      toast.success("Document initialized successfully");
    },
    onError: (error) => {
      console.error("Failed to initialize Yjs state:", error);
      toast.error("Document uploaded but failed to initialize editor state");
    },
  });

  const isPending = uploadMutation.isPending || initYjsStateMutation.isPending;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (
      !document.title ||
      !document.document_type ||
      !document.description ||
      !document.file
    ) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    const data = new FormData();
    data.append("title", document.title);
    data.append("document_type", document.document_type);
    data.append("description", document.description);
    data.append("file", document.file);

    try {
      uploadMutation.mutateAsync({
        id: submissionId,
        data,
      });

      // Reset form and close modal
      setDocument({
        title: "",
        document_type: "MANUSCRIPT",
        description: "",
        file: null,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to upload document");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Add one or more documents to your submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter document title"
              value={document.title}
              onChange={(e) =>
                setDocument((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type *</Label>
            <Select
              value={document.document_type}
              onValueChange={(value) =>
                setDocument((prev) => ({ ...prev, document_type: value }))
              }
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter document description"
              value={document.description}
              onChange={(e) =>
                setDocument((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-input">File *</Label>
            <Input
              id="file-input"
              type="file"
              accept=".docx,.pdf,.doc"
              onChange={handleFileChange}
              disabled={isPending}
            />
            {document.file && (
              <p className="text-sm text-muted-foreground">
                Selected: {document.file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isPending}>
            <Upload className="mr-2 h-4 w-4" />
            {isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
