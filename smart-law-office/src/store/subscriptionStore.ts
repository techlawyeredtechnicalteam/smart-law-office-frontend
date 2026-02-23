import { create } from "zustand";
import * as z from "zod";
import {
  SubscriptionStep,
  PlanType,
  BillingCycle,
  SubscriptionPlan,
  SubscriptionPaymentFormValues
} from "@/types/Subscription.schema";

export interface SubscriptionPaymentMetadata {
  userId: string;
  planName: string;
  action?: "user_create";
  userPayload?: any;
}

const BASIC_PLAN: SubscriptionPlan = {
  name: "BASIC",
  monthlyPrice: 5000,
  billingTerm: "per seat",
  features: ["Personalised dashboard", "Case management", "Support access"]
};

const PRO_PLAN: SubscriptionPlan = {
  name: "PRO",
  monthlyPrice: 5000,
  billingTerm: "per seat",
  features: ["All Basic features", "Advanced scheduling", "Priority support"]
};

interface SubscriptionState {
  isLoading: boolean;
  selectedPlan: SubscriptionPlan;
  billingCycle: z.infer<typeof BillingCycle>;

  // Payment State
  paymentReference: string | null;
  pendingCounselPayload: any | null;

  // Actions
  setIsLoading: (loading: boolean) => void;
  setPlan: (planName: z.infer<typeof PlanType>) => void;
  setBillingCycle: (cycle: z.infer<typeof BillingCycle>) => void;
  preparePayment: (payload: any | null) => void;
  setPaymentReference: (ref: string | null) => void;
  resetPayment: () => void;
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
  isLoading: false,
  selectedPlan: PRO_PLAN,
  billingCycle: "Monthly",
  paymentReference: null,
  pendingCounselPayload: null,

  setIsLoading: (isLoading) => set({ isLoading }),

  setPlan: (planName) => {
    const plan = planName === "PRO" ? PRO_PLAN : BASIC_PLAN;
    set({ selectedPlan: plan });
  },

  setBillingCycle: (cycle) => set({ billingCycle: cycle }),

  // Store the counsel form data before launching Paystack
  preparePayment: (payload) => set({ pendingCounselPayload: payload }),

  setPaymentReference: (ref) => set({ paymentReference: ref }),

  resetPayment: () =>
    set({
      paymentReference: null,
      pendingCounselPayload: null,
      isLoading: false
    })
}));

export { BASIC_PLAN, PRO_PLAN };
