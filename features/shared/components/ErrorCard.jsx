"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, RotateCw } from "lucide-react";

export default function ErrorCard({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or contact support.",
  details = "",
  onRetry,
  showDetails: initialShowDetails = false,
}) {
  const [showDetails, setShowDetails] = useState(initialShowDetails);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-card/70 rounded-lg border flex items-center justify-center p-4 ">
      <div className="relative">
        {/* Animated gradient orb background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative max-w-md w-full border transition-all duration-300 ${
            isHovered
              ? "border-red-400/50 dark:border-red-500/50 shadow-lg shadow-red-500/10"
              : "border-red-200/50 dark:border-red-900/50 shadow-md"
          }`}
        >
          <CardContent className="pt-8 pb-6 px-6">
            {/* Header with icon and close button */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4">
                {/* Animated icon */}
                <div
                  className={`shrink-0 p-3 rounded-full bg-red-100/20 dark:bg-red-950/30 transition-all duration-300 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 text-red-600 dark:text-red-400 transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                </div>

                {/* Title and description */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            {/* Details section */}
            {details && (
              <div className="mt-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors mb-2"
                >
                  {showDetails ? "▼" : "▶"} {showDetails ? "Hide" : "Show"}{" "}
                  details
                </button>

                {showDetails && (
                  <pre className="text-xs text-red-700/70 dark:text-red-300/70 bg-red-50/50 dark:bg-red-950/30 rounded-lg p-3 overflow-x-auto border border-red-200/30 dark:border-red-900/30 font-mono leading-relaxed animate-in fade-in-50 duration-200">
                    {details}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            {onRetry && (
              <div className="flex gap-2 mt-5 pt-5 border-t items-center justify-center border-border/30">
                {onRetry && (
                  <Button onClick={onRetry} variant="destructive" size="lg">
                    <RotateCw className="w-4 h-4" />
                    Retry
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
