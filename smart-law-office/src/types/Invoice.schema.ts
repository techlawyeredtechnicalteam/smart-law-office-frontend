import * as z from "zod";

export const ServiceType = z.enum(["Consultation", "Case", "Document Review"]);
export const DurationType = z.enum(["30 minutes", "1 hour", "Custom"]);

export const invoiceFormSchema = z.object({
  invoiceId: z.string().default("2025-0012"),
  clientName: z.string().min(1, { message: "Client name is required." }),
  service: ServiceType,
  duration: DurationType,
  consultationFee: z
    .number()
    .min(1, { message: "Fee must be greater than 0." }),
  date: z.string().min(1, { message: "Date is required." }), // Using string for dd/mm/yy replication
  time: z.string().min(1, { message: "Time is required." }),
  notes: z.string().max(500).optional()
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export interface InvoiceDetails extends InvoiceFormValues {
  invoiceId: string;
  accountDetails: string;
  bank: string;
  status: "Successful" | "Pending" | "Canceled";
}
