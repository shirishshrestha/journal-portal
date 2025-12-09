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
import { useCreateCopyeditingDiscussion } from "../../hooks";

// Form validation schema
const discussionSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  participants: z.array(z.string()).optional(),
  status: z.enum(["OPEN", "RESOLVED", "CLOSED"]).default("OPEN"),
});

/**
 * Dialog to create a new discussion thread
 */
export function AddDiscussionDialog({ isOpen, onClose, assignmentId }) {
  const queryClient = useQueryClient();
  const createMutation = useCreateCopyeditingDiscussion(assignmentId);

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
  const availableParticipants = [
    // Example structure - replace with real API data
    // { value: "author_1", label: "John Doe (Author)" },
    // { value: "copyeditor_1", label: "Jane Smith (Copyeditor)" },
    // { value: "editor_1", label: "Bob Johnson (Editor)" },
  ];

  const onSubmit = async (data) => {
    // Validate that message has content (not just empty HTML)
    const plainText = stripHtmlTags(data.message);
    if (!plainText || plainText.trim().length < 10) {
      toast.error("Message must contain at least 10 characters of text");
      return;
    }

    createMutation.mutate(
      {
        subject: data.subject,
        topic: "GENERAL",
        initial_message: data.message,
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

            {/* Participants */}
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        let current = Array.isArray(field.value)
                          ? field.value
                          : [];
                        if (!current.includes(value)) {
                          field.onChange([...current, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add participants..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableParticipants.map((participant) => (
                          <SelectItem
                            key={participant.value}
                            value={participant.value}
                          >
                            {participant.label}
                          </SelectItem>
                        ))}
                        {availableParticipants.length === 0 && (
                          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No participants available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    All copyeditors and authors will be notified automatically
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
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
            />

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
