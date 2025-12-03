import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importFromOJS } from "../../api/ojsConnectionApi";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

/**
 * Custom hook to import submissions from OJS with simulated progress tracking
 * @returns {Object} Mutation object with progress state
 */
export function useImportFromOJS() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const isCompleteRef = useRef(false);

  // Simulate progress until it reaches 80%
  const startFakeProgress = () => {
    setProgress(0);
    isCompleteRef.current = false;

    const updateProgress = () => {
      setProgress((prev) => {
        if (isCompleteRef.current) {
          clearInterval(progressIntervalRef.current);
          return 100;
        }

        if (prev >= 80) {
          return 80;
        }

        return prev + 1;
      });
    };

    let currentInterval = 300;

    const scheduleNext = () => {
      progressIntervalRef.current = setTimeout(() => {
        updateProgress();

        setProgress((prev) => {
          if (prev >= 60) {
            currentInterval = 900;
          } else if (prev >= 30) {
            currentInterval = 700;
          } else {
            currentInterval = 500;
          }

          return prev;
        });

        if (!isCompleteRef.current) {
          scheduleNext();
        }
      }, currentInterval);
    };

    scheduleNext();
  };

  const stopFakeProgress = () => {
    if (progressIntervalRef.current) {
      clearTimeout(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleRealCompletion = () => {
    isCompleteRef.current = true;
    setProgress(100);
    stopFakeProgress();
  };

  const handleError = () => {
    isCompleteRef.current = false;
    stopFakeProgress();
  };

  const mutation = useMutation({
    mutationFn: (journalId) => {
      startFakeProgress();
      return importFromOJS(journalId, handleRealCompletion);
    },
    onSuccess: (data, journalId) => {
      handleRealCompletion();

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

        setTimeout(() => setProgress(0), 500);
      }, 500);
    },
    onError: (error) => {
      handleError();

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to import submissions from OJS";
      toast.error(errorMessage);

      setTimeout(() => setProgress(0), 2000);
    },
  });

  useEffect(() => {
    return () => {
      stopFakeProgress();
    };
  }, []);

  return {
    ...mutation,
    progress,
  };
}
