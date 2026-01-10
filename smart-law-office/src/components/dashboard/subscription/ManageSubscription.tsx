// "use client";

// import React from "react";
// import {
//   useSubscriptionStore,
//   BASIC_PLAN,
//   PRO_PLAN
// } from "@/store/subscriptionStore";
// import { PlanType } from "@/types/Subscription.schema";
// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";

// // Helper function to render a plan card
// const PlanCard = ({
//   plan,
//   isCurrent,
//   isUpgrade,
//   onClickAction
// }: {
//   plan: typeof BASIC_PLAN | typeof PRO_PLAN;
//   isCurrent: boolean;
//   isUpgrade: boolean;
//   onClickAction?: () => void;
// }) => (
//   <div
//     className={`p-6 border rounded-lg shadow-sm ${
//       isCurrent
//         ? "border-purple-600 bg-white shadow-lg"
//         : "bg-purple-50 border-purple-200"
//     }`}
//   >
//     <h3 className="text-xl font-bold">{plan.name}</h3>
//     <p className="mt-1 text-sm text-gray-500">Billed monthly</p>
//     <p className="mt-2 text-3xl font-extrabold text-gray-900">
//       ₦{plan.monthlyPrice.toLocaleString()}{" "}
//       <span className="text-base font-medium text-gray-500">
//         /{plan.billingTerm}
//       </span>
//     </p>

//     <p className="mt-4 text-sm font-semibold mb-3">
//       Each user gets full access to:
//     </p>
//     <ul className="mt-0 space-y-3 text-sm text-gray-700">
//       {plan.features.map((feature, index) => (
//         <li key={index} className="flex items-start">
//           <Check className="h-5 w-5 text-purple-600 mr-2 shrink-0" />
//           {feature}
//         </li>
//       ))}
//     </ul>

//     <div className="mt-6">
//       {isCurrent ? (
//         <Button variant="outline" className="w-full" disabled>
//           Current Plan
//         </Button>
//       ) : (
//         <Button
//           className={cn(
//             "w-full",
//             isUpgrade
//               ? "bg-purple-600 hover:bg-purple-700"
//               : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//           )}
//           onClick={onClickAction}
//         >
//           {isUpgrade ? "Upgrade" : "Manage Subscription"}
//         </Button>
//       )}
//     </div>
//   </div>
// );

// export function ManageSubscription() {
//   const { currentSubscription, setStep, selectPlan, setBillingCycle } =
//     useSubscriptionStore();
//   const isBasic = currentSubscription.name === "Basic";

//   // Determine the plan to show for upgrade based on the current plan
//   const upgradePlan = isBasic ? PRO_PLAN : BASIC_PLAN;

//   const handleUpgrade = (planName: PlanType) => {
//     selectPlan(planName);
//     setBillingCycle("Monthly"); // Reset to Monthly by default
//     setStep("review"); // Go to plan review details
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-8">Subscription</h1>

//       {/* Monthly/Yearly toggle - styled to match the image */}
//       <div className="flex justify-end mb-6">
//         <div className="p-1 rounded-full bg-purple-100 flex space-x-1">
//           <Button
//             variant="ghost"
//             className="rounded-full bg-white shadow-sm text-purple-600 font-semibold h-9 px-4"
//           >
//             Monthly
//           </Button>
//           <Button
//             variant="ghost"
//             className="rounded-full text-gray-600 font-semibold h-9 px-4"
//           >
//             Yearly
//           </Button>
//         </div>
//       </div>

//       {/* Plan Cards - based on subscribe.png */}
//       <div className="grid grid-cols-2 gap-8">
//         {/* Basic Plan */}
//         <PlanCard
//           plan={BASIC_PLAN}
//           isCurrent={isBasic}
//           isUpgrade={!isBasic}
//           onClickAction={() => handleUpgrade("Basic")}
//         />

//         {/* Pro Plan */}
//         <PlanCard
//           plan={PRO_PLAN}
//           isCurrent={!isBasic}
//           isUpgrade={isBasic}
//           onClickAction={() => handleUpgrade("Pro")}
//         />
//       </div>

//       {/* If the current plan is Basic, we show Upgrade on Pro.
//                 If the current plan is Pro, we show Manage Subscription on Basic (Downgrade or other actions).
//                 The image 'subscribe2.png' shows the Pro plan is current. We handle both states here.
//             */}
//     </div>
//   );
// }

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

export function ManageSubscription() {
  const {
    currentSubscription,
    billingCycle,
    setBillingCycle,
    setStep,
    selectPlan
  } = useSubscriptionStore();

  const handleSelect = (planName: "Basic" | "Pro") => {
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
          const isCurrent = currentSubscription.name === plan.name;
          // Only show 'Upgrade' if moving from Basic to Pro
          const isUpgrade =
            plan.name === "Pro" && currentSubscription.name === "Basic";

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
                  !isCurrent && handleSelect(plan.name as "Basic" | "Pro")
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
                  : isUpgrade
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
