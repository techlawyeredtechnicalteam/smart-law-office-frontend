// "use client";

// // import React, { useMemo } from "react";
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

//   const subtotal = 15000;

//   return (
//     <div className="max-w-6xl mx-auto h-fit">
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

//       {/* Current Plan Row */}
//       <div className="flex justify-between items-center p-3 bg-white border rounded-xl shadow-sm">
//         <span className="text-slate-500 font-medium">Current Plan</span>
//         <span className="font-bold text-slate-900">
//           {currentSubscription.name}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
//         {/* Upgrade Detail Box */}
//         <div className="lg:col-span-2 border-2 border-purple-200 rounded-2xl overflow-hidden bg-white shadow-sm">
//           {/* Upgrade Header */}
//           <div className="flex justify-between items-center px-6 py-4 border-b border-purple-100 bg-purple-50/30">
//             <span className="text-purple-500 font-semibold uppercase tracking-wider text-sm">
//               Upgrade
//             </span>
//             <span className="text-purple-600 font-bold text-lg">
//               {selectedSubscription.name}
//             </span>
//           </div>

//           {/* Details Grid */}
//           <div className="p-6 space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="font-bold text-slate-800 text-lg">Name</span>
//               <span className="font-bold text-slate-800 text-lg">Access</span>
//             </div>

//             <div className="flex justify-between items-center border-b pb-6 border-slate-100">
//               <span className="text-slate-600 font-medium">
//                 {user?.email || "christineadeola@gmail.com"}
//               </span>
//               <span className="font-bold text-slate-900">Full</span>
//             </div>

//             <div className="flex justify-between items-center pt-2">
//               <span className="text-slate-800 font-semibold text-lg">
//                 Subtotal
//               </span>
//               <div className="text-right">
//                 <span className="font-black text-slate-900 text-xl">
//                   ₦ {subtotal.toLocaleString()}
//                 </span>
//                 <span className="text-slate-500 font-medium text-lg">
//                   /per Counsel
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         Left Side: Summary
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
//         </div> */}

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
//                 {cycle} {cycle === "Yearly"}
//                 {/* && (
//                   <span className="text-[10px] text-green-600">-20%</span>
//                 ) */}
//               </button>
//             ))}
//           </div>

//           <div className="p-6 bg-purple-50 border-2 border-purple-100 rounded-2xl shadow-sm">
//             <h2 className="text-xl font-black">{selectedSubscription.name}</h2>
//             <div className="mt-4 flex items-baseline">
//               <span className="text-4xl font-black">
//                 ₦{subtotal.toLocaleString()}
//               </span>
//               <span className="text-gray-500 ml-1">/month</span>
//             </div>

//             {/* {subtotal.savings && (
//               <p className="text-xs font-bold text-green-600 mt-1 uppercase">
//                 Save ₦{subtotal.savings.toLocaleString()} / year
//               </p>
//             )} */}

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
//                 Upgrade Now
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
