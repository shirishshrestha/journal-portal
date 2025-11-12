// SubmissionGuidelines.jsx
// Step 1: Journal Selection + Submission Guidelines

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SearchableSelect } from "@/features/shared/components/SearchableSelect";
import { useWatch } from "react-hook-form";

const SUBMISSION_GUIDELINES = [
  "The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor).",
  "The submission file is in OpenOffice, Microsoft Word, or RTF document file format.",
  "Where available, URLs for the references have been provided.",
  "The text is single-spaced; uses a 12-point font; employs italics, rather than underlining (except with URL addresses); and all illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end.",
  "The text adheres to the stylistic and bibliographic requirements outlined in the Author Guidelines.",
];

export default function SubmissionGuidelines({ form, journals }) {
  const journalName = useWatch({
    control: form.control,
    name: "journal_name",
    defaultValue: "",
  });

  const selectedJournal = journals.find(
    (journal) => journal.value === journalName
  );

  // Transform journals for SearchableSelect
  const journalOptions = journals.map((journal) => ({
    value: journal.value,
    label: journal.name,
  }));

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="journal_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Journal</FormLabel>
            <FormControl>
              <SearchableSelect
                options={journalOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Choose a journal..."
                searchPlaceholder="Search journals..."
                emptyText="No journal found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedJournal && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <h3 className="font-semibold text-foreground mb-2">
            {selectedJournal.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedJournal.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>• Publishing Frequency: {selectedJournal.frequency}</span>
            <span>
              • Impact Factor: {selectedJournal.impactFactor || "N/A"}
            </span>
          </div>
        </Card>
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
