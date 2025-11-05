import z from "zod";

export const roleRequestSchema = z.object({
  requested_role: z.array(z.string()).min(1, "Please select at least one role"),
  affiliation: z.string().min(2, "Affiliation is required"),
  affiliation_email: z.string().email("Invalid email address"),
  research_interests: z
    .string()
    .min(10, "Please describe your research interests (min 10 characters)"),
  academic_position: z.string().min(2, "Academic position is required"),
  supporting_letter: z
    .string()
    .min(20, "Please provide a supporting letter (min 20 characters)"),
});

export const orcidSchema = z.object({
  orcid_id: z
    .string()
    .regex(
      /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/,
      "Invalid ORCID format (XXXX-XXXX-XXXX-XXXXX)"
    ),
});
