// NewSubmissionForm.jsx
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import SubmissionGuidelines from "./submission-form-steps/SubmissionGuidelines";
import ManuscriptInfoStep from "./submission-form-steps/ManuscriptInfoStep";
import AuthorsStep from "./submission-form-steps/AuthorsStep";
import DocumentsStep from "./submission-form-steps/DocumentsStep";
import ReviewStep from "./submission-form-steps/ReviewStep";
import { useGetMe } from "@/features/shared/hooks/useGetMe";

const MOCK_JOURNALS = [
  {
    value: "journal-ai-research",
    name: "Journal of AI Research",
    description:
      "Focuses on machine learning, NLP, and data science studies. Publishes cutting-edge research in artificial intelligence and related fields.",
    frequency: "Monthly",
    impactFactor: "4.5",
  },
  {
    value: "data-science-review",
    name: "Data Science Review",
    description:
      "Peer-reviewed journal for data science and analytics research. Covers statistical methods, machine learning, and big data technologies.",
    frequency: "Quarterly",
    impactFactor: "3.8",
  },
  {
    value: "computational-ethics",
    name: "Computational Ethics",
    description:
      "Explores ethical dimensions of computational research. Addresses privacy, bias, fairness, and societal impact of computing technologies.",
    frequency: "Bi-monthly",
    impactFactor: "2.9",
  },
];

const fullFormSchema = z.object({
  journal_name: z.string(),
  title: z.string(),
  abstract: z.string(),
  keywords: z.array(z.string()),
  review_type: z.string(),
  subject_area: z.string(),
  funding_info: z.string().optional(),
  ethics_declarations: z.array(z.string()),
  corresponding_author: z.object({
    name: z.string(),
    email: z.string(),
    institution: z.string(),
  }),
  co_authors: z.array(z.any()),
  manuscript: z.array(z.any()),
  supplementary: z.array(z.any()).optional(),
  cover_letter: z.array(z.any()).optional(),
  requirements: z.array(z.literal(true)),
  terms_accepted: z.boolean(),
});

export default function NewSubmissionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState({
    manuscript: [],
    supplementary: [],
    cover_letter: [],
  });

  const {
    data: meData,
    error: isMeError,
    isPending: isMePending,
    refetch,
  } = useGetMe();

  const profile = useMemo(() => meData?.profile, [meData]);

  const form = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      journal_name: "",
      requirements: [],
      title: "",
      abstract: "",
      keywords: [],
      review_type: "Single Blind",
      subject_area: "Computer Science",
      funding_info: "",
      ethics_declarations: [],
      corresponding_author: {
        name: profile?.user_name || "",
        email: profile?.user_email || "",
        institution: profile?.affiliation_name || "",
      },
      co_authors: [],
      manuscript: [],
      supplementary: [],
      cover_letter: [],
      terms_accepted: false,
    },
  });

  const steps = [
    { title: "Journal Selection", description: "Choose your target journal" },
    { title: "Manuscript Info", description: "Add manuscript details" },
    { title: "Authors", description: "Manage author information" },
    { title: "Documents", description: "Upload files" },
    { title: "Review", description: "Final review and submit" },
  ];

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      form.setValue("corresponding_author.name", profile.user_name || "");
      form.setValue("corresponding_author.email", profile.user_email || "");
      form.setValue(
        "corresponding_author.institution",
        profile.affiliation_name || ""
      );
    }
  }, [profile, form]);

  const handleFileUpload = (category, files) => {
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [category]: [...prev[category], ...Array.from(files)],
      }));
    }
  };

  const handleRemoveFile = (category, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleAddCoauthor = () => {
    const currentCoAuthors = form.getValues("co_authors") || [];
    form.setValue("co_authors", [
      ...currentCoAuthors,
      {
        name: "",
        email: "",
        institution: "",
        orcid: "",
        contribution_role: "Author",
      },
    ]);
  };

  const handleRemoveCoauthor = (index) => {
    const currentCoAuthors = form.getValues("co_authors") || [];
    form.setValue(
      "co_authors",
      currentCoAuthors.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Mock submission
        toast({
          title: "Success",
          description: "Your manuscript has been submitted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit manuscript. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const isStepValid = () => {
    const values = form.getValues();

    switch (currentStep) {
      case 0: {
        // Journal selection and all 5 requirements must be checked
        const hasJournal =
          !!values.journal_name && values.journal_name.trim() !== "";
        const hasRequirements =
          Array.isArray(values.requirements) &&
          values.requirements.filter((req) => req === true).length === 5;
        return hasJournal && hasRequirements;
      }
      case 1: {
        // Title, abstract, and at least one keyword required
        return (
          !!values.title &&
          values.title.trim() !== "" &&
          !!values.abstract &&
          values.abstract.trim() !== "" &&
          Array.isArray(values.keywords) &&
          values.keywords.length > 0
        );
      }
      case 2: {
        // Corresponding author info required
        return (
          !!values.corresponding_author &&
          !!values.corresponding_author.name &&
          values.corresponding_author.name.trim() !== "" &&
          !!values.corresponding_author.email &&
          values.corresponding_author.email.trim() !== "" &&
          !!values.corresponding_author.institution &&
          values.corresponding_author.institution.trim() !== ""
        );
      }
      case 3: {
        // At least one manuscript file required
        return uploadedFiles.manuscript.length > 0;
      }
      case 4: {
        // Terms must be accepted
        return values.terms_accepted === true;
      }
      default:
        return true;
    }
  };
  console.log(!isStepValid);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Submission</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit your manuscript to a journal in {steps.length} steps
        </p>
      </div>
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentStep].title}
          </span>
        </div>
        <Progress
          value={((currentStep + 1) / steps.length) * 100}
          className="h-2"
        />
      </div>
      {/* Steps Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => i < currentStep && setCurrentStep(i)}
            className={`p-2 rounded-lg text-xs text-center transition-colors ${
              i === currentStep
                ? "bg-blue-500 text-white"
                : i < currentStep
                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
            disabled={i > currentStep}
          >
            {step.title}
          </button>
        ))}
      </div>
      {/* Form Content */}
      <Card className="bg-background border border-border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SubmissionGuidelines form={form} journals={MOCK_JOURNALS} />
                </motion.div>
              )}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ManuscriptInfoStep form={form} />
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <AuthorsStep
                    form={form}
                    handleAddCoauthor={handleAddCoauthor}
                    handleRemoveCoauthor={handleRemoveCoauthor}
                  />
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <DocumentsStep
                    uploadedFiles={uploadedFiles}
                    handleFileUpload={handleFileUpload}
                    handleRemoveFile={handleRemoveFile}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ReviewStep form={form} uploadedFiles={uploadedFiles} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-3">
                <Button type="submit" className="gap-2">
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                  {currentStep < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
