import { z } from "zod";

export const createCaseSchema = z.object({
  clientEmail: z.string().email("Invalid email"),
  caseTypeId: z.string().min(1, "Required"),
  // status: z.string().default("Discovery"),
  status: z.string(),
  // Using .catch("") ensures that if the value is missing, it becomes an empty string
  title: z.string().catch(""),
  date: z.string().catch(""),
  time: z.string().catch(""),
  consultId: z.string().catch(""),
  staffEmail: z.string().catch(""),
  lastAdjournedDate: z.string().catch(""),
  nextAdjournedDate: z.string().catch(""),
  notes: z.string().catch(""),
  file: z.string().catch("")
});

export type createCaseSchema = z.infer<typeof createCaseSchema>;
