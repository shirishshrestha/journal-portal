"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export function DeclineDialog({
  open,
  onOpenChange,
  selectedAssignment,
  declineMutation,
  onSuccess,
}) {
  const [declineReason, setDeclineReason] = useState("");

  const handleDeclineConfirm = () => {
    if (!declineReason.trim()) {
      toast.warning("Please provide a reason for declining");
      return;
    }

    if (!selectedAssignment) return;

    declineMutation.mutate(
      {
        id: selectedAssignment.id,
        data: { decline_reason: declineReason },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setDeclineReason("");
          onSuccess();
          toast.success("Review assignment declined");
        },
        onError: (error) => {
          toast.error(
            `Failed to decline: ${error.response?.data?.error || error.message}`
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onOpenChange(false);
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
  );
}
