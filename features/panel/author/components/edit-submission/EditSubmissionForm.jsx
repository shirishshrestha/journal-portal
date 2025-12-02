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
import { Save, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import EditSubmissionGuidelines from "./EditSubmissionGuidelines";
import ManuscriptInfoStep from "../new-submission/submission-form-steps/ManuscriptInfoStep";
import AuthorsStep from "../new-submission/submission-form-steps/AuthorsStep";
import { useUpdateSubmission } from "../../hooks";
import { useGetMe } from "@/features/shared";
import { stripHtmlTags } from "@/features/shared/utils";

const fullFormSchema = z.object({
  journal_id: z.string().min(1, "Journal is required"),
  title: z.string().min(1, "Title is required"),
  abstract: z
    .string()
    .min(1, "Abstract is required")
    .refine((val) => {
      const plainText = stripHtmlTags(val);
      return plainText.length > 0;
    }, "Abstract must contain text"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  section_id: z.string().optional(),
  category_id: z.string().optional(),
  research_type_id: z.string().optional(),
  area_id: z.string().optional(),
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

export default function EditSubmissionForm({ submission }) {
  const router = useRouter();
  const params = useParams();
  const { data: meData } = useGetMe();
  const profile = useMemo(() => meData?.profile, [meData]);

  const { mutate: updateSubmission, isPending: isUpdating } =
    useUpdateSubmission();

  // Extract metadata from submission
  const metadata = useMemo(() => {
    if (!submission?.metadata_json) return {};
    return typeof submission.metadata_json === "string"
      ? JSON.parse(submission.metadata_json)
      : submission.metadata_json;
  }, [submission]);

  const form = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      journal_id: submission?.journal?.id?.toString() || "",
      requirements: [true],
      title: submission?.title || "",
      abstract: submission?.abstract || "",
      keywords: metadata?.keywords || [],
      section_id: "",
      category_id: "",
      research_type_id: "",
      area_id: "",
      metadata_json: {
        review_type: metadata?.review_type || "Single Blind",
        subject_area: metadata?.subject_area || "Computer Science",
        funding_info: metadata?.funding_info || "",
        ethics_declarations: metadata?.ethics_declarations || [],
      },
      corresponding_author: {
        name: metadata?.corresponding_author?.name || profile?.user_name || "",
        email:
          metadata?.corresponding_author?.email || profile?.user_email || "",
        institution:
          metadata?.corresponding_author?.institution ||
          profile?.affiliation_name ||
          "",
      },
      co_authors: metadata?.co_authors || [],
      terms_accepted: false,
    },
  });
  // Set taxonomy fields when submission changes
  useEffect(() => {
    form.setValue("section_id", submission?.section?.id || "");
    form.setValue("category_id", submission?.section?.category?.id || "");
    form.setValue(
      "research_type_id",
      submission?.section?.category?.research_type?.id || ""
    );
    form.setValue(
      "area_id",
      submission?.section?.category?.research_type?.area?.id || ""
    );
  }, [submission, form]);

  // Get coauthor roles and requirements directly from submission's journal
  const coauthorRoles = useMemo(
    () => submission?.journal?.settings?.coauthor_roles || [],
    [submission]
  );

  const submissionRequirements = useMemo(
    () => submission?.journal?.settings?.submission_requirements || [],
    [submission]
  );

  // Update form when profile data loads
  useEffect(() => {
    if (profile && !metadata?.corresponding_author) {
      form.setValue("corresponding_author.name", profile.user_name || "");
      form.setValue("corresponding_author.email", profile.user_email || "");
      form.setValue(
        "corresponding_author.institution",
        profile.affiliation_name || ""
      );
    }
  }, [profile, form, metadata]);

  // Initialize requirements array when journal details load
  useEffect(() => {
    if (submissionRequirements.length > 0) {
      const existingRequirements = form.getValues("requirements");
      if (!existingRequirements || existingRequirements.length === 0) {
        form.setValue(
          "requirements",
          submissionRequirements.map(() => true)
        );
      }
    }
  }, [submissionRequirements, form]);

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
      section_id: data.section_id || undefined,
      category_id: data.category_id || undefined,
      research_type_id: data.research_type_id || undefined,
      area_id: data.area_id || undefined,
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

    updateSubmission(
      { id: params.id, data: submissionData },
      {
        onSuccess: (response) => {
          router.push("/author/submissions/drafts");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Submission</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your manuscript information
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
              <EditSubmissionGuidelines form={form} submission={submission} />
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
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
