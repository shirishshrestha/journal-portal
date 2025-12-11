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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RichTextEditor } from "@/features/shared/components/RichTextEditor";
import { stripHtmlTags } from "@/features/shared/utils";
import {
  useAddCopyeditingMessage,
  useCloseCopyeditingDiscussion,
  useReopenCopyeditingDiscussion,
  useCopyeditingDiscussion,
} from "../../hooks";
import { useCurrentRole } from "@/features/shared";

// Reply validation schema
const replySchema = z.object({
  message: z.string().min(10, "Reply must be at least 10 characters"),
});

/**
 * Dialog to view and reply to a discussion thread
 */
export function DiscussionThreadDialog({
  isOpen,
  onClose,
  discussion,
  assignmentId,
}) {
  // Fetch discussion with messages
  const { data: discussionData, isPending } = useCopyeditingDiscussion(
    discussion?.id,
    { enabled: isOpen && !!discussion?.id }
  );

  const { currentRole } = useCurrentRole();
  console.log(currentRole);

  // Mutations
  const addMessageMutation = useAddCopyeditingMessage(discussion?.id);
  const closeMutation = useCloseCopyeditingDiscussion(assignmentId);
  const reopenMutation = useReopenCopyeditingDiscussion();

  const form = useForm({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data) => {
    // Validate that message has content (not just empty HTML)
    const plainText = stripHtmlTags(data.message);
    if (!plainText || plainText.trim().length < 10) {
      toast.error("Reply must contain at least 10 characters of text");
      return;
    }

    addMessageMutation.mutate(
      {
        discussion: discussion?.id,
        message: data.message,
      },
      {
        onSuccess: () => {
          // Reset form completely
          form.reset({ message: "" });
          // Force re-render of RichTextEditor by updating key
          form.setValue("message", "", { shouldValidate: false });
        },
      }
    );
  };

  const handleResolve = async () => {
    closeMutation.mutate(discussion.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleReopen = async () => {
    reopenMutation.mutate(discussion.id, {
      onSuccess: () => {
        // Keep dialog open to continue discussion
        toast.success("Discussion reopened successfully");
        onClose();
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
      RESOLVED:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700",
      CLOSED:
        "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700",
    };
    return colors[status] || colors.OPEN;
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Safety checks for discussion object
  if (!discussion) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">
                {discussion.subject || "Untitled Discussion"}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Started by {discussion.from?.name || "Unknown"} on{" "}
                {format(
                  new Date(discussion.last_reply || discussion.created_at),
                  "MMM d, yyyy"
                )}
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 ${getStatusColor(
                discussion.status || "OPEN"
              )}`}
            >
              {discussion.status || "OPEN"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Thread Messages */}
        <ScrollArea className="flex-1 max-h-[400px] pr-4">
          <div className="space-y-4">
            {isPending ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : !discussionData?.messages ||
              discussionData.messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Be the first to reply!</p>
              </div>
            ) : (
              discussionData.messages.map((msg, index) => (
                <div key={msg.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex gap-3">
                    <Avatar className="shrink-0">
                      <AvatarImage
                        src={msg.author?.avatar}
                        alt={msg.author?.user_name || "User"}
                      />
                      <AvatarFallback>
                        {getInitials(msg.author?.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {msg.author?.user_name || "Unknown User"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {msg.created_at
                            ? format(
                                new Date(msg.created_at),
                                "MMM d, yyyy HH:mm"
                              )
                            : ""}
                        </span>
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: msg.message || "" }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Reply Form */}
        {discussion.status === "OPEN" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        initialValue={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Type your reply..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  {discussion.status === "OPEN" && currentRole === "EDITOR" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResolve}
                      disabled={
                        closeMutation.isPending || addMessageMutation.isPending
                      }
                      size="sm"
                    >
                      {closeMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Mark as Resolved
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={addMessageMutation.isPending}
                  >
                    Close
                  </Button>
                  <Button type="submit" disabled={addMessageMutation.isPending}>
                    {addMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}

        {discussion.status !== "OPEN" && (
          <DialogFooter className="items-center gap-4 ">
            <p className="text-sm text-muted-foreground mb-0">
              This discussion has been {discussion.status.toLowerCase()}.
            </p>
            {discussion.status === "CLOSED" && currentRole === "EDITOR" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReopen}
                disabled={
                  reopenMutation.isPending || addMessageMutation.isPending
                }
                size="sm"
              >
                {reopenMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2\" />
                )}
                Reopen Discussion
              </Button>
            )}

            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
