"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RichTextEditor } from "@/features/shared/components/RichTextEditor";
import { stripHtmlTags } from "@/features/shared/utils";
import {
  useCopyeditingAssignmentParticipants,
  useCreateCopyeditingDiscussion,
} from "../../hooks";
import { useParams } from "next/navigation";

// Form validation schema
const discussionSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  status: z.enum(["OPEN", "RESOLVED", "CLOSED"]).default("OPEN"),
});

/**
 * Dialog to create a new discussion thread
 */
export function AddDiscussionDialog({ isOpen, onClose, assignmentId }) {
  const params = useParams();
  const createMutation = useCreateCopyeditingDiscussion();

  const submissionId = params.id;

  const form = useForm({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      subject: "",
      message: "",
      participants: [],
      status: "OPEN",
    },
  });

  // TODO: Fetch available participants from API
  const {
    data: participants,
    isPending: isParticipantsPending,
    isError,
  } = useCopyeditingAssignmentParticipants(assignmentId);

  const onSubmit = async (data) => {
    // Validate that message has content (not just empty HTML)

    // Create an array of unique participant IDs (no duplicates) using map and filter
    let participantsIds = [];
    if (Array.isArray(participants)) {
      participantsIds = participants
        .map((p) => p && p.id)
        .filter((id, idx, arr) => id != null && arr.indexOf(id) === idx);
    }

    createMutation.mutate(
      {
        subject: data.subject,
        assignment: assignmentId,
        submission: submissionId,
        participants: participantsIds, // Uncomment if needed in API
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start New Discussion</DialogTitle>
          <DialogDescription>
            Create a discussion thread to communicate with participants about
            this manuscript
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Query about methodology section"
                      {...field}
                      disabled={createMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            {/* <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      initialValue={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Type your message here..."
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Use the rich text editor to format your message
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                {createMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Start Discussion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
