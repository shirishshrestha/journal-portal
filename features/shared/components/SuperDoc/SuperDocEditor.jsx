"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";
import "@harbour-enterprises/superdoc/style.css";

/**
 * SuperDoc Editor Component - Self-contained with save functionality
 * Handles document editing and saving internally
 */
export default function SuperDocEditor({
  documentData,
  userData,
  onSaveSuccess,
  className = "",
}) {
  const superDocInstanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!superDocInstanceRef.current) {
        throw new Error("Editor not initialized");
      }

      if (!superDocInstanceRef.current.activeEditor) {
        throw new Error("Editor not ready");
      }

      // Get document content in different formats
      const json = superDocInstanceRef.current.activeEditor.getJSON();
      const html = superDocInstanceRef.current.activeEditor.getHTML();

      // Export as DOCX blob
      const blob = await superDocInstanceRef.current.export({
        isFinalDoc: false,
        commentsType: "external",
        triggerDownload: false,
      });

      // Create FormData to send to backend
      const formData = new FormData();
      formData.append("document", blob, documentData.file_name);
      formData.append("json", JSON.stringify(json));
      formData.append("html", html);

      // Use instance for authenticated requests
      const { instance } = await import("@/lib/instance");
      const response = await instance.post(
        `submissions/documents/${documentData.id}/export/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      setHasUnsavedChanges(false);
      toast.success("Document saved successfully");
      if (onSaveSuccess) {
        onSaveSuccess(data);
      }
    },
    onError: (error) => {
      const message =
        error?.message ||
        error?.response?.data?.detail ||
        "Failed to save document";
      toast.error(message);
    },
  });

  // Handle save button click
  const handleSave = () => {
    if (!superDocInstanceRef.current) {
      toast.error("Editor not ready");
      return;
    }
    saveMutation.mutate();
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
            toolbar: { selector: "#superdoc-toolbar" },
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
      <div className={`${className} bg-white flex flex-col`}>
        {/* Save Button Header */}

        {/* Editor Container */}
        <div className="flex flex-col items-center">
          <div
            id="superdoc-toolbar"
            className="bg-white border-b border-gray-200 overflow-x-auto max-w-5xl w-fit"
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
