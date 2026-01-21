"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { ManageSubscription } from "@/components/dashboard/subscription/ManageSubscription";
import { ReviewPlanDetails } from "@/components/dashboard/subscription/ReviewPlanDetails";
import { PaymentSummary } from "@/components/dashboard/subscription/PaymentSummary";
import { VerificationStep } from "@/components/dashboard/subscription/VerificationStep";
import { Loader2 } from "lucide-react";

// Export as a named or default export to be picked up by dynamic()
export default function SubscriptionContent() {
  const { step } = useSubscriptionStore();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {(() => {
          switch (step) {
            case "manage":
              return <ManageSubscription />;
            case "review":
              return <ReviewPlanDetails />;
            case "payment":
              return <PaymentSummary />;
            case "verify":
            case "success":
              return <VerificationStep />;
            default:
              return (
                <div className="flex justify-center p-20">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                </div>
              );
          }
        })()}
      </div>
    </main>
  );
}
