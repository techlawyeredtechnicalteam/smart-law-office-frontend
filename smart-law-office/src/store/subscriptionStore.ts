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
import { useAuthStore } from "./authStore";

export interface SubscriptionPaymentMetadata {
  userId: string;
  planName: string; // e.g., "Pro" or "Basic"
  type: "subscription";
}

const BASIC_PLAN: SubscriptionPlan = {
  name: "BASIC",
  monthlyPrice: 7500,
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
  name: "PRO",
  monthlyPrice: 15000,
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
    const selectedPlan = planName === "PRO" ? PRO_PLAN : BASIC_PLAN;
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
