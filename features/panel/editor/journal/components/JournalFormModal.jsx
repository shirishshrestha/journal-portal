"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormInputField } from "@/features/shared/components/FormInputField";
import { FormTextareaField } from "@/features/shared/components/FormTextareaField";
import { FormRichTextEditor } from "@/features";
import { DOAJSearchSelect } from "@/features/shared/components/DOAJSearchSelect";
import { JournalCreatedDialog } from "@/features/shared";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCreateJournal } from "../hooks/mutation/useCreateJournal";
import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/features/shared/utils";

const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_name: z.string().min(1, "Short name is required"),
  publisher: z.string().optional(),
  issn_print: z
    .string()
    .regex(
      /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/,
      "ISSN must be in format: 1234-5678 or ABCD-1234"
    )
    .optional()
    .or(z.literal("")),
  issn_online: z
    .string()
    .regex(
      /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/,
      "Online ISSN must be in format: 1234-5678 or ABCD-1234"
    )
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const plainText = stripHtmlTags(val);
      return plainText.length <= 2000;
    }, "Description must not exceed 2,000 characters of text"),
  website_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  contact_email: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().default(true),
  is_accepting_submissions: z.boolean().default(true),
});

const defaultValues = {
  title: "",
  short_name: "",
  publisher: "",
  issn_print: "",
  issn_online: "",
  description: "",
  website_url: "",
  contact_email: "",
  is_active: true,
  is_accepting_submissions: true,
};

export function JournalFormModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdJournalId, setCreatedJournalId] = useState(null);

  const form = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues,
  });

  // Integrate create journal mutation
  const createJournalMutation = useCreateJournal({
    onSuccess: (data) => {
      onSave?.(data);
      onClose?.();
      setCreatedJournalId(data?.id || data?.data?.id);
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      const data = error?.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            form.setError(field, { message: messages.join(" ") });
          }
        });
      }
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, form]);

  const handleSubmit = async (data) => {
    createJournalMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isMutating = isLoading || createJournalMutation.isLoading;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl">Create New Journal</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new journal.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 py-4"
                id="journal-form"
              >
                {/* DOAJ Search */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Import from DOAJ
                  </h3>
                  <DOAJSearchSelect
                    onSelect={(journal) => {
                      form.setValue("title", journal.title || "");
                      form.setValue("publisher", journal.publisher?.name || "");
                      form.setValue("issn_print", journal.issn_print || "");
                      form.setValue("issn_online", journal.issn_online || "");

                      // Try to find a description from subjects
                      if (journal.subjects && journal.subjects.length > 0) {
                        form.setValue(
                          "description",
                          journal.subjects.join(", ")
                        );
                      }

                      // Try to find a website URL
                      const url =
                        journal.homepage_url ||
                        (journal.urls && journal.urls[0]) ||
                        journal.other_raw?.ref?.journal;
                      if (url) {
                        form.setValue("website_url", url);
                      }
                    }}
                  />
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInputField
                      control={form.control}
                      name="title"
                      label={
                        <span>
                          Title <span className="text-destructive">*</span>
                        </span>
                      }
                      placeholder="Journal of..."
                    />
                    <FormInputField
                      control={form.control}
                      name="short_name"
                      label={
                        <span>
                          Short Name <span className="text-destructive">*</span>
                        </span>
                      }
                      placeholder="JOS"
                    />
                  </div>

                  <FormInputField
                    control={form.control}
                    name="publisher"
                    label="Publisher"
                    placeholder="Publishing house name"
                  />
                </div>

                {/* ISSN Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    ISSN Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issn_print"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISSN Print</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="text"
                              placeholder="1234-5678"
                              maxLength={9}
                              className={cn(
                                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                              )}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                if (value.length > 4) {
                                  value =
                                    value.slice(0, 4) + "-" + value.slice(4, 8);
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issn_online"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISSN Online</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              type="text"
                              placeholder="1234-5678"
                              maxLength={9}
                              className={cn(
                                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                              )}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                if (value.length > 4) {
                                  value =
                                    value.slice(0, 4) + "-" + value.slice(4, 8);
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Description
                  </h3>
                  <FormRichTextEditor
                    control={form.control}
                    name="description"
                    label="Journal Description"
                    placeholder="Brief description of the journal's scope and focus"
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInputField
                      control={form.control}
                      name="website_url"
                      label="Website URL"
                      placeholder="https://example.com"
                      type="url"
                    />
                    <FormInputField
                      control={form.control}
                      name="contact_email"
                      label="Contact Email"
                      placeholder="contact@journal.com"
                      type="email"
                    />
                  </div>
                </div>

                {/* Status Settings */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Status Settings
                  </h3>
                  <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Journal is visible and operational
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_accepting_submissions"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <FormLabel>Accepting Submissions</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Allow new manuscript submissions
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button type="submit" form="journal-form" disabled={isMutating}>
              {isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Journal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <JournalCreatedDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        journalId={createdJournalId}
      />
    </>
  );
}
