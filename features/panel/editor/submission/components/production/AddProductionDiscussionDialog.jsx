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
import { useCreateProductionDiscussion } from "../../hooks";

// Form validation schema
const productionDiscussionSchema = z.object({
  participants: z.array(z.string()).min(1, "At least one participant required"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachedFiles: z.array(z.any()).optional(),
});

export function AddProductionDiscussionDialog({
  isOpen,
  onClose,
  assignmentId,
}) {
  const queryClient = useQueryClient();
  const createMutation = useCreateProductionDiscussion(assignmentId);

  const form = useForm({
    resolver: zodResolver(productionDiscussionSchema),
    defaultValues: {
      participants: [],
      subject: "",
      message: "",
      attachedFiles: [],
    },
  });

  // TODO: Fetch available participants from API
  const availableParticipants = [];

  const onSubmit = async (data) => {
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
          <DialogTitle>Start Production Discussion</DialogTitle>
          <DialogDescription>
            Create a discussion thread to communicate with production
            participants about this manuscript
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Participants */}
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Galley file format clarification"
                      {...field}
                    />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attached Files */}
            <FormField
              control={form.control}
              name="attachedFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attached Files</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        field.onChange(Array.from(e.target.files));
                      }}
                    />
                  </FormControl>
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
