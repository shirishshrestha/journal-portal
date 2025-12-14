import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { getImportProgress } from "../../api/ojsConnectionApi";

/**
 * Custom hook to poll and track OJS import progress using React Query
 * @param {string} journalId - Journal ID to track progress for
 * @param {Function} onErrorStop - Callback to execute when polling stops due to errors
 * @returns {Object} Progress data and control functions
 */
export function useImportProgress(journalId, onErrorStop) {
  const [isWaitingForStart, setIsWaitingForStart] = useState(false);
  const isWaitingForStartRef = useRef(false);
  const errorCountRef = useRef(0);
  const stoppedByErrorRef = useRef(false);
  const [stoppedByError, setStoppedByError] = useState(false);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["import-progress", journalId],
    queryFn: async () => {
      if (!journalId) return null;
      return await getImportProgress(journalId);
    },
    enabled: !!journalId,
    refetchInterval: (query) => {
      // Stop polling immediately if stopped by error
      if (stoppedByErrorRef.current) {
        return false;
      }

      const status = query.state.data?.status;

      // If waiting for import to start from idle, poll every 1.5s
      if (isWaitingForStartRef.current && status === "idle") {
        return 1500;
      }

      // Once status changes from idle, stop waiting
      if (isWaitingForStartRef.current && status !== "idle") {
        isWaitingForStartRef.current = false;
        setIsWaitingForStart(false);
      }

      // Poll every 1.5s if status is fetching or processing
      if (status === "fetching" || status === "processing") {
        return 1500;
      }

      return false;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Track errors and stop polling after 3 consecutive errors
  useEffect(() => {
    if (error) {
      errorCountRef.current = (errorCountRef.current || 0) + 1;
      if (errorCountRef.current > 3 && !stoppedByErrorRef.current) {
        stoppedByErrorRef.current = true;
        setStoppedByError(true);
        isWaitingForStartRef.current = false;
        setIsWaitingForStart(false);
        // Close the dialog when stopped by error
        if (onErrorStop) {
          onErrorStop();
        }
      }
    } else if (!error && errorCountRef.current > 0) {
      // Reset error count on successful fetch
      errorCountRef.current = 0;
      if (stoppedByErrorRef.current) {
        stoppedByErrorRef.current = false;
        setStoppedByError(false);
      }
    }
  }, [error, onErrorStop]);

  // Format progress data with defaults
  const progressData = {
    percentage: data?.percentage || 0,
    status: data?.status || "idle",
    stage: data?.stage || "",
    current: data?.current || 0,
    total: data?.total || 0,
    imported: data?.imported || 0,
    updated: data?.updated || 0,
    skipped: data?.skipped || 0,
    errors: data?.errors || 0,
  };

  // Set to 100% on completion
  if (progressData.status === "completed" && progressData.percentage < 100) {
    progressData.percentage = 100;
  }

  // isPolling is true if status is fetching or processing, or waiting for start, and not stopped by error
  const isPolling =
    (progressData.status === "fetching" ||
      progressData.status === "processing" ||
      isWaitingForStart) &&
    !stoppedByError;

  return {
    progressData,
    isPolling,
    isWaitingForStart,
    stoppedByError,
    error,
    startPolling: () => {
      isWaitingForStartRef.current = true;
      setIsWaitingForStart(true);
      stoppedByErrorRef.current = false;
      setStoppedByError(false);
      errorCountRef.current = 0;
      refetch();
    },
    stopPolling: () => {
      isWaitingForStartRef.current = false;
      setIsWaitingForStart(false);
    },
    fetchProgress: refetch,
    isLoading,
  };
}
