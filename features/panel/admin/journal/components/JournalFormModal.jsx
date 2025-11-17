"use client";

import { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCreateJournal } from "../hooks/mutation/useCreateJournal";
import { useUpdateJournal } from "../hooks/mutation/useUpdateJournal";

const journalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_name: z.string().min(1, "Short name is required"),
  publisher: z.string().optional(),
  issn_print: z.string().optional(),
  issn_online: z.string().optional(),
  description: z.string().optional(),
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
  journal,
  onClose,
  onSave,
  isLoading = false,
}) {
  const isEditMode = !!journal;

  const form = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: journal || defaultValues,
  });

  // Integrate create journal mutation
  const createJournalMutation = useCreateJournal({
    onSuccess: (data) => {
      onSave?.(data);
      onClose?.();
    },
  });

  // Integrate update journal mutation
  const updateJournalMutation = useUpdateJournal({
    onSuccess: (data) => {
      onSave?.(data);
      onClose?.();
    },
  });

  // Reset form when modal opens/closes or journal changes
  useEffect(() => {
    if (isOpen) {
      form.reset(journal || defaultValues);
    }
  }, [isOpen, journal, form]);

  const handleSubmit = async (data) => {
    if (!isEditMode) {
      createJournalMutation.mutate(data);
    } else {
      updateJournalMutation.mutate({ id: journal.id, ...data });
    }
    // Parent component should close modal and handle success
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isMutating =
    isLoading ||
    createJournalMutation.isLoading ||
    updateJournalMutation.isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-[85%] lg:max-w-[60%] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit Journal" : "Create New Journal"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the journal information below."
              : "Fill in the details to create a new journal."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 py-4"
              id="journal-form"
            >
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
                  <FormInputField
                    control={form.control}
                    name="issn_print"
                    label="ISSN Print"
                    placeholder="0000-0000"
                  />
                  <FormInputField
                    control={form.control}
                    name="issn_online"
                    label="ISSN Online"
                    placeholder="0000-0000"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </h3>
                <FormTextareaField
                  control={form.control}
                  name="description"
                  label="Journal Description"
                  placeholder="Brief description of the journal's scope and focus"
                  rows={4}
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
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Journal"
            ) : (
              "Create Journal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
