"use client";

import React, { useState } from "react";
import { Users, UserPlus, Mail, Shield, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useProductionAssignmentParticipants } from "../../hooks";

export function ProductionParticipants({ assignmentId }) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);

  // Fetch participants from API
  const {
    data: participants = [],
    isLoading,
    error,
  } = useProductionAssignmentParticipants(assignmentId);

  const handleRemoveParticipant = (participantId) => {
    setParticipantToRemove(participantId);
  };

  const confirmRemoveParticipant = () => {
    // API call to remove participant
    console.log("Removing participant:", participantToRemove);
    setParticipantToRemove(null);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      PRODUCTION_ASSISTANT:
        "bg-purple-100 dark:bg-purple-600 text-purple-800 dark:text-primary-foreground border-purple-200 dark:border-purple-700",
      LAYOUT_EDITOR:
        "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-primary-foreground border-blue-200 dark:border-blue-700",
      PROOFREADER:
        "bg-green-100 dark:bg-green-600 text-green-700 dark:text-primary-foreground border-green-200 dark:border-green-700",
    };
    return (
      colors[role] ||
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-primary-foreground border-gray-200 dark:border-gray-700"
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Production Participants</CardTitle>
              <CardDescription className="mt-1">
                Production assistants and layout editors assigned to this
                submission
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAssignDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Participant
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
                Assign production assistants or layout editors to help prepare
                the final publication files.
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign First Participant
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {participant.user?.first_name}{" "}
                            {participant.user?.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{participant.user?.email || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(participant.role)}
                        >
                          {participant.role_display || participant.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveParticipant(participant.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Participant Confirmation */}
      <AlertDialog
        open={!!participantToRemove}
        onOpenChange={() => setParticipantToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Participant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this participant from the
              production workflow? They will no longer have access to production
              files and discussions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveParticipant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
