"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Save,
  Download,
  AlertCircle,
  FileText,
  Send,
  MessageSquare,
  User,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loadDocument,
  saveYjsState,
  downloadDocx,
  submitUpdatedDocument,
  getReviewComments,
} from "../../api/superdocApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function SuperDocEditorModal({
  open,
  onOpenChange,
  documentId,
  submissionId,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);
  const userRole = userData?.roles?.[0] || "AUTHOR";

  // Load document data
  const {
    data: documentData,
    isPending: isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["superdoc-document", documentId],
    queryFn: () => loadDocument(documentId),
    enabled: open && !!documentId,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: ({ docId, yjsState }) => saveYjsState(docId, yjsState),
    onSuccess: () => {
      toast.success("Document saved successfully");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to save document");
      setIsSaving(false);
    },
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (docId) => downloadDocx(docId),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentData?.file_name || "document.docx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document downloaded successfully");
    },
    onError: () => {
      toast.error("Failed to download document");
    },
  });

  // Query to load review comments
  const { data: commentsData } = useQuery({
    queryKey: ["review-comments", submissionId],
    queryFn: () => getReviewComments(submissionId),
    enabled: !!submissionId && open,
  });

  // Submit mutation for notifying reviewers
  const submitMutation = useMutation({
    mutationFn: () => submitUpdatedDocument(documentId, submissionId),
    onSuccess: () => {
      toast.success(
        "Document submitted successfully! Reviewer has been notified."
      );
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({
        queryKey: ["superdoc-document", documentId],
      });
      setHasUnsavedChanges(false);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to submit document");
    },
  });

  // Handler functions
  const handleSave = useCallback((silent = false) => {
    // Placeholder: In production, implement SuperDoc Yjs state extraction
    // const yjsState = editorRef.current?.getYjsState();
    // const base64State = btoa(String.fromCharCode.apply(null, new Uint8Array(yjsState)));
    // saveMutation.mutate({ docId: documentId, yjsState: base64State });

    if (!silent) {
      toast.info("Manual save - SuperDoc library integration pending");
    }
    setHasUnsavedChanges(false);
  }, []);

  const handleDownload = () => {
    downloadMutation.mutate(documentId);
  };

  const handleSubmit = () => {
    if (hasUnsavedChanges) {
      toast.error("Please save your changes before submitting");
      return;
    }
    submitMutation.mutate();
  };

  const handleEditorChange = () => {
    setHasUnsavedChanges(true);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!documentData?.can_edit || !open) return;

    autoSaveIntervalRef.current = setInterval(() => {
      if (hasUnsavedChanges && editorRef.current) {
        handleSave(true); // Silent save
      }
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [hasUnsavedChanges, documentData, open, handleSave]);

  const reviewComments = commentsData?.results || [];
  const hasComments = reviewComments.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {documentData?.title || "Document Editor"}
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2">
                Unsaved Changes
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {documentData?.can_edit
              ? "Edit your document below. Changes are auto-saved every 30 seconds."
              : "View-only mode. You don't have permission to edit this document."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {loadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load document: {loadError.message}
              </AlertDescription>
            </Alert>
          )}

          {documentData && (
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Main Editor Area */}
              <div className="col-span-2 space-y-4">
                {/* Document Info */}
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">File:</span>{" "}
                      {documentData.file_name}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>{" "}
                      {(documentData.file_size / 1024).toFixed(2)} KB
                    </div>
                    <div>
                      <span className="font-medium">Last Edited:</span>{" "}
                      {new Date(documentData.last_edited_at).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">By:</span>{" "}
                      {documentData?.last_edited_by?.name}
                    </div>
                  </div>
                </div>

                {/* SuperDoc Editor Placeholder */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center">
                  <div className="space-y-3 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto" />
                    <h3 className="font-semibold text-lg">SuperDoc Editor</h3>
                    <p className="text-sm max-w-md">
                      Collaborative DOCX editor will be initialized here.
                      <br />
                      Install SuperDoc library:{" "}
                      <code className="bg-muted px-2 py-1 rounded">
                        npm install @superdoc/editor
                      </code>
                    </p>
                    {documentData.file_url && (
                      <p className="text-xs">
                        <strong>Document URL:</strong> {documentData.file_url}
                      </p>
                    )}
                    {documentData.yjs_state && (
                      <p className="text-xs text-green-600">
                        ✓ Yjs state available for collaborative editing
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Sidebar */}
              <div className="border rounded-lg p-4 bg-muted/30 overflow-y-auto max-h-[600px]">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="font-semibold">Reviewer Comments</h3>
                  {hasComments && (
                    <Badge variant="secondary">{reviewComments.length}</Badge>
                  )}
                </div>
                <Separator className="mb-4" />

                {!hasComments ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No reviewer comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 bg-background border rounded-lg space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.reviewer_name || "Reviewer"}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {comment.recommendation || "Review"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                comment.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {comment.review_text && (
                          <div className="pl-6">
                            <p className="text-sm whitespace-pre-wrap">
                              {comment.review_text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!documentData || downloadMutation.isPending}
            >
              {downloadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download
            </Button>
            {documentData?.can_edit && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={saveMutation.isPending || !hasUnsavedChanges}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending || hasUnsavedChanges}
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit for Review
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
