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
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  { value: "MANUSCRIPT", label: "Manuscript" },
  { value: "COVER_LETTER", label: "Cover Letter" },
  { value: "REVISION", label: "Revision" },
];

export default function DocumentUploadModal({
  open,
  onOpenChange,
  submissionId,
}) {
  const [formData, setFormData] = useState({
    title: "",
    document_type: "",
    description: "",
    file: null,
  });

  const uploadMutation = useUploadDocument();
  const isPending = uploadMutation.isPending;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = () => {
    if (
      !formData.title ||
      !formData.document_type ||
      !formData.description ||
      !formData.file
    ) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("document_type", formData.document_type);
    data.append("description", formData.description);
    data.append("file", formData.file);

    uploadMutation.mutate(
      { id: submissionId, data },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            title: "",
            document_type: "",
            description: "",
            file: null,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for your submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter document title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type *</Label>
            <Select
              value={formData.document_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, document_type: value }))
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
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              disabled={isPending}
            />
            {formData.file && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.file.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
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
