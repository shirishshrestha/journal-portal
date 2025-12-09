"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SearchableSelect } from "@/features/shared";
import { useGetUsers } from "@/features";
import { useCreateCopyeditingAssignment } from "../../hooks";

/**
 * Dialog to assign a copyeditor to a submission
 * Reuses the pattern from StaffSettings AddStaffDialog
 */
export function AssignCopyeditorDialog({ isOpen, onClose, submissionId }) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Fetch users with COPY_EDITOR or EDITOR role
  const {
    data: usersData,
    isPending: loadingUsers,
    error: usersError,
  } = useGetUsers(
    { userRole: "EDITOR" }, // or "COPY_EDITOR" if you have this role
    {
      enabled: isOpen,
    }
  );

  // Transform users data to options for SearchableSelect
  const userOptions =
    usersData?.results?.map((user) => ({
      value: user.id.toString(),
      label: `${user.display_name || user.user_name} (${user.user_email})`,
    })) || [];

  // Use the create assignment hook
  const createAssignment = useCreateCopyeditingAssignment();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a copyeditor");
      return;
    }

    // Set due date to 30 days from now if not specified
    const assignmentDueDate =
      dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    createAssignment.mutate(
      {
        submission: submissionId,
        copyeditor_id: selectedUserId,
        due_date: assignmentDueDate,
        instructions:
          instructions || "Please review and copyedit this manuscript.",
      },
      {
        onSuccess: () => {
          // Reset and close
          setSelectedUserId("");
          setDueDate("");
          setInstructions("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedUserId("");
    setDueDate("");
    setInstructions("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Copyeditor</DialogTitle>
          <DialogDescription>
            Select a user with copyediting expertise to work on this submission
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyeditor">Copyeditor</Label>
            <SearchableSelect
              options={userOptions}
              value={selectedUserId}
              onChange={(value) => setSelectedUserId(value)}
              placeholder={
                loadingUsers ? "Loading users..." : "Select a copyeditor"
              }
              emptyText={
                usersError
                  ? "Error loading users"
                  : userOptions.length === 0
                  ? "No copyeditors found"
                  : "No user found."
              }
              searchPlaceholder="Search by name or email..."
              disabled={loadingUsers || createAssignment.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Search for users by name or email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={createAssignment.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Defaults to 30 days from now if not specified
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide specific instructions for the copyeditor..."
              rows={3}
              disabled={createAssignment.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createAssignment.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedUserId || createAssignment.isPending}
            >
              {createAssignment.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Assign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
