"use client";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { ManageSubscription } from "@/components/dashboard/subscription/ManageSubscription";
import { ReviewPlanDetails } from "@/components/dashboard/subscription/ReviewPlanDetails";
import { SubscriptionPayment } from "@/components/dashboard/subscription/SubscriptionPayment";
import { PaymentSummary } from "@/components/dashboard/subscription/PaymentSummary";
import { VerificationStep } from "@/components/dashboard/subscription/VerificationStep";
import { UpgradeSuccessModal } from "@/components/dashboard/subscription/UpgradeSuccessModal";

export default function SubscriptionPage() {
  const { step } = useSubscriptionStore();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Step-based Content Switcher */}
        {(() => {
          switch (step) {
            case "manage":
              return <ManageSubscription />;
            // return <div className="p-10 text-center">Plan Selection Component</div>;
            case "review":
              return <ReviewPlanDetails />;
            // return <div className="p-10 text-center">Review Plan Component</div>;
            case "payment":
              return <SubscriptionPayment />;
            case "summary":
              return <PaymentSummary />;
            case "verify":
              return <VerificationStep />;
            case "success":
              // Show the payment summary background while the success modal is open
              return <PaymentSummary />;
            default:
              return <div className="p-10 text-center">Initial State</div>;
          }
        })()}

        {/* The Success Modal stays outside the switch to overlay correctly */}
        <UpgradeSuccessModal />
      </div>
    </main>
  );
}
