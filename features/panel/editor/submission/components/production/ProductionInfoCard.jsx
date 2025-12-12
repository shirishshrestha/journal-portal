import React from "react";
import {
  PlayCircle,
  CheckCircle2,
  Calendar,
  User,
  UserCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";

export function ProductionInfoCard({
  assignment,
  onStartProduction,
  onCompleteProduction,
  isStarting = false,
  isCompleting = false,
}) {
  if (!assignment) {
    return null;
  }

  const getStatusBadge = (status) => {
    const configs = {
      PENDING: {
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        dotColor: "bg-amber-500 dark:bg-amber-400",
      },
      IN_PROGRESS: {
        label: "In Progress",
        className:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        dotColor: "bg-blue-500 dark:bg-blue-400",
      },
      COMPLETED: {
        label: "Completed",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        dotColor: "bg-emerald-500 dark:bg-emerald-400",
      },
    };

    const config = configs[status] || configs.PENDING;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
        {config.label}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <Card className="">
      {/* Header */}
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Production Assignment</CardTitle>
            <CardDescription className="mt-1">
              Current production status and details
            </CardDescription>
          </div>
          {getStatusBadge(assignment.status)}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <User className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Production Assistant
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {assignment.production_assistant?.display_name ||
                `${assignment.production_assistant?.user?.first_name || ""} ${
                  assignment.production_assistant?.user?.last_name || ""
                }`.trim() ||
                "Not assigned"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <UserCheck className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Assigned By
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {assignment.assigned_by?.display_name ||
                `${assignment.assigned_by?.user?.first_name || ""} ${
                  assignment.assigned_by?.user?.last_name || ""
                }`.trim() ||
                "Unknown"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Due Date
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatDate(assignment.due_date)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Assigned On
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatDate(assignment.assigned_at)}
            </p>
          </div>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Instructions
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 dark:bg-slate-800 dark:border-slate-700">
              <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                {assignment.instructions}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons / Completion Alert */}
        <div className="pt-2">
          {assignment.status === "PENDING" && (
            <Button onClick={onStartProduction} disabled={isStarting} size="sm">
              {isStarting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Production
                </>
              )}
            </Button>
          )}
          {assignment.status === "IN_PROGRESS" && (
            <Button
              onClick={onCompleteProduction}
              disabled={isCompleting}
              size="sm"
            >
              {isCompleting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Production
                </>
              )}
            </Button>
          )}

          {assignment.status === "COMPLETED" && (
            <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                Production Completed
              </AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                This submission is ready for publication scheduling.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
