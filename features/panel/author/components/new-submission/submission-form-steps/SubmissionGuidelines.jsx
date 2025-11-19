// SubmissionGuidelines.jsx
// Step 1: Journal Selection + Submission Guidelines

import { useMemo, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const SUBMISSION_GUIDELINES = [
  "The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor).",
  "The submission file is in OpenOffice, Microsoft Word, or RTF document file format.",
  "Where available, URLs for the references have been provided.",
  "The text is single-spaced; uses a 12-point font; employs italics, rather than underlining (except with URL addresses); and all illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end.",
  "The text adheres to the stylistic and bibliographic requirements outlined in the Author Guidelines.",
];

export default function SubmissionGuidelines({ form }) {
  const { data: journalData, isPending: isLoadingJournals } = useGetJournals({
    active_role: "AUTHOR",
  });

  const journals = useMemo(() => journalData?.results || [], [journalData]);

  const journalId = useWatch({
    control: form.control,
    name: "journal_id",
    defaultValue: "",
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

      {/* Journal Details Card */}
      {selectedJournal && (
        <Card className="p-4 bg-blue-50 gap-0 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-foreground mb-2">
            {selectedJournal.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedJournal.description || "No description available"}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>• ISSN: {selectedJournal.issn || "N/A"}</span>
            <span>• Short Name: {selectedJournal.short_name || "N/A"}</span>
          </div>
        </Card>
      )}

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

      <Card className="p-4 gap-0 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
        <h3 className="font-semibold text-foreground mb-4">
          Submission Requirements
        </h3>
        <div className="space-y-3">
          {SUBMISSION_GUIDELINES.map((requirement, i) => (
            <FormField
              key={i}
              control={form.control}
              name={`requirements`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={
                        Array.isArray(field.value) && field.value[i] === true
                      }
                      onCheckedChange={(checked) => {
                        const arr = Array.isArray(field.value)
                          ? [...field.value]
                          : Array(SUBMISSION_GUIDELINES.length).fill(false);
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
      </Card>
    </div>
  );
}
