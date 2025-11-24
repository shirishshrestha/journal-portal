"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleBasedRoute } from "@/features";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetReviewAssignments } from "@/features/panel/reviewer/hooks/useGetReviewAssignments";

export default function AssignmentsLayout({ children }) {
  const pathname = usePathname();
  const { data: assignmentsData, isLoading } = useGetReviewAssignments();

  // Extract assignments array
  const assignments = Array.isArray(assignmentsData)
    ? assignmentsData
    : assignmentsData?.results || [];

  // Filter assignments by status
  const pendingCount =
    assignments?.filter((a) => a.status === "PENDING").length || 0;
  const acceptedCount =
    assignments?.filter((a) => a.status === "ACCEPTED").length || 0;
  const completedCount =
    assignments?.filter((a) => a.status === "COMPLETED").length || 0;
  const declinedCount =
    assignments?.filter((a) => a.status === "DECLINED").length || 0;

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname.includes("/pending")) return "pending";
    if (pathname.includes("/accepted")) return "accepted";
    if (pathname.includes("/completed")) return "completed";
    if (pathname.includes("/declined")) return "declined";
    return "overview";
  };

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
          <Link href="/reviewer/assignments/pending">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? "..." : pendingCount}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/reviewer/assignments/accepted">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardDescription>Accepted</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? "..." : acceptedCount}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/reviewer/assignments/completed">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? "..." : completedCount}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/reviewer/assignments/declined">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardDescription>Declined</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? "..." : declinedCount}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList>
            <Link href="/reviewer/assignments">
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </Link>
            <Link href="/reviewer/assignments/pending">
              <TabsTrigger value="pending">
                Pending ({isLoading ? "..." : pendingCount})
              </TabsTrigger>
            </Link>
            <Link href="/reviewer/assignments/accepted">
              <TabsTrigger value="accepted">
                Accepted ({isLoading ? "..." : acceptedCount})
              </TabsTrigger>
            </Link>
            <Link href="/reviewer/assignments/completed">
              <TabsTrigger value="completed">
                Completed ({isLoading ? "..." : completedCount})
              </TabsTrigger>
            </Link>
            <Link href="/reviewer/assignments/declined">
              <TabsTrigger value="declined">
                Declined ({isLoading ? "..." : declinedCount})
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {/* Page Content */}
        {children}
      </div>
    </RoleBasedRoute>
  );
}
