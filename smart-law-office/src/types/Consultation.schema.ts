import * as z from "zod";

export const consultationFormSchema = z.object({
  consultationFeeId: z.string().min(1, "Please select a consultation type"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  note: z.string().min(10, {
    message: "Please provide more detail (at least 10 characters)."
  }),
  document: z.any().optional().nullable()
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export interface ConsultationFormData extends ConsultationFormValues {
  consultAt?: string;
  feeDetails?: {
    id: string;
    consultType: string;
    duration: number;
    rate: number;
  };
  paymentReceipt: string;
}

// Dashboard type
export type ConsultationStatus = "Scheduled" | "Pending" | "Completed";
