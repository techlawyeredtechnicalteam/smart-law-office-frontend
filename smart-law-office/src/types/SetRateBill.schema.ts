import { z } from "zod";

const ConsultationSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  serviceType: z.literal("Consultation"),
  consultType: z.string().min(1, "Consult Type is required"),
  duration: z.string().min(1, "Duration is required"),
  consultationRate: z.number().min(1, "Rate must be greater than 0"),
  // These must be optional so the 'Case' data doesn't interfere
  caseTypeId: z.string().optional(),
  subServiceId: z.string().optional(),
  caseRate: z.number().optional()
});

const CaseSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  serviceType: z.literal("Case"),
  caseTypeId: z.string().min(1, "Case Type is required"),
  subServiceId: z.string().min(1, "Sub-service is required"),
  caseRate: z.number().min(1, "Rate must be greater than 0"),
  // These must be optional so 'Consultation' data doesn't interfere
  duration: z.string().optional(),
  consultationRate: z.number().optional()
});

export const setRateBillSchema = z.discriminatedUnion("serviceType", [
  ConsultationSchema,
  CaseSchema
]);
export type setRateBillFormData = z.infer<typeof setRateBillSchema>;
