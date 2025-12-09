"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  Edit,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCancelPublication,
  usePublicationSchedules,
  usePublishNow,
  useSchedulePublication,
  useUpdatePublicationSchedule,
} from "../../hooks";

/**
 * Component to manage publication scheduling
 * Allows scheduling publication with metadata (volume, issue, DOI, etc.)
 */
export function PublicationSchedule({ submission, submissionId }) {
  const queryClient = useQueryClient();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduled_date: "",
    volume: "",
    issue: "",
    year: new Date().getFullYear(),
    doi: "",
    pages: "",
  });

  // Fetch publication schedule
  const {
    data: schedules = [],
    isLoading,
    error,
  } = usePublicationSchedules(submissionId);

  const schedule = schedules[0]; // Assuming one schedule per submission

  // Mutations
  const scheduleCreateMutation = useSchedulePublication(submissionId);
  const scheduleUpdateMutation = useUpdatePublicationSchedule(submissionId);
  const publishNowMutation = usePublishNow(submissionId);
  const cancelMutation = useCancelPublication(submissionId);

  const resetScheduleForm = () => {
    setScheduleData({
      scheduled_date: "",
      volume: "",
      issue: "",
      year: new Date().getFullYear(),
      doi: "",
      pages: "",
    });
    setIsEditMode(false);
  };

  const handleScheduleSuccess = () => {
    setIsScheduleDialogOpen(false);
    resetScheduleForm();
  };

  const handleScheduleClick = () => {
    if (schedule) {
      // Edit mode
      setIsEditMode(true);
      setScheduleData({
        scheduled_date: schedule.scheduled_date
          ? new Date(schedule.scheduled_date).toISOString().slice(0, 16)
          : "",
        volume: schedule.volume || "",
        issue: schedule.issue || "",
        year: schedule.year || new Date().getFullYear(),
        doi: schedule.doi || "",
        pages: schedule.pages || "",
      });
    } else {
      // Create mode
      setIsEditMode(false);
      resetScheduleForm();
    }
    setIsScheduleDialogOpen(true);
  };

  const handleSchedule = () => {
    if (!scheduleData.scheduled_date) {
      toast.error("Please select a publication date");
      return;
    }

    if (!scheduleData.volume || !scheduleData.issue) {
      toast.error("Please provide volume and issue numbers");
      return;
    }

    const data = {
      scheduled_date: new Date(scheduleData.scheduled_date).toISOString(),
      volume: scheduleData.volume,
      issue: scheduleData.issue,
      year: parseInt(scheduleData.year),
      doi: scheduleData.doi || null,
      pages: scheduleData.pages || null,
    };

    if (isEditMode && schedule) {
      scheduleUpdateMutation.mutate(
        { id: schedule.id, ...data },
        {
          onSuccess: handleScheduleSuccess,
        }
      );
    } else {
      scheduleCreateMutation.mutate(data, {
        onSuccess: handleScheduleSuccess,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Scheduled
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge variant="success" className="gap-1">
            <Globe className="h-3 w-3" />
            Published
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publication Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>Error loading publication schedule</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Publication Schedule</CardTitle>
              <CardDescription className="mt-1">
                Schedule this article for publication with metadata
              </CardDescription>
            </div>
            {schedule?.status !== "PUBLISHED" && (
              <Button size="sm" onClick={handleScheduleClick}>
                <Calendar className="h-4 w-4 mr-2" />
                {schedule ? "Edit Schedule" : "Schedule Publication"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!schedule ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Publication Scheduled
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Schedule this article for publication by providing volume,
                issue, and publication date information.
              </p>
              <Button onClick={handleScheduleClick}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Now
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(schedule.status)}
              </div>

              {/* Publication Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Volume</p>
                  <p className="font-medium">{schedule.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue</p>
                  <p className="font-medium">{schedule.issue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Year</p>
                  <p className="font-medium">{schedule.year}</p>
                </div>
                {schedule.pages && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pages</p>
                    <p className="font-medium">{schedule.pages}</p>
                  </div>
                )}
              </div>

              {/* DOI */}
              {schedule.doi && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">DOI</p>
                  <p className="font-medium font-mono text-sm break-all">
                    {schedule.doi}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Scheduled Date
                  </p>
                  <p className="font-medium">
                    {format(
                      new Date(schedule.scheduled_date),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                {schedule.published_date && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Published Date
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(schedule.published_date),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Scheduled By */}
              {schedule.scheduled_by && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Scheduled By
                  </p>
                  <p className="font-medium">
                    {schedule.scheduled_by.user?.first_name}{" "}
                    {schedule.scheduled_by.user?.last_name}
                  </p>
                </div>
              )}

              {/* Actions */}
              {schedule.status === "SCHEDULED" && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    onClick={() => publishNowMutation.mutate()}
                    disabled={publishNowMutation.isPending}
                    className="flex-1"
                  >
                    {publishNowMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Publish Now
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule/Edit Dialog */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Edit Publication Schedule"
                : "Schedule Publication"}
            </DialogTitle>
            <DialogDescription>
              Provide publication metadata including volume, issue, and
              publication date
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">
                  Volume <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="volume"
                  value={scheduleData.volume}
                  onChange={(e) =>
                    setScheduleData((prev) => ({
                      ...prev,
                      volume: e.target.value,
                    }))
                  }
                  placeholder="e.g., 10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">
                  Issue <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="issue"
                  value={scheduleData.issue}
                  onChange={(e) =>
                    setScheduleData((prev) => ({
                      ...prev,
                      issue: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">
                Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                value={scheduleData.year}
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    year: parseInt(e.target.value),
                  }))
                }
                min={2000}
                max={2100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">
                Scheduled Publication Date{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                value={scheduleData.scheduled_date}
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    scheduled_date: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI (Optional)</Label>
              <Input
                id="doi"
                value={scheduleData.doi}
                onChange={(e) =>
                  setScheduleData((prev) => ({ ...prev, doi: e.target.value }))
                }
                placeholder="e.g., 10.1234/journal.v10i2.123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Page Range (Optional)</Label>
              <Input
                id="pages"
                value={scheduleData.pages}
                onChange={(e) =>
                  setScheduleData((prev) => ({
                    ...prev,
                    pages: e.target.value,
                  }))
                }
                placeholder="e.g., 45-67"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsScheduleDialogOpen(false);
                resetScheduleForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Scheduling..."}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Schedule" : "Schedule Publication"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
