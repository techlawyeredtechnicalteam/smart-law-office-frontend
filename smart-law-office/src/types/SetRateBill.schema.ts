import { z } from "zod";

export const setRateBillSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  serviceType: z.enum(["Consultation", "Case"]),

  // Consultation specific
  duration: z.string().min(1, "Duration is required"),
  consultationRate: z.number().min(0, "Please entter your consultation rate"),

  // Case specific
  caseTypeId: z.string().min(1, "Please select a case type"),
  subServiceId: z.string().min(1, "Please select a sub-service"),
  caseRate: z.number().min(0, "Please select your case rate")
});

// export const setRateBillSchema = z.discriminatedUnion("serviceType", [
//   z.object({
//     invoiceId: z.string().min(1, "Invoice ID is required"),
//     serviceType: z.literal("Consultation"),
//     duration: z.string(),
//     consultationRate: z.coerce.number().min(0)
//   }),
//   z.object({
//     invoiceId: z.string().min(1, "Invoice ID is required"),
//     serviceType: z.literal("Case"),
//     caseTypeId: z.string().min(1, "Please select a case type"),
//     subServiceId: z.string().min(1, "Please select a sub-service"),
//     caseRate: z.coerce.number().min(0)
//   })
// ]);
export type setRateBillFormData = z.infer<typeof setRateBillSchema>;
