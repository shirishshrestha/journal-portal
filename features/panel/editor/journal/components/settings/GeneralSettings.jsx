"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { FormRichTextEditor, FormInputField } from "@/features";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useUpdateJournal } from "@/features";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

const generalSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_name: z.string().min(1, "Short name is required"),
  publisher: z.string().optional(),
  description: z.string().optional(),
  issn_print: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "ISSN must be in format: 1234-5678")
    .optional()
    .or(z.literal("")),
  issn_online: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Online ISSN must be in format: 1234-5678")
    .optional()
    .or(z.literal("")),
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

export function GeneralSettings({ journal }) {
  const form = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      title: "",
      short_name: "",
      publisher: "",
      description: "",
      issn_print: "",
      issn_online: "",
      website_url: "",
      contact_email: "",
      is_active: true,
      is_accepting_submissions: true,
    },
  });

  const queryClient = useQueryClient();

  // Update form when journal data changes
  useEffect(() => {
    if (journal) {
      form.reset({
        title: journal.title || "",
        short_name: journal.short_name || "",
        publisher: journal.publisher || "",
        description: journal.description || "",
        issn_print: journal.issn_print || "",
        issn_online: journal.issn_online || "",
        website_url: journal.website_url || "",
        contact_email: journal.contact_email || "",
        is_active: journal.is_active ?? true,
        is_accepting_submissions: journal.is_accepting_submissions ?? true,
      });
    }
  }, [journal, form]);

  const updateJournalMutation = useUpdateJournal({
    onSuccess: () => {
      toast.success("General settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  const handleSubmit = (data) => {
    if (!journal?.id) {
      toast.error("Journal ID not found");
      return;
    }

    updateJournalMutation.mutate({
      id: journal.id,
      ...data,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update journal&apos;s basic details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                control={form.control}
                name="title"
                label={
                  <span>
                    Journal Title <span className="text-destructive">*</span>
                  </span>
                }
                placeholder="International Journal of..."
              />
              <FormInputField
                control={form.control}
                name="short_name"
                label={
                  <span>
                    Short Name <span className="text-destructive">*</span>
                  </span>
                }
                placeholder="IJCS"
              />
            </div>

            <FormInputField
              control={form.control}
              name="publisher"
              label="Publisher"
              placeholder="Academic Press"
            />

            <FormRichTextEditor
              control={form.control}
              name="description"
              label="Description"
              placeholder="A peer-reviewed journal covering..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ISSN Numbers</CardTitle>
            <CardDescription>
              International Standard Serial Numbers for print and online
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issn_print"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISSN Print</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="1234-5678"
                        maxLength={9}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, "");
                          if (value.length > 4) {
                            value = value.slice(0, 4) + "-" + value.slice(4, 8);
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
                      <Input
                        {...field}
                        type="text"
                        placeholder="1234-5678"
                        maxLength={9}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^0-9]/g, "");
                          if (value.length > 4) {
                            value = value.slice(0, 4) + "-" + value.slice(4, 8);
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Journal&apos;s website and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormInputField
              control={form.control}
              name="website_url"
              label="Website URL"
              placeholder="https://journal.example.com"
              type="url"
            />
            <FormInputField
              control={form.control}
              name="contact_email"
              label="Contact Email"
              placeholder="editor@journal.com"
              type="email"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Settings</CardTitle>
            <CardDescription>
              Control journal visibility and submission acceptance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make this journal visible and accessible
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
                    <FormLabel>Accept Submissions</FormLabel>
                    <p className="text-sm text-muted-foreground">
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
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateJournalMutation.isPending || !form.formState.isDirty
            }
          >
            <Save className="h-4 w-4 mr-2" />
            {updateJournalMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
