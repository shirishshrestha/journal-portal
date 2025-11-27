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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ErrorCard,
  useGetMyAnalytics,
  useGetReviewAssignments,
} from "@/features";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ReviewerAssignmentsPage() {
  const router = useRouter();

  const {
    data: assignmentsData,
    isPending: isAssignmentDataPending,
    error,
  } = useGetReviewAssignments();

  // Extract assignments array
  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  const recentAssignments = assignments.slice(0, 10); // Show up to 10

  const {
    data: analytics,
    isPending,
    error: analyticsError,
    refetch,
  } = useGetMyAnalytics();
  const reviewerStats = analytics?.reviewer_stats || {};

  if (isAssignmentDataPending) {
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
      {/* Recent Assignments */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {" "}
        <Card className="hover:shadow-md transition-shadow flex justify-between gap-4 flex-col md:flex-row">
          <CardHeader className={"flex-1 gap-0"}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  {reviewerStats?.pending} invitation
                  {reviewerStats?.pending !== 1 ? "s" : ""} awaiting your
                  response
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/reviewer/assignments/pending">
              <Button className="">
                View Pending
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow flex justify-between gap-4 flex-col md:flex-row">
          <CardHeader className={"flex-1 gap-0"}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Accepted Reviews</CardTitle>
                <CardDescription>
                  {reviewerStats?.accepted} review
                  {reviewerStats?.accepted !== 1 ? "s" : ""} in progress
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/reviewer/assignments/accepted">
              <Button className="">
                Continue Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      {recentAssignments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>Your latest review assignments</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex md:items-center flex-col md:flex-row justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
      ) : (
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
