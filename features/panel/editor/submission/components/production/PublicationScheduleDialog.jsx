"use client";

import React, { useState } from "react";
import { Calendar, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreatePublicationSchedule } from "../../hooks";

/**
 * Dialog for scheduling a submission for publication
 */
export function PublicationScheduleDialog({
  isOpen,
  onClose,
  submissionId,
  submissionTitle,
}) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    scheduled_date: "",
    volume: "",
    issue: "",
    year: currentYear.toString(),
    doi: "",
    pages: "",
  });

  const createMutation = useCreatePublicationSchedule();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.scheduled_date) {
      toast.error("Scheduled date is required");
      return;
    }

    if (!formData.year) {
      toast.error("Year is required");
      return;
    }

    // Convert scheduled_date to ISO format
    const scheduledDate = new Date(formData.scheduled_date);
    if (isNaN(scheduledDate.getTime())) {
      toast.error("Invalid date format");
      return;
    }

    const data = {
      submission: submissionId,
      scheduled_date: scheduledDate.toISOString(),
      volume: formData.volume || "",
      issue: formData.issue || "",
      year: parseInt(formData.year, 10),
      doi: formData.doi || "",
      pages: formData.pages || "",
    };

    createMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        resetForm();
      },
    });
  };

  const resetForm = () => {
    setFormData({
      scheduled_date: "",
      volume: "",
      issue: "",
      year: currentYear.toString(),
      doi: "",
      pages: "",
    });
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule for Publication</DialogTitle>
          <DialogDescription>
            Set publication date and metadata for:{" "}
            <strong>{submissionTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Publication Date *
            </Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={(e) => handleChange("scheduled_date", e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            <p className="text-xs text-muted-foreground">
              The date and time when this article will be published
            </p>
          </div>

          {/* Volume, Issue, Year */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                type="text"
                placeholder="e.g., 12"
                value={formData.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue">Issue</Label>
              <Input
                id="issue"
                type="text"
                placeholder="e.g., 3"
                value={formData.issue}
                onChange={(e) => handleChange("issue", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder={currentYear.toString()}
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                min="1900"
                max="2100"
                required
              />
            </div>
          </div>

          {/* DOI */}
          <div className="space-y-2">
            <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
            <Input
              id="doi"
              type="text"
              placeholder="e.g., 10.1234/journal.2024.001"
              value={formData.doi}
              onChange={(e) => handleChange("doi", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty if not yet assigned. Can be updated later.
            </p>
          </div>

          {/* Pages */}
          <div className="space-y-2">
            <Label htmlFor="pages">Page Range</Label>
            <Input
              id="pages"
              type="text"
              placeholder="e.g., 123-145"
              value={formData.pages}
              onChange={(e) => handleChange("pages", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Page numbers in the journal issue (e.g., &quot;1-25&quot; or
              &quot;e001234&quot;)
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Publication
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
