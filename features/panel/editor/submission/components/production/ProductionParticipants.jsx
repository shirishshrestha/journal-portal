"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Trash2, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import {
  useProductionAssignmentParticipants,
  useProductionAssignments,
  useRemoveProductionParticipant,
} from "../../hooks";
import { AddProductionParticipantDialog } from "./AddProductionParticipantDialog";

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-8 border-2 border-dashed rounded-lg">
    <Icon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
    <h4 className="font-medium mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

/**
 * Component to display and manage production participants
 * Shows assigned production assistants, authors, and editors
 */
export function ProductionParticipants({ submissionId, isAuthorView = false }) {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);

  // Get the production assignment for this submission
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useProductionAssignments({ submission: submissionId });

  const assignment = assignmentsData?.results?.[0];
  const assignmentId = assignment?.id;

  // Fetch participants from API
  const {
    data: participants = [],
    isPending,
    error,
  } = useProductionAssignmentParticipants(assignmentId, {
    enabled: !!assignmentId,
  });

  // Mutations
  const removeMutation = useRemoveProductionParticipant();

  const handleRemoveClick = (user) => {
    setUserToRemove(user);
    setIsRemoveDialogOpen(true);
  };

  const handleRemove = async () => {
    if (!userToRemove) return;

    removeMutation.mutate(
      { assignmentId, profile_id: userToRemove.id },
      {
        onSuccess: () => {
          setIsRemoveDialogOpen(false);
          setUserToRemove(null);
        },
      }
    );
  };

  const ParticipantCard = ({ user, canRemove = false }) => {
    const initials =
      (user.user?.first_name?.[0] || "") + (user.user?.last_name?.[0] || "") ||
      user.user_name?.[0] ||
      "?";

    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.user_name} />
            <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {user.user?.first_name} {user.user?.last_name || user.user_name}
              </p>
              {user.role && (
                <Badge variant="secondary" className="text-xs">
                  {user.role_display || user.role.replace("_", " ")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.user?.email || user.user_email || "N/A"}
            </div>
            {user.assigned_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Assigned: {new Date(user.assigned_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveClick(user)}
            disabled={removeMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    );
  };

  const canRemoveParticipant = (participant) => {
    // Can only remove participants, not core roles
    return participant.role === "participant";
  };

  return (
    <>
      <div className="space-y-6">
        {/* Participants Section */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  All users involved in the production workflow
                </CardDescription>
              </div>
              {assignmentId && !isAuthorView && (
                <Button
                  size="sm"
                  onClick={() => setIsAddParticipantOpen(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Participant
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isPending || assignmentsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  Loading participants...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading participants</p>
              </div>
            ) : !assignmentId ? (
              <EmptyState
                icon={UserPlus}
                title="No Production Assignment"
                description="Assign a production assistant to enable participant management"
              />
            ) : participants.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No participants assigned"
                description="Participants will appear here once assigned to the production workflow"
              />
            ) : (
              <div className="space-y-3">
                {participants?.map((participant, index) => (
                  <ParticipantCard
                    key={`${participant.id}-${index}`}
                    user={participant}
                    canRemove={
                      canRemoveParticipant(participant) && !isAuthorView
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>
                {userToRemove?.user?.first_name} {userToRemove?.user?.last_name}
              </strong>{" "}
              from this production workflow? They will lose access to the
              production files and discussions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Participant Dialog */}
      {assignmentId && (
        <AddProductionParticipantDialog
          isOpen={isAddParticipantOpen}
          onClose={() => setIsAddParticipantOpen(false)}
          assignmentId={assignmentId}
        />
      )}
    </>
  );
}
