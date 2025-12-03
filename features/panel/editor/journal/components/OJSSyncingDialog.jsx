import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  FileText,
  CheckCircle2,
  Upload,
  Database,
} from "lucide-react";

export function OJSSyncingDialog({ open, progress }) {
  const steps = [
    { icon: Upload, label: "Connecting to OJS", threshold: 0 },
    { icon: Database, label: "Fetching submissions", threshold: 25 },
    { icon: FileText, label: "Processing data", threshold: 60 },
    { icon: CheckCircle2, label: "Finalizing import", threshold: 90 },
  ];

  // Derive current step directly from progress (no state needed)
  const getCurrentStep = () => {
    if (progress >= 90) return 3;
    if (progress >= 60) return 2;
    if (progress >= 25) return 1;
    if (progress > 0) return 0;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="pointer-events-none select-none max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">
            Importing Submissions from OJS
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-6 items-center text-center pt-6">
            {/* Animated spinner with pulse effect */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-400 dark:bg-blue-500 opacity-20" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {progress}% Complete
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-6 py-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isComplete = index < currentStep;

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                      isActive ? "scale-110" : "scale-100 opacity-60"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        isComplete
                          ? "bg-green-100 dark:bg-green-900/30"
                          : isActive
                          ? "bg-blue-100 dark:bg-blue-900/30 animate-pulse"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isComplete
                            ? "text-green-600 dark:text-green-400"
                            : isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Warning message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong className="font-semibold">
                  Please keep this window open.
                </strong>
                <br />
                Closing or refreshing now may interrupt the import process.
              </p>
            </div>

            {/* Fun fact or tip */}
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Tip: Imported submissions will appear in your dashboard once
              complete.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
