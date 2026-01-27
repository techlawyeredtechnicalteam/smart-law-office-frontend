"use client";

import React from "react";
import {
  useSubscriptionStore,
  BASIC_PLAN,
  PRO_PLAN
} from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export function ManageSubscription() {
  const {
    currentSubscription,
    billingCycle,
    setBillingCycle,
    setStep,
    selectPlan
  } = useSubscriptionStore();
  const { user } = useAuthStore();

  const handleSelect = (planName: "BASIC" | "PRO") => {
    selectPlan(planName);
    setStep("review");
  };

  const plans = [BASIC_PLAN, PRO_PLAN];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subscription</h1>

        {/* Functional Billing Toggle */}
        <div className="p-1 rounded-full bg-purple-100 flex items-center">
          {(["Monthly", "Yearly"] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={cn(
                "rounded-full px-6 py-1.5 text-sm font-semibold transition-all",
                billingCycle === cycle
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-purple-400"
              )}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const isCurrent =
            user?.planType?.toUpperCase() === plan.name.toUpperCase();

          const isUpgradeOption =
            plan.name.toUpperCase() === "PRO" &&
            user?.planType?.toUpperCase() === "BASIC";

          return (
            <div
              key={plan.name}
              className={cn(
                "p-8 border-2 rounded-2xl transition-all",
                isCurrent
                  ? "border-purple-600 bg-white shadow-xl"
                  : "border-gray-100 bg-gray-50/50"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Billed {billingCycle}
                  </p>
                </div>
                {isCurrent && (
                  <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                    Active
                  </span>
                )}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black">
                  ₦{plan.monthlyPrice.toLocaleString()}
                </span>
                <span className="text-gray-500 font-medium">
                  /{plan.billingTerm}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <Check className="h-4 w-4 text-purple-600 mr-3 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() =>
                  !isCurrent &&
                  handleSelect(plan.name.toUpperCase() as "BASIC" | "PRO")
                }
                disabled={isCurrent}
                variant={isCurrent ? "outline" : "default"}
                className={cn(
                  "w-full h-12 rounded-xl font-bold transition-all",
                  isCurrent
                    ? "border-gray-200"
                    : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100"
                )}
              >
                {isCurrent
                  ? "Current Plan"
                  : isUpgradeOption
                    ? "Upgrade Now"
                    : "Switch Plan"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
