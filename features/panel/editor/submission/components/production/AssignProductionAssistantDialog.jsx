"use client";

import React from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCreateProductionAssignment } from "../../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/features/shared";
import { useGetUsers } from "@/features/panel/admin";

const schema = z.object({
  assigned_to: z.string().min(1, "Please select a user"),
  role: z.string().min(1, "Please select a role"),
  due_date: z.string().min(1, "Please select a due date"),
  instructions: z.string().optional(),
});
export function AssignProductionAssistantDialog({
  isOpen,
  onClose,
  submissionId,
}) {
  // Form schema
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      assigned_to: "",
      role: "PRODUCTION_ASSISTANT",
      due_date: "",
      instructions: "",
    },
  });

  // Fetch users with PRODUCTION_ASSISTANT, LAYOUT_EDITOR, or PROOFREADER role
  const {
    data: usersData,
    isPending: loadingUsers,
    error: usersError,
  } = useGetUsers(
    { userRole: "EDITOR" }, // Adjust as needed for your backend
    { enabled: isOpen }
  );

  // Transform users data to options for SearchableSelect
  const userOptions =
    usersData?.results?.map((user) => ({
      value: user.profile.id.toString(),
      label: `${user.profile.display_name || user.profile.user_name || ""} (${
        user.email
      })`,
    })) || [];

  const createMutation = useCreateProductionAssignment();

  const onSubmit = (data) => {
    const assignmentData = {
      production_assistant_id: data.assigned_to,
      role: data.role,
      submission: submissionId,
    };
    if (data.due_date) assignmentData.due_date = data.due_date;
    if (data.instructions) assignmentData.instructions = data.instructions;
    createMutation.mutate(assignmentData, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Production Assistant</DialogTitle>
          <DialogDescription>
            Select a user to assign as a production assistant or layout editor
            for this submission.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRODUCTION_ASSISTANT">
                            Production Assistant
                          </SelectItem>
                          <SelectItem value="LAYOUT_EDITOR">
                            Layout Editor
                          </SelectItem>
                          <SelectItem value="PROOFREADER">
                            Proofreader
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the role for this assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Selection */}
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={userOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          loadingUsers ? "Loading users..." : "Select a user"
                        }
                        emptyText={
                          usersError
                            ? "Error loading users"
                            : userOptions.length === 0
                            ? "No users found"
                            : "No user found."
                        }
                        searchPlaceholder="Search by name or email..."
                        disabled={loadingUsers || createMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>Select the user to assign</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date </FormLabel>
                    <FormControl>
                      <Input
                        id="due_date"
                        type="date"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Set a deadline for this assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instructions */}
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        id="instructions"
                        placeholder="Provide specific instructions for the production assistant..."
                        rows={3}
                        {...field}
                        disabled={createMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Any specific guidelines or notes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
