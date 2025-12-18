'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Trash2,
  Save,
  FileText,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ErrorCard, LoadingScreen, ConfirmationPopup } from '@/features/shared';
import { usePublicationSchedule, useUpdatePublicationSchedule } from '@/features';
import {
  useCancelPublicationSchedule,
  useDeletePublicationSchedule,
  usePublishNow,
} from '@/features/panel/editor/submission/hooks/mutation/usePublicationScheduleMutations';

export default function PublicationScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    scheduled_date: '',
    volume: '',
    issue: '',
    year: '',
    doi: '',
    pages: '',
  });

  // Fetch schedule details
  const {
    data: schedule,
    isPending,
    error,
    refetch,
  } = usePublicationSchedule(scheduleId, {
    onSuccess: (data) => {
      setFormData({
        scheduled_date: data.scheduled_date
          ? new Date(data.scheduled_date).toISOString().slice(0, 16)
          : '',
        volume: data.volume || '',
        issue: data.issue || '',
        year: data.year || '',
        doi: data.doi || '',
        pages: data.pages || '',
      });
    },
  });

  // Mutations
  const updateMutation = useUpdatePublicationSchedule();
  const deleteMutation = useDeletePublicationSchedule();
  const cancelMutation = useCancelPublicationSchedule();
  const publishMutation = usePublishNow();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(
      {
        scheduleId,
        data: {
          ...formData,
          year: parseInt(formData.year),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      }
    );
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setCancelDialogOpen(true);
  };

  const handlePublish = () => {
    setPublishDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(scheduleId, {
      onSuccess: () => {
        router.push('/editor/publication-schedules');
      },
    });
  };

  const confirmCancel = () => {
    cancelMutation.mutate(scheduleId, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        refetch();
      },
    });
  };

  const confirmPublish = () => {
    publishMutation.mutate(scheduleId, {
      onSuccess: () => {
        setPublishDialogOpen(false);
        refetch();
      },
    });
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

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <ErrorCard
          title="Error Loading Publication Schedule"
          message={error?.message || 'Failed to load schedule'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => router.push('/editor/publication-schedules')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedules
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Publication Schedule Details</h1>
          <p className="text-muted-foreground mt-2">{schedule?.submission_title}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusBadgeColor(schedule?.status)}>
            {schedule?.status_display}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Schedule Information Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm: gap-2 sm:gap-0 sm:items-center justify-between">
          <CardTitle>Schedule Information</CardTitle>
          <div className="flex gap-2">
            {!isEditing && schedule?.status === 'SCHEDULED' && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="default" size="sm" onClick={handlePublish}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Publish <span className='hidden sm:inline'>Now</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data
                    setFormData({
                      scheduled_date: schedule.scheduled_date
                        ? new Date(schedule.scheduled_date).toISOString().slice(0, 16)
                        : '',
                      volume: schedule.volume || '',
                      issue: schedule.issue || '',
                      year: schedule.year || '',
                      doi: schedule.doi || '',
                      pages: schedule.pages || '',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
            {schedule?.status !== 'PUBLISHED' && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Scheduled Date</Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue</Label>
                <Input
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  name="doi"
                  value={formData.doi}
                  onChange={handleInputChange}
                  placeholder="e.g., 10.1234/journal.v1i1.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="e.g., 1-10"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {schedule?.scheduled_date
                        ? format(new Date(schedule.scheduled_date), 'PPpp')
                        : 'Not set'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published Date</p>
                  <p className="font-medium mt-1">
                    {schedule?.published_date
                      ? format(new Date(schedule.published_date), 'PPpp')
                      : 'Not published yet'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="font-medium mt-1">{schedule?.volume || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue</p>
                  <p className="font-medium mt-1">{schedule?.issue || 'Not set'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium mt-1">{schedule?.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DOI</p>
                  <p className="font-medium mt-1">{schedule?.doi || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium mt-1">{schedule?.pages || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled By</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{schedule?.scheduled_by?.user_name || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium mt-1">{schedule?.submission_title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Submission ID</p>
            <p className="font-medium mt-1">{schedule?.submission}</p>
          </div>
       
        </CardContent>
      </Card>

      {/* Timestamps Card */}
      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium mt-1">
                {schedule?.created_at ? format(new Date(schedule.created_at), 'PPpp') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium mt-1">
                {schedule?.updated_at ? format(new Date(schedule.updated_at), 'PPpp') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
