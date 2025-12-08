"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, Eye, Loader2 } from "lucide-react";
import {
  DataTable,
  ErrorCard,
  LoadingScreen,
  FilterToolbar,
  useGetJournals,
} from "@/features/shared";
import { useGetMyAssignedJournals } from "@/features/panel/editor/journal";
import { Badge } from "@/components/ui/badge";

export default function MyAssignedJournalsPage() {
  const router = useRouter();

  // Fetch journals where the current user is a staff member
  const {
    data: journalsData,
    isPending: isJournalsPending,
    error: journalsError,
    refetch: refetchJournals,
  } = useGetJournals();

  const journals = journalsData?.results || journalsData || [];

  const getRoleBadgeColor = (role) => {
    const colors = {
      EDITOR_IN_CHIEF:
        "bg-purple-100 dark:bg-purple-600 text-purple-800 dark:text-primary-foreground border-purple-200 dark:border-purple-700",
      MANAGING_EDITOR:
        "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-primary-foreground border-blue-200 dark:border-blue-700",
      ASSOCIATE_EDITOR:
        "bg-cyan-100 dark:bg-cyan-600 text-cyan-700 dark:text-primary-foreground border-cyan-200 dark:border-cyan-700",
      SECTION_EDITOR:
        "bg-green-100 dark:bg-green-600 text-green-700 dark:text-primary-foreground border-green-200 dark:border-green-700",
      GUEST_EDITOR:
        "bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-primary-foreground border-yellow-200 dark:border-yellow-700",
      REVIEWER:
        "bg-orange-100 dark:bg-orange-600 text-orange-700 dark:text-primary-foreground border-orange-200 dark:border-orange-700",
    };
    return (
      colors[role] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-primary-foreground border-gray-200 dark:border-gray-700"
    );
  };

  const columns = [
    {
      key: "title",
      header: "Journal Title",
      cellClassName: "font-medium",
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium truncate">{row.title}</p>
          {row.abbreviation && (
            <p className="text-xs text-muted-foreground">{row.abbreviation}</p>
          )}
        </div>
      ),
    },
    {
      key: "my_role",
      header: "My Role",
      render: (row) => {
        // Find the current user's role in this journal's staff_members
        const myStaffMember = row.staff_members?.find(
          (staff) => staff.profile?.user_email === row.my_staff_role?.email
        );
        const role =
          myStaffMember?.role_display ||
          row.my_staff_role?.role_display ||
          "Staff";
        const roleKey = myStaffMember?.role || row.my_staff_role?.role || "";

        return (
          <Badge variant="outline" className={getRoleBadgeColor(roleKey)}>
            {role}
          </Badge>
        );
      },
    },
    {
      key: "submissions_count",
      header: "Submissions",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{row.submissions_count || 0}</span>
        </div>
      ),
    },
    {
      key: "staff_count",
      header: "Staff Members",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.staff_members?.length || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          variant="outline"
          className={
            row.is_active
              ? "text-green-700 dark:text-primary-foreground bg-green-100 dark:bg-green-600"
              : "text-gray-700 dark:text-primary-foreground bg-gray-200 dark:bg-gray-80"
          }
        >
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/editor/my-journals/${row.id}/submissions`)
          }
        >
          <Eye className="h-4 w-4 mr-2" />
          View Submissions
        </Button>
      ),
    },
  ];

  if (journalsError) {
    return (
      <ErrorCard
        title="Failed to load your assigned journals"
        description={
          journalsError?.message ||
          "Unable to load journals. Please try again later."
        }
        onRetry={refetchJournals}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Assigned Journals
          </h1>
          <p className="text-muted-foreground">
            Journals where you are assigned as a staff member
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {!isJournalsPending && journals.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Journals
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journals.length}</div>
              <p className="text-xs text-muted-foreground">
                Journals you&apos;re assigned to
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journals.reduce(
                  (acc, journal) => acc + (journal.submissions_count || 0),
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all your journals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Roles
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journals.filter((j) => j.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active journal assignments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <h1>Assigned Journals</h1>

      <DataTable
        data={journals}
        columns={columns}
        emptyMessage="You are not assigned to any journals yet"
        isPending={isJournalsPending}
        error={journalsError}
        errorMessage="Error loading journals"
        hoverable={true}
        tableClassName="bg-card border flex justify-center"
      />
    </div>
  );
}
