"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DataTable, ErrorCard, LoadingScreen } from "@/features/shared";
import { useProductionAssignments } from "@/features/panel/editor/submission/hooks";

export default function ProductionAssignmentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user's profile ID
  const userData = useSelector((state) => state?.auth?.userData);
  const currentUserProfileId = userData?.profile?.id;

  // Fetch production assignments for the current user
  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useProductionAssignments({
    production_assistant: currentUserProfileId,
  });

  const assignments = assignmentsData?.results || [];

  // Filter assignments based on status and search query
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesStatus =
      statusFilter === "all" || assignment.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      assignment.submission_title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "PENDING").length,
    in_progress: assignments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: assignments.filter((a) => a.status === "COMPLETED").length,
    overdue: assignments.filter((a) => a.is_overdue).length,
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusDisplay = (status) => {
    const displays = {
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };
    return displays[status] || status;
  };

  const handleViewAssignment = (assignment) => {
    router.push(`/editor/submissions/${assignment.submission_id}/production`);
  };

  const columns = [
    {
      key: "submission_title",
      header: "Submission",
      cellClassName: "font-medium",
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium truncate">{row.submission_title}</p>
          <p className="text-xs text-muted-foreground">
            ID: {row.submission_id}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (row) => (
        <Badge variant="outline" className={getStatusBadgeColor(row.status)}>
          {getStatusDisplay(row.status)}
        </Badge>
      ),
    },
    {
      key: "assigned_at",
      header: "Assigned",
      render: (row) => (
        <span className="text-sm">
          {format(new Date(row.assigned_at), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span
            className={`text-sm ${
              row.is_overdue ? "text-red-600 font-medium" : ""
            }`}
          >
            {row.due_date
              ? format(new Date(row.due_date), "MMM d, yyyy")
              : "N/A"}
          </span>
          {row.is_overdue && (
            <Badge variant="destructive" className="text-xs">
              Overdue
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "completed_at",
      header: "Completed",
      render: (row) => (
        <span className="text-sm">
          {row.completed_at
            ? format(new Date(row.completed_at), "MMM d, yyyy")
            : "-"}
        </span>
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
          onClick={() => handleViewAssignment(row)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard
          title="Error Loading Production Assignments"
          message={error?.message || "Failed to load assignments"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            My Production Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assigned production tasks
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Not started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.in_progress}</div>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by submission title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments ({filteredAssignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredAssignments}
            columns={columns}
            isPending={isPending}
            error={error}
            emptyMessage="No production assignments found"
            errorMessage="Error loading assignments"
            hoverable={true}
            tableClassName="border"
          />
        </CardContent>
      </Card>
    </div>
  );
}
