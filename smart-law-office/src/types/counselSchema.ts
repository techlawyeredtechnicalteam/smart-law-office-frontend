// src/lib/schemas/counselSchema.ts
import { z } from "zod";

export const AddCounselSchema = z.object({
  fullName: z.string().min(3, "Full name is required."),

  scn: z
    .string()
    .min(5, "SCN is required.")
    .max(10, "SCN cannot exceed 10 characters."),

  email: z.string().email("Please enter a valid email address."),

  callToBarFile: z.string({}).min(1, "Call to Bar Certificate is required.")
});

export const EditCounselSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters.")
    .optional(),
  scn: z
    .string()
    .min(5, "SCN is invalid.")
    .max(10, "SCN is too long.")
    .optional(),
  email: z.string().email("Please enter a valid email address.").optional(),
  callToBarFile: z.string().optional().nullable(),

  status: z.enum(["Active", "Inactive"]).optional()
});

export type AddCounselFormType = z.infer<typeof AddCounselSchema>;
export type EditCounselFormType = z.infer<typeof EditCounselSchema>;
