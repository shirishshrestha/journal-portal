"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Loader2, Plus, X } from "lucide-react";
import { useGetJournalById, FormRichTextEditor } from "@/features";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSubmissionSettings } from "../../api/journalsApi";
import { submissionSettingsSchema } from "../../utils/submissionSettingsSchema";

export function SubmissionSettings({ journalId }) {
  const { data: journal, isPending, error } = useGetJournalById(journalId);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(submissionSettingsSchema),
    defaultValues: {
      submission_guidelines: "",
      author_guidelines: "",
      submission_requirements: [],
      coauthor_roles: [],
      review_type: "DOUBLE_BLIND",
      min_reviewers: 2,
      review_deadline_days: 21,
      max_file_size_mb: 25,
      allowed_file_types: "docx",
      require_cover_letter: true,
      require_conflict_of_interest: true,
      publication_frequency: "MONTHLY",
      article_processing_charge: "",
      apc_currency: "USD",
      allow_preprints: true,
      require_data_availability: false,
      require_funding_info: true,
    },
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: form.control,
    name: "submission_requirements",
  });

  const {
    fields: roleFields,
    append: appendRole,
    remove: removeRole,
  } = useFieldArray({
    control: form.control,
    name: "coauthor_roles",
  });

  // Update form when journal data loads
  useEffect(() => {
    if (journal?.settings) {
      form.reset({
        ...journal.settings,
      });
    }
  }, [journal, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateSubmissionSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      toast.success("Submission settings saved successfully");
    },
    onError: (error) => {
      console.error("Error saving submission settings:", error);
      toast.error("Failed to save submission settings");
    },
  });

  const onSubmit = (data) => {
    updateSettingsMutation.mutate({
      journalId,
      settings: data,
    });
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">
            <p>Failed to load submission settings</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Guidelines</CardTitle>
            <CardDescription>
              Instructions and requirements for manuscript submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="submission_guidelines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Submission Guidelines</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Enter general guidelines for manuscript submission..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormRichTextEditor
              control={form.control}
              name="author_guidelines"
              label="Author Guidelines"
              placeholder="Enter detailed guidelines for authors on manuscript preparation, formatting, and submission..."
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Submission Requirements</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendRequirement("")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {requirementFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`submission_requirements.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Requirement #${index + 1}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {requirementFields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No requirements added yet.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Coauthor Roles</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendRole("")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {roleFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`coauthor_roles.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Role #${index + 1}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRole(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {roleFields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No roles added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Process */}
        <Card>
          <CardHeader>
            <CardTitle>Review Process</CardTitle>
            <CardDescription>
              Configure the peer review workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="review_type"
                render={({ field }) => (
                  <FormItem className={" flex items-start gap-2 flex-col"}>
                    <FormLabel>Review Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select review type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SINGLE_BLIND">
                          Single Blind
                        </SelectItem>
                        <SelectItem value="DOUBLE_BLIND">
                          Double Blind
                        </SelectItem>
                        <SelectItem value="OPEN_REVIEW">Open Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_reviewers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Reviewers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Number of reviewers required per submission
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review_deadline_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Deadline (Days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Days given to reviewers to complete review
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>File Requirements</CardTitle>
            <CardDescription>
              Set constraints and requirements for uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="max_file_size_mb"
              render={({ field }) => (
                <FormItem className={" flex items-start gap-2 flex-col"}>
                  <FormLabel>Maximum File Size (MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="require_cover_letter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Require Cover Letter
                      </FormLabel>
                      <FormDescription>
                        Authors must submit a cover letter with their manuscript
                      </FormDescription>
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
                name="require_conflict_of_interest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Require Conflict of Interest Statement
                      </FormLabel>
                      <FormDescription>
                        Authors must declare any conflicts of interest
                      </FormDescription>
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
          </CardContent>
        </Card>

        {/* Publication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publication Settings</CardTitle>
            <CardDescription>
              Configure publication and pricing details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publication_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="BIANNUALLY">Bi-annually</SelectItem>
                        <SelectItem value="ANNUALLY">Annually</SelectItem>
                        <SelectItem value="CONTINUOUS">Continuous</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apc_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="article_processing_charge"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Article Processing Charge (APC)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty if no charge applies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Requirements</CardTitle>
            <CardDescription>Optional submission requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="allow_preprints"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Preprints</FormLabel>
                    <FormDescription>
                      Accept manuscripts that have been posted as preprints
                    </FormDescription>
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
              name="require_data_availability"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Require Data Availability Statement
                    </FormLabel>
                    <FormDescription>
                      Authors must provide information about data accessibility
                    </FormDescription>
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
              name="require_funding_info"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Require Funding Information
                    </FormLabel>
                    <FormDescription>
                      Authors must declare funding sources
                    </FormDescription>
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

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={updateSettingsMutation.isPending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={
              updateSettingsMutation.isPending || !form.formState.isDirty
            }
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Submission Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
