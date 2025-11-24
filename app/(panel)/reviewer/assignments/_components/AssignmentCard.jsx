"use client";

import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Mail,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge, statusConfig } from "@/features";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AssignmentCard({
  assignment,
  onAccept,
  onDeclineClick,
  acceptMutation,
  declineMutation,
}) {
  const router = useRouter();

  const handleViewSubmission = (assignment) => {
    router.push(`/reviewer/review/${assignment.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">
              {assignment.submission_title || "Untitled Submission"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              {assignment.submission_number || "N/A"}
            </CardDescription>
          </div>
          <StatusBadge
            status={assignment?.submission_details.status}
            statusConfig={statusConfig}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assignment Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Invited: {format(new Date(assignment.invited_at), "PPP")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due: {format(new Date(assignment.due_date), "PPP")}</span>
          </div>
          {assignment.days_remaining != null && (
            <div
              className={`flex items-center gap-2 font-medium ${
                assignment.is_overdue
                  ? "text-destructive"
                  : assignment.days_remaining <= 3
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              <span>
                {assignment.is_overdue
                  ? `${Math.abs(assignment.days_remaining)} days overdue`
                  : `${assignment.days_remaining} days remaining`}
              </span>
            </div>
          )}
          {assignment.assigned_by_info && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>
                Assigned by:{" "}
                {assignment.assigned_by_info.display_name ||
                  assignment.assigned_by_info.full_name}
              </span>
            </div>
          )}
        </div>

        {/* Invitation Message */}
        {assignment.invitation_message && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              {assignment.invitation_message}
            </p>
          </div>
        )}

        {/* Decline Reason */}
        {assignment.status === "DECLINED" && assignment.decline_reason && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm font-medium mb-1">Decline Reason:</p>
            <p className="text-sm text-muted-foreground">
              {assignment.decline_reason}
            </p>
          </div>
        )}

        {/* Accepted/Completed Date */}
        {assignment.accepted_at && (
          <div className="text-xs text-muted-foreground">
            Accepted on {format(new Date(assignment.accepted_at), "PPP")}
          </div>
        )}
        {assignment.completed_at && (
          <div className="text-xs text-muted-foreground">
            Completed on {format(new Date(assignment.completed_at), "PPP")}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {assignment.status === "PENDING" && (
            <>
              <Button
                size="sm"
                onClick={() => onAccept(assignment)}
                disabled={acceptMutation?.isPending}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {acceptMutation?.isPending ? "Accepting..." : "Accept"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeclineClick(assignment)}
                disabled={declineMutation?.isPending}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </>
          )}
          {(assignment?.status === "ACCEPTED" ||
            (assignment?.status === "COMPLETED" &&
              assignment?.submission_details.status === "REVISED")) && (
            <Button
              size="sm"
              onClick={() => handleViewSubmission(assignment)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
