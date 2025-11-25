"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useSubmitReview } from "../hooks/mutation/useSubmitReview";
import { FormRichTextEditor } from "@/features/shared";

// Validation schema
const reviewSchema = z.object({
  recommendation: z.enum(
    ["ACCEPT", "MINOR_REVISION", "MAJOR_REVISION", "REJECT"],
    {
      required_error: "Please select a recommendation",
    }
  ),
  confidence_level: z
    .number()
    .min(1)
    .max(5, "Confidence level must be between 1 and 5"),
  novelty: z.number().min(0).max(10),
  methodology: z.number().min(0).max(10),
  clarity: z.number().min(0).max(10),
  significance: z.number().min(0).max(10),
  originality: z.number().min(0).max(10),
  review_text: z
    .string()
    .min(100, "Review must be at least 100 characters")
    .max(10000, "Review must not exceed 10,000 characters"),
  confidential_comments: z.string().max(5000).optional(),
});

const RECOMMENDATION_OPTIONS = [
  {
    value: "ACCEPT",
    label: "Accept",
    description: "The manuscript is suitable for publication as is",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  },
  {
    value: "MINOR_REVISION",
    label: "Minor Revision",
    description: "Accept pending minor changes that do not require re-review",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
  {
    value: "MAJOR_REVISION",
    label: "Major Revision",
    description: "Requires substantial revisions and re-review",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  },
  {
    value: "REJECT",
    label: "Reject",
    description: "The manuscript is not suitable for publication",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
];

const CONFIDENCE_LEVELS = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Very High" },
];

const SCORE_CRITERIA = [
  {
    name: "novelty",
    label: "Novelty",
    description: "Originality and uniqueness of the research",
  },
  {
    name: "methodology",
    label: "Methodology",
    description: "Soundness of research methods and experimental design",
  },
  {
    name: "clarity",
    label: "Clarity",
    description: "Quality of writing and presentation",
  },
  {
    name: "significance",
    label: "Significance",
    description: "Impact and importance of the findings",
  },
  {
    name: "originality",
    label: "Originality",
    description: "Contribution to the field",
  },
];

export function ReviewSubmissionForm({ assignment }) {
  const router = useRouter();
  const submitReviewMutation = useSubmitReview();
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      recommendation: "",
      confidence_level: 3,
      novelty: 5,
      methodology: 5,
      clarity: 5,
      significance: 5,
      originality: 5,
      review_text: "",
      confidential_comments: "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const recommendation = watch("recommendation");
  const reviewText = watch("review_text");

  const onSubmit = async (data) => {
    try {
      const reviewData = {
        assignment: assignment.id,
        review_type: "SINGLE_BLIND",
        recommendation: data.recommendation,
        confidence_level: data.confidence_level,
        scores: {
          novelty: data.novelty,
          methodology: data.methodology,
          clarity: data.clarity,
          significance: data.significance,
          originality: data.originality,
        },
        review_text: data.review_text,
        confidential_comments: data.confidential_comments || "",
      };

      await submitReviewMutation.mutateAsync(reviewData);
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/reviewer/assignments");
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (showSuccess) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-300">
              Review Submitted Successfully!
            </h3>
            <p className="text-green-600 dark:text-green-400 mb-4">
              Thank you for your valuable feedback
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Redirecting to assignments...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle>1. Overall Recommendation</CardTitle>
            <CardDescription>
              Select your recommendation for this manuscript
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="recommendation"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {RECOMMENDATION_OPTIONS.map((option) => (
                    <div key={option.value}>
                      <Label
                        htmlFor={option.value}
                        className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          field.value === option.value
                            ? option.bg
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div
                            className={`font-semibold ${
                              field.value === option.value ? option.color : ""
                            }`}
                          >
                            {option.label}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 font-normal">
                            {option.description}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.recommendation && (
              <p className="text-sm text-destructive mt-2">
                {errors.recommendation.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Confidence Level */}
        <Card>
          <CardHeader>
            <CardTitle>2. Confidence Level</CardTitle>
            <CardDescription>
              How confident are you in your recommendation?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="confidence_level"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select confidence level" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIDENCE_LEVELS.map((level) => (
                      <SelectItem
                        key={level.value}
                        value={level.value.toString()}
                      >
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.confidence_level && (
              <p className="text-sm text-destructive mt-2">
                {errors.confidence_level.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Score Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>3. Quality Assessment</CardTitle>
            <CardDescription>
              Rate the manuscript on the following criteria (0-10)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SCORE_CRITERIA.map((criterion) => (
              <div key={criterion.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={criterion.name} className="font-semibold">
                      {criterion.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {criterion.description}
                    </p>
                  </div>
                  <Controller
                    name={criterion.name}
                    control={control}
                    render={({ field }) => (
                      <div className="text-md text-primary-foreground w-12 text-right">
                        {field.value}
                      </div>
                    )}
                  />
                </div>
                <Controller
                  name={criterion.name}
                  control={control}
                  render={({ field }) => (
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 (Poor)</span>
                  <span>5 (Average)</span>
                  <span>10 (Excellent)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review Text */}
        <Card className="">
          <CardHeader className="">
            <CardTitle>4. Detailed Review</CardTitle>
            <CardDescription>
              Provide detailed comments for the authors (minimum 100 characters)
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <FormRichTextEditor
              control={control}
              name="review_text"
              placeholder="Provide your detailed review here. Include strengths, weaknesses, and suggestions for improvement..."
              description={`${
                reviewText?.length || 0
              } characters (minimum 100 required)`}
              editor_classname="min-h-[300px]"
            />
          </CardContent>
        </Card>

        {/* Confidential Comments */}
        <Card className="">
          <CardHeader className="">
            <CardTitle>5. Confidential Comments (Optional)</CardTitle>
            <CardDescription>
              Comments visible only to editors, not shared with authors
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <FormRichTextEditor
              control={control}
              name="confidential_comments"
              placeholder="Optional confidential comments for the editorial team..."
              description="These comments will only be visible to the editorial team"
              editor_classname="min-h-[150px]"
            />
          </CardContent>
        </Card>

        {/* Warning Alert */}
        {recommendation && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please ensure you have carefully reviewed the manuscript before
              submitting. Your recommendation is:{" "}
              <strong>
                {
                  RECOMMENDATION_OPTIONS.find((o) => o.value === recommendation)
                    ?.label
                }
              </strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || submitReviewMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || submitReviewMutation.isPending}
          >
            {(isSubmitting || submitReviewMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Review
          </Button>
        </div>
      </form>
    </Form>
  );
}
