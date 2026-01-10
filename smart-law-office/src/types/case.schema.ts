import { z } from "zod";

// Schema for creating a case - matches backend payload
export const createCaseSchema = z.object({
  title: z.string().min(2, "Case title is required"),
  caseTypeId: z.string().min(1, "Case type is required"),
  consultId: z.string().optional().or(z.literal("")),
  // consultId: z.string().min(1, "Consult Id is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),

  // ADD THESE:
  clientEmail: z.string().email("Invalid client email"),
  staffEmail: z.string().email("Invalid staff email"),

  // Use .optional() or allow empty strings for dates, notes, and files
  lastAdjournedDate: z.string().optional().or(z.literal("")),
  nextAdjournedDate: z.string().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional().or(z.literal("")),
  file: z.string().optional().or(z.literal(""))
  // lastAdjournedDate: z.string(),
  // nextAdjournedDate: z.string(),
  // status: z.string().min(1, "Status is required"),
  // notes: z.string(),
  // file: z.string()
});

export type createCaseSchema = z.infer<typeof createCaseSchema>;

// // Case Type interface (from backend)
// export interface CaseType {
//   id: string;
//   name: string;
//   description: string;
//   code: string;
//   createdAt: string;
// }

// // Unassigned Case interface (if needed for assignment flow)
// export interface UnassignedCase {
//   consultCode: string;
//   clientProfileId: string;
//   caseTypeId: string;
//   status: "New" | "Pending Document" | "Awaiting Assignment";
//   dateTime: string;
// }
