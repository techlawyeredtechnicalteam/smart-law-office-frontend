import * as z from "zod";

export const PlanType = z.enum(["BASIC", "PRO"]);
export const BillingCycle = z.enum(["Monthly", "Yearly"]);

// Schema for the payment method selection, including billing address
export const subscriptionPaymentSchema = z.object({
  cardNumber: z.string().min(1, { message: "Card number is required." }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
    message: "Invalid MM/YY format."
  }),
  cvv: z.string().length(3, { message: "CVV must be 3 digits." }),
  billingAddress: z
    .string()
    .min(1, { message: "Billing address is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  state: z.string().min(1, { message: "State is required." }),
  city: z.string().min(1, { message: "City is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." })
});

export type SubscriptionPaymentFormValues = z.infer<
  typeof subscriptionPaymentSchema
>;

export interface SubscriptionPlan {
  name: z.infer<typeof PlanType>;
  monthlyPrice: number;
  billingTerm: string; // e.g., 'per seat' or 'per counsel'
  features: string[];
}

export type SubscriptionStep =
  | "manage"
  | "review"
  | "payment"
  | "verify"
  | "success";
