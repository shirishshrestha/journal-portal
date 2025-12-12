"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateCopyeditingAssignment } from "../../hooks";
import { SearchableSelect } from "@/features/shared";
import { useGetUsers } from "@/features/panel/admin";

// Form validation schema
const copyeditingSchema = z.object({
  copyeditor_id: z.string().min(1, "Please select a copyeditor"),
  due_date: z.date({
    required_error: "Due date is required",
  }),
  instructions: z.string().optional(),
});

/**
 * Dialog component for creating a copyediting assignment
 */
export function CreateCopyeditingDialog({
  isOpen,
  onClose,
  submissionId,
  submission,
}) {
  const router = useRouter();
  const createMutation = useCreateCopyeditingAssignment();

  const form = useForm({
    resolver: zodResolver(copyeditingSchema),
    defaultValues: {
      copyeditor_id: "",
      due_date: null,
      instructions: "",
    },
  });

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
      value: user.profile.id.toString(),
      label: `${user.profile.display_name || user.profile.user_name || ""} (${
        user.email
      })`,
    })) || [];

  const onSubmit = (data) => {
    const payload = {
      submission: submissionId,
      copyeditor_id: data.copyeditor_id,
      due_date: data.due_date.toISOString(),
      instructions: data.instructions || "",
      status: "PENDING",
    };

    createMutation.mutate(payload, {
      onSuccess: (assignmentData) => {
        form.reset();
        onClose();

        // Navigate to copyediting page
        router.push(`/editor/submissions/${submissionId}/copyediting`);
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Copyediting Assignment</DialogTitle>
          <DialogDescription>
            Assign a copyeditor to review and edit the manuscript for{" "}
            <span className="font-medium">{submission?.title}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Copyeditor Selection */}
              <FormField
                control={form.control}
                name="copyeditor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Copyeditor <span className="text-destructive">*</span>
                    </FormLabel>

                    <FormControl>
                      <SearchableSelect
                        options={userOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          loadingUsers
                            ? "Loading users..."
                            : "Select a copyeditor"
                        }
                        emptyText={
                          usersError
                            ? "Error loading users"
                            : userOptions.length === 0
                            ? "No copyeditors found"
                            : "No user found."
                        }
                        searchPlaceholder="Search by name or email..."
                        disabled={loadingUsers || createMutation.isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Select the copyeditor who will be responsible for editing
                      this manuscript
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Due Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Set a deadline for the copyediting work
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
                    <FormLabel>Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide specific instructions for the copyeditor..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any specific guidelines or focus areas for the copyeditor
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Assignment
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
