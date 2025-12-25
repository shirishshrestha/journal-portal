'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, CheckCircle2, Clock, XCircle, Eye, Trash2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  DataTable,
  ErrorCard,
  FilterToolbar,
  ConfirmationPopup,
} from '@/features/shared';
import {
  useCancelPublicationSchedule,
  useDeletePublicationSchedule,
  usePublishNow,
} from '@/features/panel/editor/submission/hooks/mutation/usePublicationScheduleMutations';
import { usePublicationSchedules } from '@/features';

export default function PublicationSchedulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');
  const searchQuery = searchParams.get('search');

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState(null);

  // Build params for backend filtering
  const params = {
    status: statusFilter,
    search: searchQuery,
  };

  // Fetch publication schedules
  const { data: schedulesData, isPending, error, refetch } = usePublicationSchedules(params);

  const schedules = schedulesData?.results || [];

  // Mutations
  const deleteMutation = useDeletePublicationSchedule();
  const cancelMutation = useCancelPublicationSchedule();
  const publishMutation = usePublishNow();

  // Calculate statistics (from backend if available, else fallback to current data)
  const stats = {
    total: schedulesData?.count ?? schedules.length,
    scheduled: schedulesData?.results?.filter((s) => s.status === 'SCHEDULED').length ?? 0,
    published: schedulesData?.results?.filter((s) => s.status === 'PUBLISHED').length ?? 0,
    cancelled: schedulesData?.results?.filter((s) => s.status === 'CANCELLED').length ?? 0,
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-primary-foreground',
      PUBLISHED: 'bg-green-100 dark:bg-green-600 text-green-700 dark:text-primary-foreground',
      CANCELLED: 'bg-red-100 dark:bg-red-600 text-red-700 dark:text-primary-foreground',
    };
    return (
      colors[status] || 'text-gray-700 dark:text-primary-foreground bg-gray-100 dark:bg-gray-800'
    );
  };

  const handleView = (schedule) => {
    router.push(`/editor/publication-schedules/${schedule.id}`);
  };

  const handleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleCancel = (schedule) => {
    setSelectedSchedule(schedule);
    setCancelDialogOpen(true);
  };

  const handlePublish = (schedule) => {
    setSelectedSchedule(schedule);
    setPublishDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSchedule) {
      deleteMutation.mutate(selectedSchedule.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedSchedule(null);
          refetch();
        },
      });
    }
  };

  const confirmCancel = () => {
    if (selectedSchedule) {
      cancelMutation.mutate(selectedSchedule.id, {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setSelectedSchedule(null);
          refetch();
        },
      });
    }
  };

  const confirmPublish = () => {
    if (selectedSchedule) {
      publishMutation.mutate(selectedSchedule.id, {
        onSuccess: () => {
          setPublishDialogOpen(false);
          setSelectedSchedule(null);
          refetch();
        },
      });
    }
  };

  const columns = [
    {
      key: 'submission_title',
      header: 'Submission',
      cellClassName: 'font-medium',
      render: (row) => (
        <div className="max-w-md">
          <p className="font-medium truncate">{row.submission_title}</p>
          <p className="text-xs text-muted-foreground">
            Vol. {row.volume || 'N/A'}, Issue {row.issue || 'N/A'} ({row.year})
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <Badge variant="outline" className={getStatusBadgeColor(row.status)}>
          {row.status_display}
        </Badge>
      ),
    },
    {
      key: 'scheduled_date',
      header: 'Scheduled Date',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{format(new Date(row.scheduled_date), 'MMM d, yyyy')}</span>
        </div>
      ),
    },
    {
      key: 'published_date',
      header: 'Published Date',
      render: (row) => (
        <span className="text-sm">
          {row.published_date ? format(new Date(row.published_date), 'MMM d, yyyy') : '-'}
        </span>
      ),
    },
    {
      key: 'doi',
      header: 'DOI',
      render: (row) => (
        <span className="text-sm text-muted-foreground">{row.doi || 'Not assigned'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'SCHEDULED' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handlePublish(row)}>
                <PlayCircle className="h-4 w-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleCancel(row)}>
                <XCircle className="h-4 w-4 text-orange-600" />
              </Button>
            </>
          )}
          {row.status !== 'PUBLISHED' && (
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard
          title="Error Loading Publication Schedules"
          message={error?.message || 'Failed to load schedules'}
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
          <h1 className="text-3xl font-semibold tracking-tight">Publication Schedules</h1>
          <p className="text-muted-foreground mt-1">Manage scheduled and published submissions</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Awaiting publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Live articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterToolbar>
        <FilterToolbar.Search
          paramName="search"
          placeholder="Search by submission title or DOI..."
          label="Search"
        />
        <FilterToolbar.Select
          paramName="status"
          label="Status"
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
      </FilterToolbar>

      {/* Schedules Table */}
      <h2 className="text-xl font-semibold">Schedules ({stats.total})</h2>
      <DataTable
        data={schedules}
        columns={columns}
        isPending={isPending}
        error={error}
        emptyMessage="No publication schedules found"
        errorMessage="Error loading schedules"
        hoverable={true}
        tableClassName="bg-card border flex justify-center"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationPopup
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Publication Schedule"
        description="Are you sure you want to delete this publication schedule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
        loadingText="Deleting..."
        variant="danger"
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationPopup
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Publication Schedule"
        description="Are you sure you want to cancel this publication schedule? The submission will be moved back to production."
        confirmText="Cancel Schedule"
        cancelText="Close"
        onConfirm={confirmCancel}
        isPending={cancelMutation.isPending}
        loadingText="Cancelling..."
        variant="warning"
      />

      {/* Publish Now Confirmation Dialog */}
      <ConfirmationPopup
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        title="Publish Now"
        description="Are you sure you want to publish this submission immediately? This will make it publicly available."
        confirmText="Publish Now"
        cancelText="Cancel"
        onConfirm={confirmPublish}
        isPending={publishMutation.isPending}
        loadingText="Publishing..."
        variant="primary"
      />
    </div>
  );
}
