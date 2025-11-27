// SubmissionGuidelines.jsx
// Step 1: Journal Selection + Submission Guidelines

import { useMemo, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SearchableSelect } from "@/features/shared/components/SearchableSelect";
import { useWatch } from "react-hook-form";
import { useGetJournals } from "@/features/shared/hooks/useGetJournals";
import { useGetTaxonomyTree } from "@/features/shared/hooks/useGetTaxonomyTree";
import { useGetJournalById } from "@/features/panel/author/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { JournalInfoCard } from "@/features/panel/reviewer/components/review-detail/JournalInfoCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function SubmissionGuidelines({ form }) {
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const { data: journalData, isPending: isLoadingJournals } = useGetJournals({
    active_role: "AUTHOR",
  });

  const journals = useMemo(() => journalData?.results || [], [journalData]);

  const journalId = useWatch({
    control: form.control,
    name: "journal_id",
    defaultValue: "",
  });

  // Fetch full journal details when journal is selected
  const { data: selectedJournalDetails, isPending: isLoadingJournalDetails } =
    useGetJournalById(journalId, {
      enabled: !!journalId,
    });

  const sectionId = useWatch({
    control: form.control,
    name: "section",
    defaultValue: "",
  });

  const categoryId = useWatch({
    control: form.control,
    name: "category",
    defaultValue: "",
  });

  const researchTypeId = useWatch({
    control: form.control,
    name: "research_type",
    defaultValue: "",
  });

  const { data: taxonomyTree, isPending: isLoadingTaxonomy } =
    useGetTaxonomyTree(journalId);

  const selectedJournal = useMemo(
    () => journals?.find((journal) => journal.id === journalId),
    [journals, journalId]
  );

  // Get submission requirements and author guidelines from journal settings
  const submissionRequirements = useMemo(
    () => selectedJournalDetails?.settings?.submission_requirements || [],
    [selectedJournalDetails]
  );

  const authorGuidelines = useMemo(
    () => selectedJournalDetails?.settings?.author_guidelines || [],
    [selectedJournalDetails]
  );

  const submissionGuidelines = useMemo(
    () => selectedJournalDetails?.settings?.submission_guidelines || "",
    [selectedJournalDetails]
  );

  // Transform journals for SearchableSelect
  const journalOptions = useMemo(
    () =>
      journals?.map((journal) => ({
        value: journal.id,
        label: journal.title,
      })) || [],
    [journals]
  );

  // Get sections (taxonomy tree root level)
  const sectionOptions = useMemo(
    () =>
      taxonomyTree?.map((section) => ({
        value: section.id,
        label: section.name,
      })) || [],
    [taxonomyTree]
  );

  // Get categories for selected section
  const categoryOptions = useMemo(() => {
    if (!sectionId || !taxonomyTree) return [];
    const section = taxonomyTree.find((s) => s.id === sectionId);
    return (
      section?.categories?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || []
    );
  }, [sectionId, taxonomyTree]);

  // Get research types for selected category
  const researchTypeOptions = useMemo(() => {
    if (!sectionId || !categoryId || !taxonomyTree) return [];
    const section = taxonomyTree.find((s) => s.id === sectionId);
    const category = section?.categories?.find((c) => c.id === categoryId);
    return (
      category?.research_types?.map((rt) => ({
        value: rt.id,
        label: rt.name,
      })) || []
    );
  }, [sectionId, categoryId, taxonomyTree]);

  // Get areas for selected research type
  const areaOptions = useMemo(() => {
    if (!sectionId || !categoryId || !researchTypeId || !taxonomyTree)
      return [];
    const section = taxonomyTree.find((s) => s.id === sectionId);
    const category = section?.categories?.find((c) => c.id === categoryId);
    const researchType = category?.research_types?.find(
      (rt) => rt.id === researchTypeId
    );
    return (
      researchType?.areas?.map((area) => ({
        value: area.id,
        label: area.name,
      })) || []
    );
  }, [sectionId, categoryId, researchTypeId, taxonomyTree]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    form.setValue("section", "");
    form.setValue("category", "");
    form.setValue("research_type", "");
    form.setValue("area", "");
  }, [journalId, form]);

  useEffect(() => {
    form.setValue("category", "");
    form.setValue("research_type", "");
    form.setValue("area", "");
  }, [sectionId, form]);

  useEffect(() => {
    form.setValue("research_type", "");
    form.setValue("area", "");
  }, [categoryId, form]);

  useEffect(() => {
    form.setValue("area", "");
  }, [researchTypeId, form]);

  return (
    <div className="space-y-4">
      {/* Journal Selection */}
      <FormField
        control={form.control}
        name="journal_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Journal *</FormLabel>
            <FormControl>
              {isLoadingJournals ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <SearchableSelect
                  options={journalOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Choose a journal..."
                  searchPlaceholder="Search journals..."
                  emptyText="No journal found."
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Section Selection */}
      {journalId && (
        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                {isLoadingTaxonomy ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <SearchableSelect
                    options={sectionOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a section..."
                    searchPlaceholder="Search sections..."
                    emptyText="No sections available for this journal."
                  />
                )}
              </FormControl>
              <FormDescription>
                Choose the journal section that best fits your manuscript
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Category Selection */}
      {sectionId && categoryOptions.length > 0 && (
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a category..."
                  searchPlaceholder="Search categories..."
                  emptyText="No categories available."
                />
              </FormControl>
              <FormDescription>
                Select the category within the chosen section
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Research Type Selection */}
      {categoryId && researchTypeOptions.length > 0 && (
        <FormField
          control={form.control}
          name="research_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Research Type</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={researchTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select research type..."
                  searchPlaceholder="Search research types..."
                  emptyText="No research types available."
                />
              </FormControl>
              <FormDescription>
                Specify the type of research (e.g., Original, Review)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Area Selection */}
      {researchTypeId && areaOptions.length > 0 && (
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Research Area</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={areaOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select research area..."
                  searchPlaceholder="Search areas..."
                  emptyText="No research areas available."
                />
              </FormControl>
              <FormDescription>
                Choose the specific research area for your work
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Journal Details Card */}
      {selectedJournalDetails && !isLoadingJournalDetails && (
        <Card className="p-6">
          <JournalInfoCard journal={selectedJournalDetails} />
        </Card>
      )}

      {isLoadingJournalDetails && journalId && (
        <Card className="p-6">
          <Skeleton className="h-40 w-full" />
        </Card>
      )}

      {/* Submission Guidelines */}
      {submissionGuidelines && (
        <Card className="p-4 gap-0 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground">
              Submission Guidelines
            </h3>
          </div>
          <div
            className="text-sm text-muted-foreground prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: submissionGuidelines }}
          />
        </Card>
      )}

      {/* Author Guidelines */}
      {authorGuidelines.length > 0 && (
        <Card className="p-4 gap-0 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Author Guidelines</h3>
          </div>
          <ul className="space-y-2 list-disc list-inside">
            {authorGuidelines.map((guideline, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {guideline}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Submission Requirements with Checkboxes */}
      {submissionRequirements.length > 0 && (
        <Card className="p-4 gap-0 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-foreground mb-4">
            Submission Requirements *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please confirm all requirements below to proceed:
          </p>
          <div className="space-y-3">
            {submissionRequirements.map((requirement, i) => (
              <FormField
                key={i}
                control={form.control}
                name={`requirements`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={
                          Array.isArray(field.value) && field.value[i] === true
                        }
                        onCheckedChange={(checked) => {
                          const arr = Array.isArray(field.value)
                            ? [...field.value]
                            : Array(submissionRequirements.length).fill(false);
                          arr[i] = checked;
                          field.onChange(arr);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm leading-relaxed cursor-pointer">
                      {requirement}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </Card>
      )}
    </div>
  );
}
