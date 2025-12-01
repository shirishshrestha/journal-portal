import z from "zod";
import { stripHtmlTags } from "@/features/shared/utils";

export const roleRequestSchema = z.object({
  requested_roles: z
    .array(z.string())
    .min(1, "Please select at least one role"),
  affiliation: z.string().min(2, "Affiliation is required"),
  affiliation_email: z.string().email("Invalid email address"),
  research_interests: z
    .string()
    .min(50, "Please describe your research interests (min 50 characters)")
    .refine((val) => {
      const plainText = stripHtmlTags(val);
      return plainText.length >= 50;
    }, "Research interests must contain at least 50 characters of text"),
  academic_position: z.string().min(2, "Academic position is required"),
  supporting_letter: z
    .string()
    .min(100, "Please provide a supporting letter (min 100 characters)")
    .refine((val) => {
      const plainText = stripHtmlTags(val);
      return plainText.length >= 100;
    }, "Supporting letter must contain at least 100 characters of text"),
});

export const profileSchema = z.object({
  user_name: z.string().optional(),
  display_name: z.string().min(2, "Display name is required"),
  user_email: z.string().email("Invalid email address"),
  bio: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      const plainText = stripHtmlTags(val);
      return plainText.length <= 500;
    }, "Bio must not exceed 500 characters of text"),
  liation_ror_id: z.string().optional(),
  expertise_areas: z.union([z.array(z.string()), z.string()]).optional(),
});
