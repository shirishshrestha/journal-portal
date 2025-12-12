"use client";

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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/features/shared/components/RichTextEditor";
import { stripHtmlTags } from "@/features/shared/utils";
import { useCreateProductionDiscussion } from "../../hooks";
import { addProductionMessage } from "../../api";

// Form validation schema
const productionDiscussionSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function AddProductionDiscussionDialog({
  isOpen,
  onClose,
  assignmentId,
  submissionId,
}) {
  const createMutation = useCreateProductionDiscussion();

  const form = useForm({
    resolver: zodResolver(productionDiscussionSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    const plainText = stripHtmlTags(data.message);
    if (!plainText || plainText.trim().length < 10) {
      toast.error("Message must contain at least 10 characters of text");
      return;
    }

    if (!assignmentId || !submissionId) {
      toast.error("Assignment ID and Submission ID are required");
      return;
    }

    // First create the discussion, then add the initial message
    createMutation.mutate(
      {
        assignment: assignmentId,
        submission: submissionId,
        subject: data.subject,
      },
      {
        onSuccess: async (discussionData) => {
          // Now add the initial message
          try {
            await addProductionMessage(discussionData.id, {
              discussion: discussionData.id,
              message: data.message,
            });
            form.reset();
            onClose();
            toast.success("Discussion started successfully");
          } catch (error) {
            toast.error("Discussion created but failed to add message");
            form.reset();
            onClose();
          }
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
