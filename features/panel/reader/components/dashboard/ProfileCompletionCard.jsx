"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import Link from "next/link";

export function ProfileCompletionCard({ completionPercentage, pending }) {
  // For animation, only animate when not pending
  const [width, setWidth] = useState(pending ? 0 : completionPercentage);

  useEffect(() => {
    if (!pending) {
      const timeout = setTimeout(() => {
        setWidth(completionPercentage);
      }, 100);
      return () => clearTimeout(timeout);
    }
    // If pending, do not update width (leave as 0)
  }, [completionPercentage, pending]);

  if (pending) {
    return (
      <Card className="bg-linear-to-r from-amber-50 to-amber-50 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-900/40 animate-pulse opacity-80">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex flex-col items-start min-w-fit">
              <div className="flex items-baseline gap-2">
                <span className="h-12 w-24 bg-amber-100 dark:bg-amber-900 rounded mb-2" />
              </div>
              <div className="h-6 w-32 bg-amber-100 dark:bg-amber-900 rounded mb-2" />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <div className="w-full bg-amber-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-300 dark:bg-amber-700 h-2 rounded-full w-1/3" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-40 bg-amber-100 dark:bg-amber-900 rounded mb-2" />
                <div className="h-4 w-3/4 bg-amber-100 dark:bg-amber-900 rounded" />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-8 w-32 bg-amber-200 dark:bg-amber-900 rounded" />
                <div className="h-8 w-40 bg-amber-200 dark:bg-amber-900 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-linear-to-r from-amber-50 to-amber-50 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20 dark:border-amber-900/40">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left section with percentage */}
          <div className="flex flex-col items-start min-w-fit">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-semibold text-amber-900 dark:text-amber-100">
                {completionPercentage.toFixed(2)}%
              </span>
            </div>
            <p className="text-xl text-amber-800 mt-2 dark:text-amber-100/70 font-medium ">
              of your profile is <br />
              complete
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-amber-600 pl-2  dark:text-amber-100/50 hover:text-amber-700 dark:hover:text-amber-100 transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm">
                    <p>
                      A complete profile increases your chances of being
                      selected for journal submission reviews and editorial
                      roles.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          </div>

          {/* Right section with progress bar and description */}
          <div className="flex-1">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-amber-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 dark:bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                Complete your profile to unlock your role!
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-100/60 leading-relaxed">
                Request roles like Author, Reviewer, or Editor through the
                Verification Page. Admins will review your profile and requested
                role, and once your profile meets the required criteria,
                you&apos;ll gain full access to journal submissions, peer
                reviews, and editorial opportunities.
              </p>
            </div>

            {/* Button and info icon */}
            <div className="flex items-center gap-3 mt-4">
              <Link href="/profile">
                <Button
                  className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                  size="sm"
                >
                  Complete profile
                </Button>
              </Link>
              <Link href="/reader/verification">
                <Button
                  className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                  size="sm"
                >
                  Go to Verification Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
