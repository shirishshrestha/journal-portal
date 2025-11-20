"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSaveSuperdocDocument } from "../../hooks/mutation/useSaveSuperdocDocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";
import "@harbour-enterprises/superdoc/style.css";
import { useCurrentRole } from "../../hooks";

/**
 * SuperDoc Editor Component - Self-contained with save functionality
 * Handles document editing and saving internally
 */
export default function SuperDocEditor({
  documentData,
  userData,
  className = "",
}) {
  const superDocInstanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { currentRole } = useCurrentRole();

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
          user: {
            name: userData?.name || "User",
            email: userData?.email || "user@example.com",
          },
          modules: {
            comments: { enabled: true },
            toolbar: {
              selector: "#superdoc-toolbar",
              excludeItems: ["documentMode"],
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
        <Button
          variant="default"
          size="sm"
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
      </div>
      <div
        className={`${className} bg-white flex overflow-y-auto max-h-[95vh] flex-col`}
        id="superdoc__container"
      >
        {/* Save Button Header */}

        {/* Editor Container */}
        <div className="flex flex-col items-center relative">
          <div
            id="superdoc-toolbar"
            className="bg-white border-b sticky top-0 z-4  border-gray-200  overflow-x-auto max-w-5xl w-fit"
          />
          <div
            id="superdoc-editor"
            className="text-black w-fit"
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
