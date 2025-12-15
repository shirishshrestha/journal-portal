"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";
import "@harbour-enterprises/superdoc/style.css";
import {
  loadProductionFile,
  saveProductionFile,
} from "@/features/panel/editor/submission/api";

/**
 * Production SuperDoc Editor Component
 * Specialized SuperDoc editor for production files (galley creation/editing)
 *
 * Features:
 * - Loads production files via GET /api/v1/submissions/production/files/{id}/load/
 * - Saves files via POST /api/v1/submissions/production/files/{id}/save/
 * - Manual save workflow for production-ready files and galleys
 * - Tracks last_edited_by and last_edited_at
 */
export default function ProductionSuperDocEditor({
  fileId,
  userData,
  className = "",
  readOnly = false,
  commentsReadOnly = false,
  onSaveSuccess,
}) {
  const queryClient = useQueryClient();
  const superDocInstanceRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load file mutation
  const loadFileMutation = useMutation({
    mutationFn: () => loadProductionFile(fileId),
    onSuccess: (data) => {
      setFileData(data);
      setIsLoading(false);
      toast.success("File loaded successfully");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error?.response?.data?.detail || "Failed to load file");
    },
  });

  // Save file mutation
  const saveMutation = useMutation({
    mutationFn: (formData) => saveProductionFile(fileId, formData),
    onSuccess: (data) => {
      setHasUnsavedChanges(false);
      setFileData(data.file); // Update file data with new last_edited info
      toast.success("File saved successfully");

      // Invalidate queries to refresh file lists
      queryClient.invalidateQueries({
        queryKey: ["production-files"],
      });

      if (onSaveSuccess) {
        onSaveSuccess(data.file);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || "Failed to save file");
    },
  });

  // Load file on mount
  useEffect(() => {
    if (fileId) {
      loadFileMutation.mutate();
    }
  }, [fileId]);

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

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", blob, fileData.original_filename);

      // Save using mutation
      saveMutation.mutate(formData);
    } catch (error) {
      console.error("Error preparing document:", error);
      toast.error("Failed to prepare document for saving");
    }
  };

  // Initialize SuperDoc editor
  useEffect(() => {
    if (!fileData || isInitializedRef.current) {
      return;
    }

    let mounted = true;

    const initializeEditor = async () => {
      try {
        const { SuperDoc } = await import("@harbour-enterprises/superdoc");

        if (!mounted) return;

        // Initialize SuperDoc
        const editor = new SuperDoc({
          selector: "#production-superdoc-editor",
          document: fileData.file_url,
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
                  selector: "#production-superdoc-toolbar",
                  excludeItems: [
                    "documentMode",
                    "acceptTrackedChangeBySelection",
                    "rejectTrackedChangeOnSelection",
                  ],
                },
          },
          onReady: () => {
            const superdocRoot = document.getElementById(
              "production-superdoc-editor"
            );
            if (superdocRoot) {
              superdocRoot.style.setProperty("color", "#222", "important");
              const allElements = superdocRoot.querySelectorAll("*");
              allElements.forEach((el) => {
                el.style.setProperty("color", "#222", "important");
              });
            }
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
  }, [fileData?.id, readOnly, commentsReadOnly, userData]);

  if (isLoading || loadFileMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">
            Loading document...
          </p>
        </div>
      </div>
    );
  }

  if (loadFileMutation.isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-destructive">
          <p>Error loading document</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => loadFileMutation.mutate()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
            {fileData?.last_edited_by && (
              <Badge variant="secondary" className="text-xs">
                Last edited by {fileData.last_edited_by.name} at{" "}
                {new Date(fileData.last_edited_at).toLocaleString()}
              </Badge>
            )}
          </div>
          <div>
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
        </div>
      )}

      {readOnly && (
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              View Only Mode
            </Badge>
            {fileData?.last_edited_by && (
              <Badge variant="secondary" className="text-xs">
                Last edited by {fileData.last_edited_by.name}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div
        className={`${className} bg-white flex overflow-y-auto max-h-[95vh] flex-col`}
        id="production-superdoc__container"
      >
        {/* Editor Container */}
        <div className="flex flex-col items-center relative">
          <div
            id="production-superdoc-toolbar"
            className="bg-white border-b sticky top-0 z-4 border-gray-200 overflow-x-auto max-w-5xl w-fit"
          />
          <div
            id="production-superdoc-editor"
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
