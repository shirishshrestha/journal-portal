'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FileEdit, Clock, CheckCircle2, AlertCircle, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DataTable, ErrorCard, FilterToolbar } from '@/features/shared';
import { useCopyeditingAssignments } from '@/features/panel/editor/submission/hooks';
import EllipsisTooltip from '@/components/ui/EllipsisTooltip';

export default function CopyeditingAssignmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const searchQuery = searchParams.get('search') || '';

  // Get current user's profile ID
  const userData = useSelector((state) => state?.auth?.userData);
  const currentUserProfileId = userData?.profile?.id;

  // Fetch copyediting assignments for the current user, backend filtering only
  const {
    data: assignmentsData,
    isPending,
    error,
    refetch,
  } = useCopyeditingAssignments({
    copyeditor: currentUserProfileId,
    status: statusFilter,
    search: searchQuery,
  });

  const assignments = assignmentsData?.results || [];

  // Calculate statistics
  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === 'PENDING').length,
    in_progress: assignments.filter((a) => a.status === 'IN_PROGRESS').length,
    completed: assignments.filter((a) => a.status === 'COMPLETED').length,
    overdue: assignments.filter((a) => a.is_overdue).length,
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-primary-foreground',
      IN_PROGRESS: 'text-blue-700 dark:text-primary-foreground bg-blue-100 dark:bg-blue-600',
      COMPLETED: 'bg-green-100 dark:bg-green-600 text-green-700 dark:text-primary-foreground',
      CANCELLED: 'text-red-700 dark:text-primary-foreground bg-red-100 dark:bg-red-600',
    };
    return (
      colors[status] || 'text-gray-700 dark:text-primary-foreground bg-gray-100 dark:bg-gray-800'
    );
  };

  const getStatusDisplay = (status) => {
    const displays = {
      PENDING: 'Pending',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return displays[status] || status;
  };

  const handleViewAssignment = (assignment) => {
    router.push(`/editor/submissions/${assignment.submission_id}/copyediting`);
  };

  const columns = [
    {
      key: 'submission_title',
      header: 'Submission',
      cellClassName: 'font-medium',
      render: (row) => (
        <div className="max-w-md">
          <EllipsisTooltip text={row.submission_title} maxWidth={50} />
          <p className="text-xs text-muted-foreground">ID: {row.submission_id}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Badge variant="outline" className={getStatusBadgeColor(row.status)}>
          {getStatusDisplay(row.status)}
        </Badge>
      ),
    },
    {
      key: 'assigned_at',
      header: 'Assigned',
      render: (row) => (
        <span className="text-sm">{format(new Date(row.assigned_at), 'MMM d, yyyy')}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`text-sm ${row.is_overdue ? 'text-red-600 font-medium' : ''}`}>
            {row.due_date ? format(new Date(row.due_date), 'MMM d, yyyy') : 'N/A'}
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
      key: 'completed_at',
      header: 'Completed',
      render: (row) => (
        <span className="text-sm">
          {row.completed_at ? format(new Date(row.completed_at), 'MMM d, yyyy') : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewAssignment(row)}>
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
          title="Error Loading Copyediting Assignments"
          message={error?.message || 'Failed to load assignments'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Copyediting Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage your assigned copyediting tasks</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
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
            <FileEdit className="h-4 w-4 text-blue-600" />
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
            <div className="text-2xl font-semibold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search by submission title..."
          label="Search"
        />
        <FilterToolbar.Select
          paramName="status"
          label="Status"
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
      </FilterToolbar>

      {/* Assignments Table */}
      <h2 className="text-xl font-semibold">Assignments ({assignments.length})</h2>
      <DataTable
        data={assignments}
        columns={columns}
        isPending={isPending}
        error={error}
        emptyMessage="No copyediting assignments found"
        errorMessage="Error loading assignments"
        hoverable={true}
        tableClassName="bg-card border flex justify-center"
      />
    </div>
  );
}
