"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { SuperDoc } from "@harbour-enterprises/superdoc";

/**
 * SuperDoc Editor Component
 * Handles SuperDoc initialization, Yjs state management, and auto-save
 */
export default function SuperDocEditor({
  documentData,
  userData,
  userRole = "AUTHOR",
  onSave,
  onChange,
  onUnsavedChanges,
  autoSaveInterval = 30000, // 30 seconds
  className = "",
  editorRef, // External ref to access editor instance
}) {
  const editorContainerRef = useRef(null);
  const superDocInstanceRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize SuperDoc editor
  useEffect(() => {
    if (
      !documentData ||
      !editorContainerRef.current ||
      superDocInstanceRef.current
    ) {
      return;
    }

    try {
      // Convert base64 Yjs state to Uint8Array if exists
      let yjsStateData = undefined;
      if (documentData.yjs_state) {
        yjsStateData = Uint8Array.from(atob(documentData.yjs_state), (c) =>
          c.charCodeAt(0)
        );
      }

      // Initialize SuperDoc with the document
      const superdoc = new SuperDoc({
        container: editorContainerRef.current,
        fileUrl: documentData.file_url,
        editable: documentData.can_edit,
        user: {
          id: userData?.id || "unknown",
          name: userData?.name || "User",
          role: userRole.toLowerCase(),
        },
        comments: {
          enabled: true,
          readOnly: userRole === "AUTHOR", // Authors can only read comments
        },
        yjsState: yjsStateData,
        onSave: async (yjsState) => {
          // Convert Yjs state (Uint8Array) to base64
          const base64State = btoa(
            String.fromCharCode.apply(null, new Uint8Array(yjsState))
          );

          if (onSave) {
            await onSave(base64State);
          }
          setHasUnsavedChanges(false);
        },
        onChange: () => {
          setHasUnsavedChanges(true);
          if (onUnsavedChanges) {
            onUnsavedChanges(true);
          }
          if (onChange) {
            onChange();
          }
        },
      });

      superDocInstanceRef.current = superdoc;

      // Expose instance via external ref if provided
      if (editorRef) {
        editorRef.current = superdoc;
      }
      toast.success("Document loaded successfully");
    } catch (error) {
      console.error("Failed to initialize SuperDoc:", error);
      toast.error("Failed to initialize document editor");
    }

    return () => {
      if (superDocInstanceRef.current) {
        superDocInstanceRef.current.destroy?.();
        superDocInstanceRef.current = null;
      }
    };
  }, [
    documentData,
    userData,
    userRole,
    onSave,
    onChange,
    onUnsavedChanges,
    editorRef,
  ]);

  // Manual save function (exposed via ref)
  const handleSave = useCallback(
    async (silent = false) => {
      if (!superDocInstanceRef.current) {
        if (!silent) toast.error("Editor not initialized");
        return false;
      }

      try {
        const yjsState = superDocInstanceRef.current.getYjsState();
        const base64State = btoa(
          String.fromCharCode.apply(null, new Uint8Array(yjsState))
        );

        if (onSave) {
          await onSave(base64State);
        }

        setHasUnsavedChanges(false);
        if (onUnsavedChanges) {
          onUnsavedChanges(false);
        }
        if (!silent) toast.success("Document saved successfully");
        return true;
      } catch (error) {
        if (!silent) toast.error("Failed to save document");
        return false;
      }
    },
    [onSave, onUnsavedChanges]
  );

  // Auto-save functionality
  useEffect(() => {
    if (
      !documentData?.can_edit ||
      !superDocInstanceRef.current ||
      autoSaveInterval <= 0
    ) {
      return;
    }

    autoSaveIntervalRef.current = setInterval(() => {
      if (hasUnsavedChanges && superDocInstanceRef.current) {
        handleSave(true); // Silent auto-save
      }
    }, autoSaveInterval);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [hasUnsavedChanges, documentData, autoSaveInterval, handleSave]);

  // Expose save method to parent via ref
  useEffect(() => {
    if (superDocInstanceRef.current && editorRef) {
      editorRef.current.manualSave = handleSave;
    }
  }, [handleSave, editorRef]);

  return (
    <div
      ref={editorContainerRef}
      className={className}
      style={{ minHeight: "600px" }}
    />
  );
}
