"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSaveSuperdocDocument } from "../../hooks/mutation/useSaveSuperdocDocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Save, Send } from "lucide-react";
import "@harbour-enterprises/superdoc/style.css";
import { useCurrentRole } from "../../hooks";
import { useSubmitUpdatedDocument } from "@/features/panel";
import { ConfirmationInputPopup } from "..";
import { useParams, useRouter } from "next/navigation";

/**
 * SuperDoc Editor Component - Self-contained with save functionality
 * Handles document editing and saving internally
 */
export default function SuperDocEditor({
  documentData,
  userData,
  className = "",
  userRole = null,
  readOnly = false,
  commentsReadOnly = false,
}) {
  const superDocInstanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const router = useRouter();
  const { id } = useParams();

  const { currentRole } = useCurrentRole();
  const effectiveRole = userRole || currentRole;
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  // Submit mutation
  const submitMutation = useSubmitUpdatedDocument({
    documentId: documentData.id,
    onSuccess: () => {
      toast.success("Document version created successfully");
      router.push(`/author/submissions/drafts/${id}`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.detail || "Failed to create document version"
      );
    },
  });
  const handleSubmitClick = () => {
    setIsSubmitDialogOpen(true);
  };

  const handleSubmitConfirm = (changeSummary) => {
    submitMutation.mutate(changeSummary);
  };

  // Save mutation using custom hook
  const saveMutation = useSaveSuperdocDocument({
    onSuccess: () => {
      setHasUnsavedChanges(false);
      toast.success("Document saved successfully");
    },
  });

  // Handle save button click
  const handleSave = async () => {
    if (!superDocInstanceRef.current) {
      toast.error("Editor not ready");
      return;
    }

    if (!superDocInstanceRef.current.activeEditor) {
      toast.error("Editor not initialized");
      return;
    }

    try {
      // Export as DOCX blob
      const blob = await superDocInstanceRef.current.export({
        commentsType: "external",
        triggerDownload: false,
      });

      // Save using mutation hook
      saveMutation.mutate({
        documentId: documentData.id,
        payload: {
          blob,
          fileName: documentData.file_name,
        },
      });
    } catch (error) {
      console.error("Error preparing document:", error);
      toast.error("Failed to prepare document for saving");
    }
  };

  // Initialize SuperDoc editor
  useEffect(() => {
    if (!documentData || isInitializedRef.current) {
      return;
    }

    let mounted = true;

    const initializeEditor = async () => {
      try {
        const { SuperDoc } = await import("@harbour-enterprises/superdoc");

        if (!mounted) return;

        // Initialize SuperDoc
        const editor = new SuperDoc({
          selector: "#superdoc-editor",
          document: documentData.file_url,
          pagination: true,
          theme: "light",
          role: readOnly ? "viewer" : "editor",
          user: {
            name: userData?.first_name || "User",
            email: userData?.email || "user@example.com",
          },

          modules: {
            comments: { readOnly: commentsReadOnly },
            toolbar: readOnly
              ? false
              : {
                  selector: "#superdoc-toolbar",
                  excludeItems: [
                    "documentMode",
                    "acceptTrackedChangeBySelection",
                    "rejectTrackedChangeOnSelection",
                  ],
                },
          },
          onReady: () => {
            const superdocRoot = document.getElementById("superdoc-editor");
            if (superdocRoot) {
              superdocRoot.style.setProperty("color", "#222", "important");
              // Apply to all child elements to ensure text is always visible
              const allElements = superdocRoot.querySelectorAll("*");
              allElements.forEach((el) => {
                el.style.setProperty("color", "#222", "important");
              });
            }
            const toolbar = document.getElementById("toolbar");

            toast.success("Document loaded successfully");
          },
          onEditorUpdate: () => {
            setHasUnsavedChanges(true);
          },
          onError: (error) => {
            console.error("SuperDoc error:", error);
            toast.error("Failed to load document");
          },
        });

        superDocInstanceRef.current = editor;
        isInitializedRef.current = true;
      } catch (error) {
        console.error("Failed to initialize editor:", error);
        toast.error("Failed to initialize document editor");
      }
    };

    initializeEditor();

    return () => {
      mounted = false;
      if (superDocInstanceRef.current) {
        try {
          superDocInstanceRef.current.destroy?.();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        superDocInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData?.id]);

  return (
    <>
      {!readOnly && (
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
            {saveMutation.isPending && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </Badge>
            )}
          </div>
          <div>
            <Button
              variant="default"
              size="sm"
              className={"mr-2"}
              onClick={handleSave}
              disabled={saveMutation.isPending || !hasUnsavedChanges}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Document
            </Button>
            {documentData.can_edit && effectiveRole === "AUTHOR" && (
              <Button
                size="sm"
                variant={"secondary"}
                onClick={handleSubmitClick}
                disabled={submitMutation.isPending || hasUnsavedChanges}
              >
                {submitMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-4" />
                ) : (
                  <FileText className="h-4 w-4 mr-1" />
                )}
                Confirm Document
              </Button>
            )}
          </div>
        </div>
      )}

      {readOnly && (
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              View Only Mode
            </Badge>
          </div>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      <ConfirmationInputPopup
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        title="Ready to Create a New Version?"
        description="Confirming this document will create a new version. You won’t be able to edit it again until you submit it for a new review and the reviewer completes their evaluation."
        inputLabel="Change Summary"
        inputPlaceholder="Describe the changes made in this version..."
        confirmText="Submit"
        cancelText="Cancel"
        variant="primary"
        required={true}
        onConfirm={handleSubmitConfirm}
        isPending={submitMutation.isPending}
        isSuccess={submitMutation.isSuccess}
        loadingText="Submitting..."
        icon={<Send className="h-8 w-8 text-primary" />}
      />

      <div
        className={`${className} bg-white flex overflow-x-auto overflow-y-auto max-h-[95vh] flex-col `}
        id="superdoc__container"
      >
        {/* Save Button Header */}

        {/* Editor Container */}
        <div className="flex flex-col items-center relative w-full">
          <div
            id="superdoc-toolbar"
            className="bg-white border-b sticky left-0 top-0 z-4 border-gray-200 overflow-x-auto max-w-[300px]  md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-5xl"
          />
          <div
            id="superdoc-editor"
            className="text-black max-w-[320px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-5xl mx-auto"
            style={{
              minHeight: "600px",
              padding: "20px",
              background: "#fff",
              color: "#222",
            }}
          />
        </div>
      </div>
    </>
  );
}
