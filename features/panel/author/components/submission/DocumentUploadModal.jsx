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
import { Upload, X, FileText, Plus } from "lucide-react";
import { useUploadDocument } from "../../hooks/mutation/useUploadDocument";
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
  // Current document being added
  const [currentDocument, setCurrentDocument] = useState({
    title: "",
    document_type: "MANUSCRIPT",
    description: "",
    file: null,
  });

  // List of documents to upload
  const [documentsToUpload, setDocumentsToUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useUploadDocument();
  const isPending = uploadMutation.isPending;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentDocument((prev) => ({ ...prev, file }));
    }
  };

  const handleAddDocument = () => {
    if (
      !currentDocument.title ||
      !currentDocument.document_type ||
      !currentDocument.description ||
      !currentDocument.file
    ) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    // Add document to upload list
    setDocumentsToUpload((prev) => [...prev, { ...currentDocument, id: Date.now() }]);
    
    // Reset current document form
    setCurrentDocument({
      title: "",
      document_type: "MANUSCRIPT",
      description: "",
      file: null,
    });

    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";

    toast.success("Document added to upload queue");
  };

  const handleRemoveDocument = (id) => {
    setDocumentsToUpload((prev) => prev.filter((doc) => doc.id !== id));
    toast.success("Document removed from queue");
  };

  const handleUploadAll = async () => {
    if (documentsToUpload.length === 0) {
      toast.error("No documents to upload");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const doc of documentsToUpload) {
      const data = new FormData();
      data.append("title", doc.title);
      data.append("document_type", doc.document_type);
      data.append("description", doc.description);
      data.append("file", doc.file);

      try {
        await uploadMutation.mutateAsync({ id: submissionId, data });
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} document(s) uploaded successfully`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} document(s) failed to upload`);
    }

    if (failCount === 0) {
      // Close modal and reset state
      setDocumentsToUpload([]);
      setCurrentDocument({
        title: "",
        document_type: "MANUSCRIPT",
        description: "",
        file: null,
      });
      onOpenChange(false);
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

        <div className="space-y-6 py-4">
          {/* Documents to Upload List */}
          {documentsToUpload.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Documents to Upload ({documentsToUpload.length})</Label>
              </div>
              <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
                {documentsToUpload.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start justify-between gap-4 p-3 bg-background border rounded-lg"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{doc.description}</p>
                        <p className="text-xs text-muted-foreground">File: {doc.file.name}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDocument(doc.id)}
                      disabled={isUploading}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Document Form */}
          <div className="space-y-4 border rounded-lg p-4">
            <Label className="text-base font-semibold">Add New Document</Label>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={currentDocument.title}
                onChange={(e) =>
                  setCurrentDocument((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_type">Document Type *</Label>
              <Select
                value={currentDocument.document_type}
                onValueChange={(value) =>
                  setCurrentDocument((prev) => ({ ...prev, document_type: value }))
                }
                disabled={isUploading}
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
                value={currentDocument.description}
                onChange={(e) =>
                  setCurrentDocument((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={isUploading}
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
                disabled={isUploading}
              />
              {currentDocument.file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {currentDocument.file.name}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddDocument}
              disabled={isUploading}
              variant="outline"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Document to Queue
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUploadAll} 
            disabled={isUploading || documentsToUpload.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading 
              ? "Uploading..." 
              : `Upload ${documentsToUpload.length} Document${documentsToUpload.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
