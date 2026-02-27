import { z } from "zod";

export const createCaseSchema = z.object({
  clientEmail: z.string().optional(),
  clientName: z.string().min(1, "Client Name is Required"),
  // staffEmail: z.string().email("Invalid email"),
  staffEmail: z.string().email().optional().or(z.literal("")),
  caseTypeId: z.string().min(1, "Required"),
  status: z.string(),
  title: z.string().catch(""),
  // Using .catch("") ensures that if the value is missing, it becomes an empty string
  // date: z.string().catch(""),
  // time: z.string().catch(""),
  // consultId: z.string().catch(""),
  lastAdjournedDate: z.string().catch(""),
  nextAdjournedDate: z.string().catch(""),
  notes: z.string().catch(""),
  document: z.string().catch("")
});

export type createCaseSchema = z.infer<typeof createCaseSchema>;
