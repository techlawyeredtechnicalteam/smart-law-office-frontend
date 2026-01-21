import { create } from "zustand";
import * as z from "zod";
import {
  SubscriptionStep,
  PlanType,
  BillingCycle,
  SubscriptionPlan,
  SubscriptionPaymentFormValues
} from "@/types/Subscription.schema";
import { webHookPayStack } from "@/app/api/webhook.api";

// Add this to your types
export interface SubscriptionPaymentMetadata {
  userId: string;
  planName: string; // e.g., "Pro" or "Basic"
  type: "subscription";
}

const BASIC_PLAN: SubscriptionPlan = {
  name: "Basic",
  monthlyPrice: 7500, // ₦7,500 (Updated from image subscribe.png)
  billingTerm: "per seat",
  features: [
    "A personalised user dashboard",
    "Access to assigned cases only",
    "Real-time case notes and document management",
    "Case status updates",
    "Calendar and scheduling",
    "Support access",
    "Communication tools"
  ]
};

const PRO_PLAN: SubscriptionPlan = {
  name: "Pro",
  monthlyPrice: 15000, // ₦15,000 (Updated from image subscribe.png)
  billingTerm: "per seat", // Consistent term used
  features: [
    "A personalised user dashboard",
    "Access to assigned cases only",
    "Real-time case notes and document management",
    "Case status updates",
    "Calendar and scheduling",
    "Support access",
    "Communication tools"
  ]
};

// ... (State interface remains the same)

interface SubscriptionState {
  step: SubscriptionStep;
  isLoading: boolean;
  currentSubscription: SubscriptionPlan;
  selectedSubscription: SubscriptionPlan;
  billingCycle: z.infer<typeof BillingCycle>;
  paymentFormData: Partial<SubscriptionPaymentFormValues> | null;
  paymentReference: string | null;

  setStep: (step: SubscriptionStep) => void;
  setIsLoading: (loading: boolean) => void;
  selectPlan: (planName: z.infer<typeof PlanType>) => void;
  setBillingCycle: (cycle: z.infer<typeof BillingCycle>) => void;
  setPaymentFormData: (data: Partial<SubscriptionPaymentFormValues>) => void;
  setPaymentReference: (ref: string | null) => void;
  resetFlow: () => void;
}

const initialState = {
  step: "manage" as SubscriptionStep,
  isLoading: false,
  currentSubscription: BASIC_PLAN,
  selectedSubscription: PRO_PLAN,
  billingCycle: "Monthly" as z.infer<typeof BillingCycle>,
  paymentFormData: null
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...initialState,
  paymentReference: null,

  setPaymentReference: (ref) => set({ paymentReference: ref }),

  setStep: (step: SubscriptionStep) => set({ step }),
  setIsLoading: (isLoading) => set({ isLoading }),

  selectPlan: (planName) => {
    const selectedPlan = planName === "Pro" ? PRO_PLAN : BASIC_PLAN;
    set({ selectedSubscription: selectedPlan });
  },

  setBillingCycle: (cycle) => set({ billingCycle: cycle }),

  setPaymentFormData: (data) =>
    set((state) => ({
      paymentFormData: { ...state.paymentFormData, ...data }
    })),

  resetFlow: () =>
    set({
      step: "manage",
      paymentReference: null
    })
}));

export { BASIC_PLAN, PRO_PLAN };
