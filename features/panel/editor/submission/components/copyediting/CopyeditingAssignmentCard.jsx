"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileEdit,
  Calendar,
  Clock,
  User,
  Mail,
  Award,
  PauseCircle,
  CheckCircle,
  Circle,
  University,
} from "lucide-react";
import { format } from "date-fns";

export function CopyeditingAssignmentCard({ assignment, isPending = false }) {
  const [showBioModal, setShowBioModal] = useState(false);

  function renderAssignmentStatusBadge(status, status_display) {
    const config = {
      IN_PROGRESS: {
        bg: "bg-blue-100 dark:bg-blue-600",
        text: "text-blue-700 dark:text-primary-foreground",
        dot: "bg-blue-500",
        variant: "default",
      },
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-600",
        text: "text-yellow-700 dark:text-primary-foreground",
        dot: "bg-yellow-400",
        variant: "outline",
      },
      COMPLETED: {
        bg: "bg-green-100 dark:bg-green-600",
        text: "text-green-700 dark:text-primary-foreground",
        dot: "bg-green-500",
        variant: "secondary",
      },
    }[status] || {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-700 dark:text-primary-foreground",
      dot: "bg-gray-400",
      variant: "outline",
    };
    return (
      <Badge
        variant={config.variant}
        className={`gap-1 ${config.bg} ${config.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
        {status_display || status}
      </Badge>
    );
  }

  if (isPending) {
    return (
      <>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {[...Array(8)].map((_, i) => (
            <div className="flex items-start gap-2" key={i}>
              <Skeleton className=" h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <FileEdit className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No Active Assignment</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There is currently no copyediting assignment for this submission.
          Click &quot;Assign Copyeditor&quot; to create a new assignment.
        </p>
      </div>
    );
  }

  // Helper to get plain text preview from HTML
  const getBioPreview = (html, maxLength = 100) => {
    if (!html) return null;
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const bioPreview = getBioPreview(assignment.copyeditor?.bio);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileEdit className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Current Assignment</h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {/* Copyeditor Name */}
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground/80 text-xs">
              Copyeditor
            </span>
            <span className="text-foreground font-medium">
              {assignment.copyeditor?.display_name}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground/80 text-xs">
              Email
            </span>
            <a
              href={`mailto:${assignment.copyeditor?.user_email}`}
              className="text-primary hover:underline text-sm"
            >
              {assignment.copyeditor?.user_email}
            </a>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-start gap-2 justify-start">
          {assignment.status === "IN_PROGRESS" && (
            <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
          )}
          {assignment.status === "PENDING" && (
            <PauseCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
          )}
          {assignment.status === "COMPLETED" && (
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
          )}
          {!["IN_PROGRESS", "PENDING", "COMPLETED"].includes(
            assignment.status
          ) && <Circle className="h-4 w-4 text-gray-400 mt-0.5" />}
          <span className="font-medium text-foreground/80 ">Status:</span>
          {renderAssignmentStatusBadge(
            assignment.status,
            assignment.status_display
          )}
        </div>

        {/* Affiliation */}
        {assignment.copyeditor?.affiliation_name && (
          <div className="flex items-start gap-2">
            <University className="h-4 w-4 text-muted-foreground mt-0.5" />

            <span className="font-medium text-foreground/80 ">
              Affiliation:
            </span>
            <span className="text-muted-foreground">
              {assignment.copyeditor.affiliation_name}
            </span>
          </div>
        )}

        {/* ORCID */}
        {assignment.copyeditor?.orcid_id && (
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground/80 text-xs">
                ORCID ID
              </span>
              <a
                href={`https://orcid.org/${assignment.copyeditor.orcid_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-mono"
              >
                {assignment.copyeditor.orcid_id}
              </a>
            </div>
          </div>
        )}

        {/* Assigned Date */}
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground/80 text-xs">
              Assigned Date
            </span>
            <span className="text-muted-foreground text-sm">
              {assignment.assigned_at
                ? format(new Date(assignment.assigned_at), "PPP")
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Due Date */}
        {assignment.due_date && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground " />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground/80 text-xs">
                Due Date
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    assignment.is_overdue
                      ? "text-destructive font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {format(new Date(assignment.due_date), "PPP p")}
                </span>
                {assignment.is_overdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Completed Date */}
        {assignment.completed_at && (
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground/80 text-xs">
                Completed Date
              </span>
              <span className="text-muted-foreground text-sm">
                {format(new Date(assignment.completed_at), "PPP")}
              </span>
            </div>
          </div>
        )}

        {/* Expertise Areas */}
        {assignment.copyeditor?.expertise_areas &&
          assignment.copyeditor.expertise_areas.length > 0 && (
            <div className="flex items-start gap-2 xl:col-span-2">
              <span className="font-medium text-foreground/80 ">
                Expertise:
              </span>
              <div className="flex flex-wrap gap-2">
                {assignment.copyeditor.expertise_areas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Instructions */}
      {assignment.instructions && (
        <div className="mt-5 pt-5 border-t">
          <span className="font-medium text-foreground/80 block mb-2">
            Instructions:
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-primary/30 italic">
            {assignment.instructions}
          </p>
        </div>
      )}

      {/* Bio Preview */}
      {bioPreview && (
        <div className="mt-5 pt-5 border-t">
          <span className="font-medium text-foreground/80 block mb-2">
            Copyeditor Bio:
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-primary/30 italic">
              {bioPreview}
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowBioModal(true)}
              className="self-start pl-4"
            >
              View Full Bio
            </Button>
          </div>
        </div>
      )}

      {/* Bio Modal */}
      <Dialog open={showBioModal} onOpenChange={setShowBioModal}>
        <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Copyeditor Bio</DialogTitle>
            <DialogDescription>
              {assignment.copyeditor?.display_name}
            </DialogDescription>
          </DialogHeader>
          <div
            dangerouslySetInnerHTML={{ __html: assignment.copyeditor?.bio }}
            className="prose prose-sm max-w-none leading-relaxed mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
