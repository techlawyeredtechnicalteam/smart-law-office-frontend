import { z } from "zod";

export const assignCaseSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  caseId: z.string().min(1, "Please select a case"),
  counselId: z.string().min(1, "Please select a counsel")
});

export type AssignCaseSchema = z.infer<typeof assignCaseSchema>;
