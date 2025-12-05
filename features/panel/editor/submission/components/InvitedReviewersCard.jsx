"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Mail, Building2, Calendar } from "lucide-react";

/**
 * Component to display invited reviewers
 */
export function InvitedReviewersCard({ submission }) {
  if (
    !submission.review_assignments ||
    submission.review_assignments.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invited Reviewers</CardTitle>
        <CardDescription>
          Reviewers who have been invited to review this submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {submission.review_assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">
                      {assignment.reviewer_name}
                    </h4>
                    <Badge
                      variant={
                        assignment.status === "ACCEPTED"
                          ? "default"
                          : assignment.status === "DECLINED"
                          ? "destructive"
                          : assignment.status === "COMPLETED"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {assignment.status_display}
                    </Badge>
                    {assignment.is_overdue &&
                      assignment.status === "ACCEPTED" && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {assignment.reviewer_email}
                  </div>

                  {assignment.reviewer_affiliation && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {assignment.reviewer_affiliation}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Invited:{" "}
                        {format(new Date(assignment.invited_at), "PPP")}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Due: {format(new Date(assignment.due_date), "PPP")}
                      </span>
                    </div>
                    {assignment.status === "ACCEPTED" &&
                      assignment.days_remaining != null && (
                        <>
                          <span>•</span>
                          <span
                            className={
                              assignment.days_remaining < 0
                                ? "text-destructive font-medium"
                                : ""
                            }
                          >
                            {assignment.days_remaining < 0
                              ? `${Math.abs(
                                  assignment.days_remaining
                                )} days overdue`
                              : `${assignment.days_remaining} days remaining`}
                          </span>
                        </>
                      )}
                  </div>

                  {assignment.status === "ACCEPTED" &&
                    assignment.accepted_at && (
                      <p className="text-xs text-muted-foreground">
                        Accepted on{" "}
                        {format(new Date(assignment.accepted_at), "PPP")}
                      </p>
                    )}

                  {assignment.status === "DECLINED" &&
                    assignment.declined_at && (
                      <div className="text-xs">
                        <p className="text-muted-foreground">
                          Declined on{" "}
                          {format(new Date(assignment.declined_at), "PPP")}
                        </p>
                        {assignment.decline_reason && (
                          <p className="mt-1 text-destructive">
                            Reason: {assignment.decline_reason}
                          </p>
                        )}
                      </div>
                    )}

                  {assignment.status === "COMPLETED" &&
                    assignment.completed_at && (
                      <p className="text-xs text-muted-foreground">
                        Completed on{" "}
                        {format(new Date(assignment.completed_at), "PPP")}
                      </p>
                    )}

                  <p className="text-xs text-muted-foreground">
                    Assigned by: {assignment.assigned_by_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
