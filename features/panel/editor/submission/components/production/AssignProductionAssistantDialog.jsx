"use client";

import React, { useState } from "react";
import { UserPlus, Search, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateProductionAssignment } from "../../hooks";

export function AssignProductionAssistantDialog({
  isOpen,
  onClose,
  submissionId,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("PRODUCTION_ASSISTANT");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Mock data - replace with actual API call for users
  const users = [];
  const isLoading = false;

  // Mutation hook
  const createMutation = useCreateProductionAssignment(submissionId);

  const handleAssign = () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    const assignmentData = {
      assigned_to: selectedUser,
      role: selectedRole,
    };

    if (dueDate) {
      assignmentData.due_date = dueDate;
    }

    if (instructions) {
      assignmentData.instructions = instructions;
    }

    createMutation.mutate(assignmentData, {
      onSuccess: () => {
        setSelectedUser(null);
        setSelectedRole("PRODUCTION_ASSISTANT");
        setDueDate("");
        setInstructions("");
        setSearchQuery("");
        onClose();
      },
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Production Assistant</DialogTitle>
          <DialogDescription>
            Select a user to assign as a production assistant or layout editor
            for this submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTION_ASSISTANT">
                  Production Assistant
                </SelectItem>
                <SelectItem value="LAYOUT_EDITOR">Layout Editor</SelectItem>
                <SelectItem value="PROOFREADER">Proofreader</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Users */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* User List */}
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserPlus className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No users found matching your search."
                    : "No users available to assign."}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedUser === user.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {user.role && (
                      <Badge variant="secondary">{user.role}</Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (optional)</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Provide specific instructions for the production assistant..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUser || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
