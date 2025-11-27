"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateEditorialDecision } from "../hooks/useCreateEditorialDecision";
import { useGetDecisionLetterTemplates } from "../hooks/useGetDecisionLetterTemplates";
import { Input } from "@/components/ui/input";
import {
  DecisionBadge,
  reviewRecommendationConfig,
  FormRichTextEditor,
} from "@/features";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";

const decisionSchema = z.object({
  decision_type: z.enum(
    ["ACCEPT", "REJECT", "MINOR_REVISION", "MAJOR_REVISION"],
    {
      required_error: "Please select a decision type",
    }
  ),
  decision_letter: z
    .string()
    .min(50, "Decision letter must be at least 50 characters"),
  confidential_notes: z.string().optional(),
  revision_deadline: z.string().optional(),
  template_id: z.string().optional(),
});

const DECISION_OPTIONS = [
  {
    value: "ACCEPT",
    label: "Accept",
    description: "Accept the submission for publication",
    color: "text-green-600 dark:text-green-400", // fallback for legacy
    style: { color: "var(--color-accept, #16a34a)" },
  },
  {
    value: "REJECT",
    label: "Reject",
    description: "Reject the submission",
    color: "text-red-600 dark:text-red-400",
    style: { color: "var(--color-reject, #dc2626)" },
  },
  {
    value: "MINOR_REVISION",
    label: "Minor Revision",
    description: "Request minor revisions",
    color: "text-blue-600 dark:text-blue-400",
    style: { color: "var(--color-minor-revision, #2563eb)" },
  },
  {
    value: "MAJOR_REVISION",
    label: "Major Revision",
    description: "Request major revisions",
    color: "text-orange-600 dark:text-orange-400",
    style: { color: "var(--color-major-revision, #ea580c)" },
  },
];

export default function EditorialDecisionForm({
  submissionId,
  reviews = [],
  submission = [],
}) {
  const { mutate: createDecision, isPending } = useCreateEditorialDecision();
  const { data: templates, isLoading: templatesLoading } =
    useGetDecisionLetterTemplates();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      decision_type: "",
      decision_letter: "",
      confidential_notes: "",
      revision_deadline: "",
      template_id: "",
    },
  });

  const selectedDecisionType = form.watch("decision_type");
  const selectedTemplateId = form.watch("template_id");

  // Load template content when selected
  const handleTemplateSelect = (templateId) => {
    const template = templates?.results?.find(
      (t) => t.id.toString() === templateId
    );
    if (template) {
      form.setValue("decision_letter", template.content);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      submission: submissionId,
      decision_type: data.decision_type,
      decision_letter: data.decision_letter,
      confidential_notes: data.confidential_notes || "",
    };

    // Only add revision_deadline if decision type is revision
    if (
      (data.decision_type === "MINOR_REVISION" ||
        data.decision_type === "MAJOR_REVISION") &&
      data.revision_deadline
    ) {
      payload.revision_deadline = data.revision_deadline;
    }

    createDecision(payload, {
      onSuccess: () => {
        form.reset();
        router.push(`/editor/submissions/${submissionId}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      {reviews.length > 0 && (
        <Card className={"gap-4 p-0 border-none"}>
          <CardHeader className={"gap-0 px-0"}>
            <CardTitle className="text-lg">Reviews Summary</CardTitle>
          </CardHeader>
          <CardContent className={"p-0"}>
            <div className="">
              {/* Only show the first review if reviews exist, with full details */}
              <div
                key={reviews[0].id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Review 1 (Latest)</h4>
                    <p className="text-sm text-muted-foreground">
                      Submitted on{" "}
                      {new Date(reviews[0].submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <DecisionBadge
                      decisionType={reviews[0].recommendation}
                      config={reviewRecommendationConfig}
                      className="mb-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Confidence: {reviews[0].confidence_level}/5
                    </p>
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t my-2" />

                {reviews[0].scores && (
                  <div>
                    <h5 className="text-sm font-semibold mb-2">
                      Quality Assessment
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">Novelty</p>
                        <p className="text-lg font-semibold">
                          {reviews[0].scores.novelty}/10
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">
                          Methodology
                        </p>
                        <p className="text-lg font-semibold">
                          {reviews[0].scores.methodology}/10
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">Clarity</p>
                        <p className="text-lg font-semibold">
                          {reviews[0].scores.clarity}/10
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">
                          Significance
                        </p>
                        <p className="text-lg font-semibold">
                          {reviews[0].scores.significance}/10
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">
                          Originality
                        </p>
                        <p className="text-lg font-semibold">
                          {reviews[0].scores.originality}/10
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Separator */}
                <div className="border-t my-2" />

                <div>
                  <h5 className="text-sm font-semibold mb-2">
                    Detailed Review
                  </h5>
                  <div className="col-span-2">
                    <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border bg-muted/30 p-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: reviews[0].review_text,
                        }}
                        className="text-muted-foreground whitespace-pre-wrap"
                      />
                    </ScrollArea>
                  </div>
                </div>

                {reviews[0].confidential_comments && (
                  <>
                    <div className="border-t my-2" />
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <h5 className="text-sm font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                        Confidential Comments (For Editor Only)
                      </h5>
                      <p className="text-sm text-yellow-900 dark:text-yellow-200 whitespace-pre-wrap">
                        <ScrollArea className="min-h-[200px] max-h-[500px] w-full rounded border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 p-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: reviews[0].confidential_comments,
                            }}
                            className="text-muted-foreground whitespace-pre-wrap"
                          />
                        </ScrollArea>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Form */}
      {submission?.status !== "ACCEPTED" && (
        <Card>
          <CardHeader>
            <CardTitle>Make Editorial Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Decision Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-baseline">
                  <FormField
                    control={form.control}
                    name="decision_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a decision" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DECISION_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer focus:bg-primary/30"
                              >
                                <span className={option.color}>
                                  {option.label}
                                </span>
                                <span className="text-xs ml-2 text-foreground">
                                  - {option.description}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Template Selector */}
                  <FormField
                    control={form.control}
                    name="template_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Decision Letter Template (Optional)
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleTemplateSelect(value);
                          }}
                          value={field.value || ""}
                          disabled={templatesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template to auto-fill" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates?.results?.map((template) => (
                              <SelectItem
                                key={template.id}
                                value={template.id.toString()}
                              >
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a template to pre-fill the decision letter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Revision Deadline (only for revision decisions) */}
                {(selectedDecisionType === "MINOR_REVISION" ||
                  selectedDecisionType === "MAJOR_REVISION") && (
                  <FormField
                    control={form.control}
                    name="revision_deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revision Deadline</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="date"
                              {...field}
                              className="pl-10"
                              min={new Date().toISOString().split("T")[0]}
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Deadline for authors to submit revisions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Decision Letter */}
                <FormRichTextEditor
                  control={form.control}
                  name="decision_letter"
                  label="Decision Letter *"
                  placeholder="Write the decision letter to be sent to the author..."
                  description="This letter will be sent to the author. Minimum 50 characters required."
                />

                {/* Confidential Notes */}
                <FormRichTextEditor
                  control={form.control}
                  name="confidential_notes"
                  label="Confidential Notes (Optional)"
                  placeholder="Internal notes not visible to authors..."
                  description="These notes are for internal use only and will not be shared with the author"
                />

                <div className="flex justify-end space-x-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Decision"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
