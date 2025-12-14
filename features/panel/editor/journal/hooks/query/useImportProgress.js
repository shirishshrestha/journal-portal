import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { getImportProgress } from "../../api/ojsConnectionApi";

/**
 * Custom hook to poll and track OJS import progress using React Query
 * @param {string} journalId - Journal ID to track progress for
 * @returns {Object} Progress data and control functions
 */
export function useImportProgress(journalId) {
  const [isWaitingForStart, setIsWaitingForStart] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["import-progress", journalId],
    queryFn: async () => {
      if (!journalId) return null;
      return await getImportProgress(journalId);
    },
    enabled: !!journalId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      // If waiting for import to start from idle, poll every 1.5s
      if (isWaitingForStart && status === "idle") {
        return 1500;
      }

      // Once status changes from idle, stop waiting
      if (isWaitingForStart && status !== "idle") {
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

  // isPolling is true if status is fetching or processing, or waiting for start
  const isPolling =
    progressData.status === "fetching" ||
    progressData.status === "processing" ||
    isWaitingForStart;

  return {
    progressData,
    isPolling,
    isWaitingForStart,
    startPolling: () => {
      setIsWaitingForStart(true);
      refetch();
    },
    stopPolling: () => setIsWaitingForStart(false),
    fetchProgress: refetch,
    isLoading,
  };
}
