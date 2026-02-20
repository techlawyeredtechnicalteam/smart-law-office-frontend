import * as z from "zod";

export const ServiceType = z.enum(["Consultation", "Case", "Document Review"]);
export const DurationType = z.enum(["30 minutes", "1 hour", "Custom"]);

export const invoiceFormSchema = z.object({
  invoiceId: z.string(),
  clientName: z.string().min(1, { message: "Client name is required." }),
  service: ServiceType,
  subServiceId: z.string().min(1, { message: "Please select a type." }),
  duration: DurationType,
  consultationFee: z
    .number()
    .min(1, { message: "Fee must be greater than 0." }),
  date: z.string().min(1, { message: "Date is required." }),
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

// import * as z from "zod";

// export const ServiceType = z.enum(["Consultation", "Case", "Document Review"]);
// export const DurationType = z.enum(["30 minutes", "1 hour", "Custom"]);

// export const invoiceFormSchema = z.object({
//   invoiceId: z.string(),
//   clientName: z.string().min(1, { message: "Client name is required." }),
//   service: ServiceType,
//   duration: DurationType,
//   consultationFee: z
//     .number()
//     .min(1, { message: "Fee must be greater than 0." }),
//   date: z.string().min(1, { message: "Date is required." }),
//   time: z.string().min(1, { message: "Time is required." }),
//   notes: z.string().max(500).optional()
// });

// export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
