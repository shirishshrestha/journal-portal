"use client";

import { useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import SubmissionGuidelines from "./submission-form-steps/SubmissionGuidelines";
import ManuscriptInfoStep from "./submission-form-steps/ManuscriptInfoStep";
import AuthorsStep from "./submission-form-steps/AuthorsStep";
import { useCreateSubmission, useGetJournalById } from "../../hooks";
import { useGetMe } from "@/features/shared";

const fullFormSchema = z.object({
  journal_id: z.string().min(1, "Journal is required"),
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  section: z.string().optional(),
  category: z.string().optional(),
  research_type: z.string().optional(),
  area: z.string().optional(),
  metadata_json: z
    .object({
      review_type: z.string().optional(),
      subject_area: z.string().optional(),
      funding_info: z.string().optional(),
      ethics_declarations: z.array(z.string()).optional(),
    })
    .optional(),
  corresponding_author: z.object({
    name: z.string(),
    email: z.string(),
    institution: z.string(),
  }),
  co_authors: z.array(z.any()),
  requirements: z
    .array(z.literal(true))
    .min(1, "All requirements must be accepted"),
});

export default function NewSubmissionForm() {
  const router = useRouter();
  const { data: meData } = useGetMe();
  const profile = useMemo(() => meData?.profile, [meData]);

  const { mutate: createSubmission, isPending: isCreating } =
    useCreateSubmission();

  const form = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      journal_id: "",
      requirements: [],
      title: "",
      abstract: "",
      keywords: [],
      section: "",
      category: "",
      research_type: "",
      area: "",
      metadata_json: {
        review_type: "Single Blind",
        subject_area: "Computer Science",
        funding_info: "",
        ethics_declarations: [],
      },
      corresponding_author: {
        name: profile?.user_name || "",
        email: profile?.user_email || "",
        institution: profile?.affiliation_name || "",
      },
      co_authors: [],
      terms_accepted: false,
    },
  });

  // Watch journal_id to get coauthor roles
  const journalId = useWatch({
    control: form.control,
    name: "journal_id",
    defaultValue: "",
  });

  const { data: selectedJournalDetails } = useGetJournalById(journalId, {
    enabled: !!journalId,
  });

  const coauthorRoles = useMemo(
    () => selectedJournalDetails?.settings?.coauthor_roles || [],
    [selectedJournalDetails]
  );

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
    // Transform form data to match backend API
    const submissionData = {
      journal_id: data.journal_id,
      title: data.title,
      abstract: data.abstract,
      section: data.section || undefined,
      category: data.category || undefined,
      research_type: data.research_type || undefined,
      area: data.area || undefined,
      metadata_json: {
        keywords: data.keywords,
        review_type: data.metadata_json?.review_type,
        subject_area: data.metadata_json?.subject_area,
        funding_info: data.metadata_json?.funding_info,
        ethics_declarations: data.metadata_json?.ethics_declarations,
        corresponding_author: data.corresponding_author,
        co_authors: data.co_authors,
      },
    };

    createSubmission(submissionData, {
      onSuccess: (response) => {
        router.push("/author/submissions/drafts");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Submission</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete all sections below to submit your manuscript
        </p>
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Journal Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Journal Selection</CardTitle>
              <CardDescription>
                Choose your target journal and review the submission guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubmissionGuidelines form={form} />
            </CardContent>
          </Card>

          {/* Manuscript Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Manuscript Information</CardTitle>
              <CardDescription>
                Provide details about your manuscript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManuscriptInfoStep form={form} />
            </CardContent>
          </Card>

          {/* Authors Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
              <CardDescription>
                Manage author information and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthorsStep
                form={form}
                handleAddCoauthor={handleAddCoauthor}
                handleRemoveCoauthor={handleRemoveCoauthor}
                coauthorRoles={coauthorRoles}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isCreating}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isCreating ? "Submitting..." : "Submit Manuscript"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
