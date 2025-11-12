// RequirementsStep.jsx
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const SUBMISSION_REQUIREMENTS = [
  "The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor).",
  "The submission file is in OpenOffice, Microsoft Word, or RTF document file format.",
  "Where available, URLs for the references have been provided.",
  "The text is single-spaced; uses a 12-point font; employs italics, rather than underlining (except with URL addresses); and all illustrations, figures, and tables are placed within the text at the appropriate points, rather than at the end.",
  "The text adheres to the stylistic and bibliographic requirements outlined in the Author Guidelines.",
];

export default function RequirementsStep({ form }) {
  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
      <h3 className="font-semibold text-foreground mb-4">
        Submission Requirements
      </h3>
      <div className="space-y-3">
        {SUBMISSION_REQUIREMENTS.map((requirement, i) => (
          <FormField
            key={i}
            control={form.control}
            name={`requirements`}
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3">
                <FormControl>
                  <Checkbox
                    checked={
                      Array.isArray(field.value) && field.value[i] === true
                    }
                    onCheckedChange={(checked) => {
                      const arr = Array.isArray(field.value)
                        ? [...field.value]
                        : Array(SUBMISSION_REQUIREMENTS.length).fill(false);
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
  );
}
