// ReviewStep.jsx
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useWatch } from "react-hook-form";

export default function ReviewStep({ form, uploadedFiles }) {
  const formData = useWatch({
    control: form.control,
  });

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/50 border border-border space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Journal</h4>
          <p className="text-sm text-muted-foreground">
            {formData?.journal_name || "Not selected"}
          </p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Title</h4>
          <p className="text-sm text-muted-foreground">
            {formData?.title || "Not provided"}
          </p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Abstract</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {formData?.abstract || "Not provided"}
          </p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Authors</h4>
          <p className="text-sm text-muted-foreground">
            {formData?.corresponding_author?.name || "Not provided"}{" "}
            (Corresponding Author)
          </p>
          {formData?.co_authors?.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {formData.co_authors.length} co-author(s)
            </p>
          )}
        </div>
        <div className="h-px bg-border" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Files</h4>
          <p className="text-sm text-muted-foreground">
            {uploadedFiles.manuscript.length} manuscript
            {uploadedFiles.cover_letter.length > 0 && ", cover letter"}
            {uploadedFiles.supplementary.length > 0 &&
              `, ${uploadedFiles.supplementary.length} supplementary`}
          </p>
        </div>
      </Card>
      <FormField
        control={form.control}
        name="terms_accepted"
        render={({ field }) => (
          <FormItem className="flex items-start space-x-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal text-sm leading-relaxed cursor-pointer">
              I accept the terms and conditions and agree to submit this
              manuscript
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}
