"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/features/shared/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useProductionAssignmentParticipants,
  useAddProductionParticipant,
  useRemoveProductionParticipant,
  useProductionAssignments,
} from "../../hooks";

export function ProductionParticipants({ submissionId }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");

  // Get the production assignment for this submission
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useProductionAssignments({ submission: submissionId });

  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  // Fetch participants from API
  const {
    data: participants = [],
    isLoading: participantsLoading,
    error,
  } = useProductionAssignmentParticipants(assignmentId, {
    enabled: !!assignmentId,
  });

  // Mutations
  const addMutation = useAddProductionParticipant();
  const removeMutation = useRemoveProductionParticipant();

  const isLoading = assignmentsLoading || participantsLoading;

  const handleAddParticipant = () => {
    if (!selectedProfileId) {
      toast.error("Please select a user");
      return;
    }

    addMutation.mutate(
      { assignmentId, profile_id: selectedProfileId },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setSelectedProfileId("");
          setSearchQuery("");
        },
      }
    );
  };

  const handleRemoveParticipant = (participant) => {
    setParticipantToRemove(participant);
  };

  const confirmRemoveParticipant = () => {
    if (!participantToRemove) return;

    removeMutation.mutate(
      { assignmentId, profile_id: participantToRemove.id },
      {
        onSuccess: () => {
          setParticipantToRemove(null);
        },
      }
    );
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      production_assistant:
        "bg-purple-100 dark:bg-purple-600 text-purple-800 dark:text-primary-foreground border-purple-200 dark:border-purple-700",
      assigned_by:
        "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-primary-foreground border-blue-200 dark:border-blue-700",
      author:
        "bg-green-100 dark:bg-green-600 text-green-700 dark:text-primary-foreground border-green-200 dark:border-green-700",
      participant:
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-primary-foreground border-gray-200 dark:border-gray-700",
    };
    return (
      colors[role] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-primary-foreground border-gray-200 dark:border-gray-700"
    );
  };

  const getRoleDisplay = (role) => {
    const displays = {
      production_assistant: "Production Assistant",
      assigned_by: "Editor (Assigned By)",
      author: "Author",
      participant: "Participant",
    };
    return displays[role] || role;
  };

  const canRemove = (participant) => {
    // Can only remove participants, not core roles
    return participant.role === "participant";
  };

  if (!assignmentId && !assignmentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Participants</CardTitle>
          <CardDescription>
            No production assignment found for this submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please create a production assignment first.
          </p>
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
              <CardTitle>Production Participants</CardTitle>
              <CardDescription className="mt-1">
                Production assistants and additional collaborators assigned to
                this submission
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={!assignmentId}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Participant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No participants assigned
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Assign additional participants to help with production workflow.
              </p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Participant
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <DataTable
                data={participants}
                columns={[
                  {
                    key: "name",
                    header: "Name",
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {row.user?.first_name} {row.user?.last_name}
                        </span>
                      </div>
                    ),
                    cellClassName: "font-medium",
                  },
                  {
                    key: "email",
                    header: "Email",
                    render: (row) => (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{row.user?.email || "N/A"}</span>
                      </div>
                    ),
                  },
                  {
                    key: "role",
                    header: "Role",
                    render: (row) => (
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor(row.role)}
                      >
                        {getRoleDisplay(row.role)}
                      </Badge>
                    ),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    align: "right",
                    render: (row) =>
                      canRemove(row) ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParticipant(row)}
                          disabled={removeMutation.isPending}
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Core role
                        </span>
                      ),
                  },
                ]}
                emptyMessage="No participants assigned"
                isPending={isLoading}
                error={error}
                errorMessage="Error loading participants"
                hoverable={true}
                tableClassName="bg-card border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Participant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription>
              Add an additional participant to the production workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-id">Profile ID</Label>
              <Input
                id="profile-id"
                placeholder="Enter profile UUID"
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the UUID of the user profile to add as a participant
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={addMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddParticipant}
              disabled={addMutation.isPending || !selectedProfileId}
            >
              {addMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Participant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Participant Confirmation */}
      <AlertDialog
        open={!!participantToRemove}
        onOpenChange={() => setParticipantToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>
                {participantToRemove?.user?.first_name}{" "}
                {participantToRemove?.user?.last_name}
              </strong>{" "}
              from the production workflow? They will no longer have access to
              production files and discussions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveParticipant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
