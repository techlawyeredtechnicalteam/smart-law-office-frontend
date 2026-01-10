import * as z from "zod";

export const documentSchema = z.object({
  name: z.string().min(2, "Document name is required"),
  caseType: z.string().min(2, "Type of case is required"),
  status: z.enum(["Discovery", "Contract", "Pleading"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  file: z.string().min(1, "Please upload a document")
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
