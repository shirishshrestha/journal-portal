"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorCard } from "@/features";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReviewAssignments } from "@/features/panel/reviewer/hooks/query/useGetReviewAssignments";

export default function ReviewerAssignmentsPage() {
  const router = useRouter();

  // Fetch assignments
  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useGetReviewAssignments();

  // Extract and filter assignments
  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  const pendingCount = assignments.filter((a) => a.status === "PENDING").length;
  const acceptedCount = assignments.filter(
    (a) => a.status === "ACCEPTED"
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const declinedCount = assignments.filter(
    (a) => a.status === "DECLINED"
  ).length;

  // Get recent assignments (last 6)
  const recentAssignments = assignments.slice(0, 6);

  if (isPending) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <ErrorCard
          title="Failed to Load Review Assignments"
          description={
            error?.message ||
            "Unable to load your review assignments. Please try again."
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  {pendingCount} invitation{pendingCount !== 1 ? "s" : ""}{" "}
                  awaiting your response
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/reviewer/assignments/pending">
              <Button className="w-full">
                View Pending
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Accepted Reviews</CardTitle>
                <CardDescription>
                  {acceptedCount} review{acceptedCount !== 1 ? "s" : ""} in
                  progress
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/reviewer/assignments/accepted">
              <Button className="w-full">
                Continue Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>
              Your latest review assignments across all statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (assignment.status === "PENDING") {
                      router.push("/reviewer/assignments/pending");
                    } else if (assignment.status === "ACCEPTED") {
                      router.push(`/reviewer/assignments/accepted`);
                    } else if (assignment.status === "COMPLETED") {
                      router.push("/reviewer/assignments/completed");
                    } else {
                      router.push("/reviewer/assignments/declined");
                    }
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-muted rounded">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {assignment.submission_title || "Untitled Submission"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.submission_number || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {assignment.status === "PENDING" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                    {assignment.status === "ACCEPTED" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Accepted
                      </span>
                    )}
                    {assignment.status === "COMPLETED" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <FileText className="h-3 w-3 mr-1" />
                        Completed
                      </span>
                    )}
                    {assignment.status === "DECLINED" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Declined
                      </span>
                    )}
                    {assignment.is_overdue && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Overdue
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground">View All</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No assignments yet</h3>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t been assigned any reviews yet. Check back later
              for new invitations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
