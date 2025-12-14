import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFromOJS, getImportProgress } from "../../api/ojsConnectionApi";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

/**
 * Custom hook to import submissions from OJS with real-time progress tracking
 * @returns {Object} Mutation object with progress state and details
 */
export function useImportFromOJS() {
  const queryClient = useQueryClient();
  const [progressData, setProgressData] = useState({
    percentage: 0,
    status: "idle",
    stage: "",
    current: 0,
    total: 0,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  });
  const pollIntervalRef = useRef(null);
  const isPollingRef = useRef(false);

  // Poll backend for real progress
  const startProgressPolling = (journalId) => {
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    setProgressData({
      percentage: 0,
      status: "starting",
      stage: "Initializing import...",
      current: 0,
      total: 0,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    });

    const pollProgress = async () => {
      try {
        const data = await getImportProgress(journalId);

        // Update progress data
        setProgressData({
          percentage: data.percentage || 0,
          status: data.status || "processing",
          stage: data.stage || "Processing...",
          current: data.current || 0,
          total: data.total || 0,
          imported: data.imported || 0,
          updated: data.updated || 0,
          skipped: data.skipped || 0,
          errors: data.errors || 0,
        });

        // Stop polling if completed or error
        if (data.status === "completed" || data.status === "error") {
          stopProgressPolling();

          // Set to 100% on completion
          if (data.status === "completed") {
            setProgressData((prev) => ({
              ...prev,
              percentage: 100,
              status: "completed",
            }));
          }
        }
      } catch (error) {
        console.error("Error polling progress:", error);
        // Continue polling even on error (backend might be processing)
      }
    };

    // Poll immediately, then every 1 second
    pollProgress();
    pollIntervalRef.current = setInterval(pollProgress, 1000);
  };

  const stopProgressPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    isPollingRef.current = false;
  };

  const mutation = useMutation({
    mutationFn: (journalId) => {
      startProgressPolling(journalId);
      return importFromOJS(journalId);
    },
    onSuccess: (data, journalId) => {
      // Continue polling until backend reports completion
      // The polling will stop when status is "completed"

      // Wait a bit for final status, then invalidate queries
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["journal-submissions", journalId],
        });
        queryClient.invalidateQueries({
          queryKey: ["journal", journalId],
        });

        toast.success(
          data.message || "Submissions imported from OJS successfully"
        );

        // Reset progress after a delay
        setTimeout(() => {
          setProgressData({
            percentage: 0,
            status: "idle",
            stage: "",
            current: 0,
            total: 0,
            imported: 0,
            updated: 0,
            skipped: 0,
            errors: 0,
          });
        }, 2000);
      }, 1000);
    },
    onError: (error) => {
      stopProgressPolling();

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to import submissions from OJS";
      toast.error(errorMessage);

      setProgressData({
        percentage: 0,
        status: "error",
        stage: "Import failed",
        current: 0,
        total: 0,
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
      });

      setTimeout(() => {
        setProgressData({
          percentage: 0,
          status: "idle",
          stage: "",
          current: 0,
          total: 0,
          imported: 0,
          updated: 0,
          skipped: 0,
          errors: 0,
        });
      }, 2000);
    },
  });

  useEffect(() => {
    return () => {
      stopProgressPolling();
    };
  }, []);

  return {
    ...mutation,
    progressData,
    progress: progressData.percentage, // Backward compatibility
  };
}
