import * as z from "zod";

export const submissionSettingsSchema = z.object({
  // Submission Guidelines
  submission_guidelines: z.string().optional(),
  author_guidelines: z.array(z.string()).optional().default([]),
  submission_requirements: z.array(z.string()).optional().default([]),
  coauthor_roles: z.array(z.string()).optional().default([]),

  // Review Process
  review_type: z
    .enum(["SINGLE_BLIND", "DOUBLE_BLIND", "OPEN_REVIEW"])
    .default("DOUBLE_BLIND"),
  min_reviewers: z.number().min(1).max(10).default(2),
  review_deadline_days: z.number().min(1).max(365).default(21),

  // File Requirements
  max_file_size_mb: z.number().min(1).max(100).default(25),
  allowed_file_types: z.string().default("pdf,docx,tex"),
  require_cover_letter: z.boolean().default(true),
  require_conflict_of_interest: z.boolean().default(true),

  // Publication
  publication_frequency: z
    .enum([
      "WEEKLY",
      "BIWEEKLY",
      "MONTHLY",
      "QUARTERLY",
      "BIANNUALLY",
      "ANNUALLY",
      "CONTINUOUS",
    ])
    .default("MONTHLY"),
  article_processing_charge: z.string().optional(),
  apc_currency: z
    .enum(["USD", "EUR", "GBP", "JPY", "AUD", "CAD"])
    .default("USD"),

  // Additional Settings
  allow_preprints: z.boolean().default(true),
  require_data_availability: z.boolean().default(false),
  require_funding_info: z.boolean().default(true),
});
