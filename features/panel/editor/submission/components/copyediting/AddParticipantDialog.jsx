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
import { toast } from "sonner";
import { SearchableSelect } from "@/features/shared";
import { useGetUsers } from "@/features";
import { useAddCopyeditingParticipant } from "../../hooks";

/**
 * Dialog to add a participant to an existing copyediting assignment
 * Uses the POST /api/v1/submissions/copyediting/assignments/{id}/add_participant/ endpoint
 */
export function AddParticipantDialog({ isOpen, onClose, assignmentId }) {
  const [selectedUserId, setSelectedUserId] = useState("");

  // Fetch all users (editors, reviewers, etc.)
  const {
    data: usersData,
    isPending: loadingUsers,
    error: usersError,
  } = useGetUsers(
    { userRole: "EDITOR" }, // Can be adjusted to include other roles
    {
      enabled: isOpen,
    }
  );

  // Transform users data to options for SearchableSelect
  const userOptions =
    usersData?.results?.map((user) => ({
      value: user?.profile?.id.toString(),
      label: `${user.profile.display_name || user.profile.user_name} (${
        user.email
      })`,
    })) || [];

  // Use the add participant hook
  const addParticipant = useAddCopyeditingParticipant();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    addParticipant.mutate(
      {
        assignmentId,
        data: {
          profile_id: selectedUserId,
        },
      },
      {
        onSuccess: () => {
          // Reset and close
          setSelectedUserId("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>
            Add an additional participant or collaborator to this copyediting
            assignment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participant">Participant</Label>
            <SearchableSelect
              options={userOptions}
              value={selectedUserId}
              onChange={(value) => setSelectedUserId(value)}
              placeholder={
                loadingUsers ? "Loading users..." : "Select a participant"
              }
              emptyText={
                usersError
                  ? "Error loading users"
                  : userOptions.length === 0
                  ? "No users found"
                  : "No user found."
              }
              searchPlaceholder="Search by name or email..."
              disabled={loadingUsers || addParticipant.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Search for users by name or email address to add as a participant
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={addParticipant.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedUserId || addParticipant.isPending}
            >
              {addParticipant.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Add Participant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
