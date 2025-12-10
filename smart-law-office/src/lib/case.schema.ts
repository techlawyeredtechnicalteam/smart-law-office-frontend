import { z } from "zod";

export const createCaseSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  caseType: z.string().min(1, "Case type is required"),

  // date validation
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Invalid Date Format"
  }),
  time: z
    .string()
    .regex(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:MM)"
    ),

  //optional dates
  lastAdjournedDate: z.string().optional(),
  nextAdjournedDate: z.string().optional(),

  status: z.enum(["Scheduled", "Pending", "Completed", "Active"]),

  // Note text area
  notes: z.string().min(1, "Consultation notes are required")
});

export type createCaseSchema = z.infer<typeof createCaseSchema>;
