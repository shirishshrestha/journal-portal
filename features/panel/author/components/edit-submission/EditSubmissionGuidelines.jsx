// EditSubmissionGuidelines.jsx
// Journal Selection + Submission Guidelines for EDIT mode

import { useMemo, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { SearchableSelect } from "@/features/shared/components/SearchableSelect";
import { AuthorGuidelinesDialog } from "@/features/shared/components/AuthorGuidelinesDialog";
import { useWatch } from "react-hook-form";
import { useGetTaxonomyTree } from "@/features/shared/hooks/useGetTaxonomyTree";
import { Skeleton } from "@/components/ui/skeleton";
import { JournalInfoCard } from "@/features/panel/reviewer/components/review-detail/JournalInfoCard";
import { stripHtmlTags } from "@/features/shared/utils";

import { FileText, ExternalLink } from "lucide-react";

export default function EditSubmissionGuidelines({ form, submission }) {
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  // Journal is already loaded from submission prop
  const journal = submission?.journal;
  const journalId = journal?.id;

  const sectionId = useWatch({
    control: form.control,
    name: "section_id",
    defaultValue: "",
  });

  const categoryId = useWatch({
    control: form.control,
    name: "category_id",
    defaultValue: "",
  });

  const researchTypeId = useWatch({
    control: form.control,
    name: "research_type_id",
    defaultValue: "",
  });

  const { data: taxonomyTree, isPending: isLoadingTaxonomy } =
    useGetTaxonomyTree(journalId);

  // Get submission requirements and author guidelines from journal settings
  const submissionRequirements = useMemo(
    () => journal?.settings?.submission_requirements || [],
    [journal]
  );

  const authorGuidelines = useMemo(
    () => journal?.settings?.author_guidelines || "",
    [journal]
  );

  const submissionGuidelines = useMemo(
    () => journal?.settings?.submission_guidelines || "",
    [journal]
  );

  // Truncate author guidelines to 150 characters
  const truncatedGuidelines = useMemo(() => {
    if (!authorGuidelines) return "";
    const plainText = stripHtmlTags(authorGuidelines);
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  }, [authorGuidelines]);

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

  // Reset dependent fields when parent changes (only after user interaction)
  useEffect(() => {
    const currentCategoryId = form.getValues("category_id");
    // Only reset if category is not in the current section's categories
    if (sectionId && categoryOptions.length > 0) {
      const categoryExists = categoryOptions.some(
        (opt) => opt.value === currentCategoryId
      );
      if (!categoryExists) {
        form.setValue("category_id", "");
        form.setValue("research_type_id", "");
        form.setValue("area_id", "");
      }
    }
  }, [sectionId, categoryOptions, form]);

  useEffect(() => {
    const currentResearchTypeId = form.getValues("research_type_id");
    // Only reset if research type is not in the current category's research types
    if (categoryId && researchTypeOptions.length > 0) {
      const researchTypeExists = researchTypeOptions.some(
        (opt) => opt.value === currentResearchTypeId
      );
      if (!researchTypeExists) {
        form.setValue("research_type_id", "");
        form.setValue("area_id", "");
      }
    }
  }, [categoryId, researchTypeOptions, form]);

  useEffect(() => {
    const currentAreaId = form.getValues("area_id");
    // Only reset if area is not in the current research type's areas
    if (researchTypeId && areaOptions.length > 0) {
      const areaExists = areaOptions.some((opt) => opt.value === currentAreaId);
      if (!areaExists) {
        form.setValue("area_id", "");
      }
    }
  }, [researchTypeId, areaOptions, form]);

  return (
    <div className="space-y-4">
      {/* Journal Display (Read-only) */}
      <div>
        <FormLabel>Journal</FormLabel>
        <Card className="p-4 mt-2 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{journal?.title}</p>
              <p className="text-sm text-muted-foreground">
                {journal?.short_name}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Journal cannot be changed when editing
            </div>
          </div>
        </Card>
      </div>

      {/* Section Selection */}
      {journalId && (
        <FormField
          control={form.control}
          name="section_id"
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
          name="category_id"
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
          name="research_type_id"
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
          name="area_id"
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
      {journal && (
        <Card className="p-5 sm:p-6">
          <JournalInfoCard journal={journal} />
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
      {authorGuidelines && (
        <Card className="p-4 gap-0 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Author Guidelines</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowGuidelinesModal(true)}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Details
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{truncatedGuidelines}</p>
        </Card>
      )}

      {/* Author Guidelines Dialog */}
      <AuthorGuidelinesDialog
        open={showGuidelinesModal}
        onOpenChange={setShowGuidelinesModal}
        guidelines={authorGuidelines}
      />

      {/* Submission Requirements with Checkboxes */}
      {submissionRequirements.length > 0 && (
        <Card className="p-4 gap-0 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-foreground mb-4">
            Submission Requirements *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please confirm all requirements below to proceed:
          </p>
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <div className="space-y-3">
                {submissionRequirements.map((requirement, i) => (
                  <FormItem
                    key={i}
                    className="flex items-center space-x-2 space-y-0"
                  >
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
                ))}
              </div>
            )}
          />
          <FormMessage />
        </Card>
      )}
    </div>
  );
}
