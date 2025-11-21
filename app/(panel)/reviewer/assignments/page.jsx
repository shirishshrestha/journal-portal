"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Mail,
  Building2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { RoleBasedRoute, StatusBadge, statusConfig } from "@/features";
import { useGetReviewAssignments } from "@/features/panel/reviewer/hooks/useGetReviewAssignments";
import { useAcceptReviewAssignment } from "@/features/panel/reviewer/hooks/mutation/useAcceptReviewAssignment";
import { useDeclineReviewAssignment } from "@/features/panel/reviewer/hooks/mutation/useDeclineReviewAssignment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ReviewerAssignmentsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("all");
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [declineReason, setDeclineReason] = useState("");

  // Fetch assignments
  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
  } = useGetReviewAssignments();

  // Mutations
  const acceptMutation = useAcceptReviewAssignment();
  const declineMutation = useDeclineReviewAssignment();

  // Extract assignments array from response (handle both array and paginated object)
  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  // Filter assignments by status
  const filterAssignments = (status) => {
    if (!assignments) return [];
    if (status === "all") return assignments;
    return assignments.filter((a) => a.status === status);
  };

  const pendingAssignments = filterAssignments("PENDING");
  const acceptedAssignments = filterAssignments("ACCEPTED");
  const completedAssignments = filterAssignments("COMPLETED");
  const declinedAssignments = filterAssignments("DECLINED");

  // Handlers
  const handleAccept = (assignment) => {
    acceptMutation.mutate(assignment.id, {
      onSuccess: () => {
        alert("Review assignment accepted successfully!");
      },
      onError: (error) => {
        alert(
          `Failed to accept: ${error.response?.data?.error || error.message}`
        );
      },
    });
  };

  const handleDeclineClick = (assignment) => {
    setSelectedAssignment(assignment);
    setDeclineDialogOpen(true);
  };

  const handleDeclineConfirm = () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }

    declineMutation.mutate(
      {
        id: selectedAssignment.id,
        data: { decline_reason: declineReason },
      },
      {
        onSuccess: () => {
          setDeclineDialogOpen(false);
          setDeclineReason("");
          setSelectedAssignment(null);
          alert("Review assignment declined");
        },
        onError: (error) => {
          alert(
            `Failed to decline: ${error.response?.data?.error || error.message}`
          );
        },
      }
    );
  };

  const handleViewSubmission = (assignment) => {
    // Navigate to review detail page
    router.push(`/reviewer/review/${assignment.id}`);
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: {
        variant: "outline",
        className: "border-yellow-500 text-yellow-600",
      },
      ACCEPTED: { variant: "default", className: "bg-blue-600" },
      DECLINED: { variant: "destructive", className: "" },
      COMPLETED: { variant: "secondary", className: "bg-green-600 text-white" },
      CANCELLED: {
        variant: "outline",
        className: "border-gray-500 text-gray-600",
      },
    };

    return variants[status] || variants.PENDING;
  };

  const AssignmentCard = ({ assignment }) => {
    const badgeProps = getStatusBadge(assignment.status);

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
                  onClick={() => handleAccept(assignment)}
                  disabled={acceptMutation.isPending}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {acceptMutation.isPending ? "Accepting..." : "Accept"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeclineClick(assignment)}
                  disabled={declineMutation.isPending}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </>
            )}
            {assignment?.submission_details.status !== "REVISION_REQUIRED" && (
              <Button
                size="sm"
                onClick={() => handleViewSubmission(assignment)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Start Review
              </Button>
            )}
            {assignment.status === "COMPLETED" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewSubmission(assignment)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isAssignmentsLoading) {
    return (
      <RoleBasedRoute allowedRoles={["REVIEWER"]}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </RoleBasedRoute>
    );
  }

  if (assignmentsError) {
    return (
      <RoleBasedRoute allowedRoles={["REVIEWER"]}>
        <div className="flex items-center justify-center h-96">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>
                Failed to load review assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {assignmentsError?.message || "An error occurred"}
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </RoleBasedRoute>
    );
  }

  return (
    <RoleBasedRoute allowedRoles={["REVIEWER"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Review Assignments</h1>
          <p className="text-muted-foreground">
            Manage your peer review invitations and assignments
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl">
                {pendingAssignments.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="text-3xl">
                {acceptedAssignments.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {completedAssignments.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">
                {assignments?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">
              All ({assignments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="PENDING">
              Pending ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="ACCEPTED">
              Accepted ({acceptedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="COMPLETED">
              Completed ({completedAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="DECLINED">
              Declined ({declinedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {assignments && assignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No assignments yet</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't been assigned any reviews yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="PENDING" className="space-y-4 mt-6">
            {pendingAssignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No pending invitations</h3>
                  <p className="text-sm text-muted-foreground">
                    You have no pending review invitations at this time
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ACCEPTED" className="space-y-4 mt-6">
            {acceptedAssignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No accepted reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    You have no accepted review assignments
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {acceptedAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="COMPLETED" className="space-y-4 mt-6">
            {completedAssignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No completed reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t completed any reviews yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="DECLINED" className="space-y-4 mt-6">
            {declinedAssignments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No declined reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t declined any review invitations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {declinedAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Decline Dialog */}
        <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Review Assignment</DialogTitle>
              <DialogDescription>
                Please provide a reason for declining this review assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="decline-reason">Reason *</Label>
                <Textarea
                  id="decline-reason"
                  placeholder="e.g., Conflict of interest, Time constraints, Outside expertise area..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeclineDialogOpen(false);
                  setDeclineReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeclineConfirm}
                disabled={declineMutation.isPending || !declineReason.trim()}
              >
                {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleBasedRoute>
  );
}
