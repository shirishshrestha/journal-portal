import { z } from "zod";

export const profileSchema = z.object({
  user_name: z.string().min(2, "Name must be at least 2 characters"),
  display_name: z.string().min(2, "Display name is required"),
  user_email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  affiliation_name: z.string().min(1, "Institution is required"),
  orcid_id: z.string().optional(),
  expertise_areas: z.string().min(2, "Please add expertise areas"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
