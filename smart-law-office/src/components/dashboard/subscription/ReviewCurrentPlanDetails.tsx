// "use client";

// import React, { useMemo } from "react";
// import { useSubscriptionStore } from "@/store/subscriptionStore";
// import { useAuthStore } from "@/store/authStore";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Check, TrendingUp } from "lucide-react";
// import { cn } from "@/lib/utils";

// export function ReviewPlanDetails() {
//   const { user } = useAuthStore();
//   const {
//     selectedSubscription,
//     currentSubscription,
//     billingCycle,
//     setBillingCycle,
//     setStep
//   } = useSubscriptionStore();

//   const pricing = useMemo(() => {
//     const isYearly = billingCycle === "Yearly";
//     const base = selectedSubscription.monthlyPrice;
//     const total = base * (isYearly ? 12 * 0.8 : 1); // Apply 20% discount if yearly

//     return {
//       monthlyEquivalent: isYearly ? base * 0.8 : base,
//       totalToPay: total,
//       savings: isYearly ? base * 12 * 0.2 : null
//     };
//   }, [selectedSubscription, billingCycle]);

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex items-center space-x-4 mb-8">
//         <Button variant="ghost" size="icon" onClick={() => setStep("manage")}>
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold">Review Your Plan</h1>
//           <p className="text-sm text-muted-foreground">
//             Confirm details before payment
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Side: Summary */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white border rounded-2xl p-6 space-y-4">
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-500">Account</span>
//               <span className="font-semibold">
//                 {user?.firstName} {user?.lastName}
//               </span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-500">Email</span>
//               <span className="font-semibold">{user?.email}</span>
//             </div>
//             <div className="flex justify-between py-2 border-b">
//               <span className="text-gray-500">Current Plan</span>
//               <span className="font-semibold">{currentSubscription.name}</span>
//             </div>
//             <div className="flex justify-between py-2 items-center">
//               <span className="text-gray-500">Access Level</span>
//               <div className="flex items-center text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
//                 <TrendingUp className="h-4 w-4 mr-1" />
//                 Full Firm Access
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side: Pricing Card */}
//         <div className="space-y-6">
//           {/* Toggle */}
//           <div className="bg-gray-100 p-1 rounded-xl flex">
//             {(["Monthly", "Yearly"] as const).map((cycle) => (
//               <button
//                 key={cycle}
//                 onClick={() => setBillingCycle(cycle)}
//                 className={cn(
//                   "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
//                   billingCycle === cycle
//                     ? "bg-white text-purple-600 shadow-sm"
//                     : "text-gray-500"
//                 )}
//               >
//                 {cycle}{" "}
//                 {cycle === "Yearly" && (
//                   <span className="text-[10px] text-green-600">-20%</span>
//                 )}
//               </button>
//             ))}
//           </div>

//           <div className="p-6 bg-white border-2 border-purple-100 rounded-2xl shadow-sm">
//             <h2 className="text-xl font-black">{selectedSubscription.name}</h2>
//             <div className="mt-4 flex items-baseline">
//               <span className="text-4xl font-black">
//                 ₦{pricing.monthlyEquivalent.toLocaleString()}
//               </span>
//               <span className="text-gray-500 ml-1">/month</span>
//             </div>

//             {pricing.savings && (
//               <p className="text-xs font-bold text-green-600 mt-1 uppercase">
//                 Save ₦{pricing.savings.toLocaleString()} / year
//               </p>
//             )}

//             <ul className="mt-8 space-y-4">
//               {selectedSubscription.features.map((feature, i) => (
//                 <li key={i} className="flex items-start text-sm text-gray-600">
//                   <Check className="h-4 w-4 text-purple-600 mr-3 shrink-0" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-8 space-y-3">
//               <Button
//                 className="w-full bg-purple-600 h-12 rounded-xl"
//                 onClick={() => setStep("payment")}
//               >
//                 Proceed to Checkout
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="w-full text-gray-400"
//                 onClick={() => setStep("manage")}
//               >
//                 Change Plan
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
