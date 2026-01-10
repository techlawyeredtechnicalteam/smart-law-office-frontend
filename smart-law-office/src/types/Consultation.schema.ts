import * as z from "zod";

export const consultationFormSchema = z.object({
  clientName: z.string().min(2, { message: "Client name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  consultationFee: z
    .number()
    .min(1, { message: "Consultation fee cannot be zero" }),
  date: z.date({ message: "A date is required" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (use HH: MM)."
  }),
  notes: z
    .string()
    .min(10, { message: "Notes must be datailed (at least 10 characters)." })
    .max(500, { message: "Notes must not exceed 500 characters." })
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

// Dashboard tupe
export type ConsultationStatus = "Scheduled" | "Pending" | "Completed";

export interface Consultation {
  consultationId: string;
  clientName: string;
  caseType: string;
  status: ConsultationStatus;
  meetingDate: string;
  meetingTime: string;
  notesSummary: string;
}

export interface ConsultationDetails extends Consultation {
  date: string;
  time: string;
  platform: string;
  paymentBank: string;
  paymentAccountName: string;
  paymentAccountNumber: string;
  fullNotes: string;
  immediateActions: string[];
}
