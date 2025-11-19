"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import "@harbour-enterprises/superdoc/style.css";
import { useTheme } from "next-themes";

/**
 * SuperDoc Editor Component
 * Handles SuperDoc initialization and Yjs state management
 */
export default function SuperDocEditor({
  documentData,
  userData,
  userRole,
  onSave,
  onChange,
  onUnsavedChanges,
  className = "",
  editorRef, // External ref to access editor instance
}) {
  const superDocInstanceRef = useRef(null);

  // Initialize SuperDoc editor
  useEffect(() => {
    if (!documentData) {
      return;
    }
    const initSuperDoc = async () => {
      try {
        // Import SuperDoc dynamically
        const { SuperDoc } = await import("@harbour-enterprises/superdoc");

        // Convert base64 Yjs state to Uint8Array if exists
        let yjsStateData = undefined;
        if (documentData.yjs_state) {
          yjsStateData = Uint8Array.from(atob(documentData.yjs_state), (c) =>
            c.charCodeAt(0)
          );
        }

        // Initialize SuperDoc
        const superdoc = new SuperDoc({
          selector: "#superdoc",
          document: documentData.file_url,
          pagination: true,
          user: {
            name: userData?.name || "User",
            email: userData?.email || userData?.id || "user@example.com",
          },
          // toolbar: "#toolbar",
          theme: "light",

          modules: {
            comments: {
              enabled: true,
              readOnly: userRole === "AUTHOR",
            },
            toolbar: {
              selector: "#toolbar",
            },
          },
          yjsState: yjsStateData,
          onReady: () => {
            const superdocRoot = document.getElementById("superdoc");
            if (superdocRoot) {
              superdocRoot.classList.remove("dark");
              superdocRoot.classList.add("light");
              // Force all text to be dark regardless of theme
              superdocRoot.style.setProperty("color", "#222", "important");
              // Apply to all child elements to ensure text is always visible
              const allElements = superdocRoot.querySelectorAll("*");
              allElements.forEach((el) => {
                el.style.setProperty("color", "#222", "important");
              });
            }
            const toolbar = document.getElementById("toolbar");
            if (toolbar) {
              toolbar.classList.remove("dark");
              toolbar.classList.add("light");
            }
            console.debug("SuperDoc is ready!");
            toast.success("Document loaded successfully");
          },
          onChange: () => {
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
      } catch (error) {
        console.error("Failed to initialize SuperDoc:", error);
        toast.error("Failed to initialize document editor");
      }
    };

    initSuperDoc();

    return () => {
      if (superDocInstanceRef.current) {
        try {
          superDocInstanceRef.current.destroy?.();
        } catch (error) {
          console.error("Error destroying SuperDoc instance:", error);
        }
        superDocInstanceRef.current = null;

        if (editorRef) {
          editorRef.current = null;
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData?.id]);

  // Expose manual save method to parent via ref
  useEffect(() => {
    if (superDocInstanceRef.current && editorRef && onSave) {
      editorRef.current.manualSave = async () => {
        try {
          const yjsState = superDocInstanceRef.current.getYjsState();
          const base64State = btoa(
            String.fromCharCode.apply(null, new Uint8Array(yjsState))
          );
          await onSave(base64State);
          if (onUnsavedChanges) {
            onUnsavedChanges(false);
          }
          toast.success("Document saved successfully");
          return true;
        } catch (error) {
          console.error("Save error:", error);
          toast.error("Failed to save document");
          return false;
        }
      };
    }
  }, [editorRef, onSave, onUnsavedChanges]);

  return (
    <div className={`${className} flex flex-col items-center`}>
      {/* Toolbar container with styling */}
      <div
        id="toolbar"
        className="bg-white border-b border-gray-200 overflow-x-auto max-w-5xl"
        style={{
          color: "#222",
          fontSize: "14px",
        }}
      />
      {/* SuperDoc container with proper styling */}
      <div
        id="superdoc"
        className="text-black  "
        style={{
          minHeight: "600px",
          padding: "20px",
          background: "#fff",
          color: "#222 !important",
        }}
      />
    </div>
  );
}
