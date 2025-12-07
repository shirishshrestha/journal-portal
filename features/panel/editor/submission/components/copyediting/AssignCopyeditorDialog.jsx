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
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SearchableSelect } from "@/features/shared";
import { useGetUsers } from "@/features";

/**
 * Dialog to assign a copyeditor to a submission
 * Reuses the pattern from StaffSettings AddStaffDialog
 */
export function AssignCopyeditorDialog({ isOpen, onClose, submissionId }) {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users with COPY_EDITOR or EDITOR role
  // Note: Adjust role based on your backend role naming
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a copyeditor");
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Implement the API call to assign copyeditor
      // Example:
      // await assignCopyeditor({ submissionId, userId: selectedUserId });

      // For now, just show success message
      toast.success("Copyeditor assigned successfully");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["editor-submission", submissionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["copyediting-participants", submissionId],
      });

      // Reset and close
      setSelectedUserId("");
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Failed to assign copyeditor.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
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
              disabled={loadingUsers || isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Search for users by name or email address
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUserId || isSubmitting}>
              {isSubmitting && (
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
