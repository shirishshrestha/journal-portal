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
import { useQueryClient } from "@tanstack/react-query";
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
import { useCopyeditingAssignmentParticipants } from "../../hooks";

/**
 * Component to display and manage copyediting participants
 * Shows assigned copyeditors, authors, and editors
 */
export function CopyeditingParticipants({ assignmentId }) {
  const queryClient = useQueryClient();
  const [removingUserId, setRemovingUserId] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  // Fetch participants from API
  const {
    data: participants = [],
    isPending,
    error,
  } = useCopyeditingAssignmentParticipants(assignmentId);

  const handleRemoveClick = (user) => {
    setUserToRemove(user);
    setIsRemoveDialogOpen(true);
  };

  const handleRemove = async () => {
    if (!userToRemove) return;

    try {
      setRemovingUserId(userToRemove.id);

      // TODO: Implement API call to remove participant
      // await removeParticipant(submissionId, userToRemove.id);

      toast.success(`${userToRemove.name} removed from copyediting workflow`);

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ["copyediting-participants", submissionId],
      });

      setIsRemoveDialogOpen(false);
      setUserToRemove(null);
    } catch (error) {
      toast.error("Failed to remove participant");
    } finally {
      setRemovingUserId(null);
    }
  };

  const ParticipantCard = ({ user, canRemove = false }) => {
    const initials =
      user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?";

    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{user.name}</p>
              {user.role && (
                <Badge variant="secondary" className="text-xs">
                  {user.role.replace("_", " ")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
            {user.assigned_date && (
              <p className="text-xs text-muted-foreground mt-1">
                Assigned: {new Date(user.assigned_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveClick(user)}
            disabled={removingUserId === user.id}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    );
  };

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="text-center py-8 border-2 border-dashed rounded-lg">
      <Icon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Participants Section */}
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              All users involved in the copyediting workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
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
            ) : participants.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No participants assigned"
                description="Participants will appear here once assigned to the copyediting workflow"
              />
            ) : (
              <div className="space-y-3">
                {participants?.map((participant, index) => (
                  <ParticipantCard
                    key={`${participant.id} ${index}`}
                    user={{
                      id: participant.id,
                      name: `${participant.user_name}`,
                      email: participant.user_email,
                      avatar: participant.avatar,
                      role: participant.role_display || participant.role,
                      assigned_date: participant.assigned_at,
                    }}
                    canRemove={false}
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
            <AlertDialogTitle>Remove Copyeditor?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{userToRemove?.name}</strong> from this copyediting
              workflow? They will lose access to the copyediting files and
              discussions.
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
    </>
  );
}
