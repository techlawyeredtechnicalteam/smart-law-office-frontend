// "use client";

// import React, { useState, useMemo } from "react";
// import { useSubscriptionStore } from "@/store/subscriptionStore";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Check, CheckCircle2, Loader2 } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useAuthStore } from "@/store/authStore";
// import { toast } from "sonner";
// import { usePaystackPayment } from "react-paystack";

// export function PaymentSummary() {
//   const { user } = useAuthStore();
//   const {
//     selectedSubscription,
//     billingCycle,
//     setStep,
//     setIsLoading,
//     isLoading,
//     setPaymentReference
//   } = useSubscriptionStore();
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // calculate amount in Kobo
//   const paymentDetails = useMemo(() => {
//     const isYearly = billingCycle === "Yearly";
//     const multiplier = isYearly ? 12 : 1;
//     const discount = isYearly ? 0.8 : 1; // 20% discount
//     const rawAmount = selectedSubscription.monthlyPrice * multiplier * discount;

//     return {
//       totalAmountNaira: rawAmount,
//       totalAmountKobo: rawAmount,
//       discountApplied: isYearly ? "20% Yearly Discount" : null
//     };
//   }, [selectedSubscription, billingCycle]);

//   // Payment Configuration
//   const buildConfig = () => {
//     const userId = user?.id ?? "";
//     if (!userId || !selectedSubscription?.name) {
//       toast.error("Missing user or plan. Please try again.");
//       return null;
//     }
//     return {
//       email: user?.email ?? "",
//       amount: paymentDetails.totalAmountKobo,
//       publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
//       metadata: {
//         custom_fields: [],
//         userId,
//         planName: selectedSubscription.name,
//         billingCycle
//       }
//     };
//   };
//   const handlePayment = () => {
//     if (!isAgreed) return;
//     const cfg = buildConfig();
//     if (!cfg) return;

//     setIsLoading(true);
//     const initializePayment = usePaystackPayment(cfg);

//     const onSuccess = (response: any) => {
//       setIsLoading(false);
//       setPaymentReference(response.reference);

//       // syncUser({
//       //   subscriptionStatus: "ACTIVE",
//       //   planType: selectedSubscription.name.toUpperCase() as any
//       // });
//       useAuthStore.getState().syncUser({
//         subscriptionStatus: "ACTIVE",
//         planType: selectedSubscription.name.toUpperCase() as "PRO" | "BASIC"
//       });

//       // setShowSuccess(true);

//       // toast.success("Payment initiated! We're updating your account...");
//       setStep("verify");
//     };
//     initializePayment({ onSuccess });
//   };

//   // SUCCESS VIEW
//   if (showSuccess) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
//           <CheckCircle2 className="w-12 h-12 text-green-600" />
//         </div>
//         <h2 className="text-3xl font-bold mb-2">Payment Confirmed!</h2>
//         <p className="text-gray-500 mb-8">
//           Your account has been upgraded to {selectedSubscription.name}.
//         </p>
//         <Button
//           onClick={() => setStep("manage")}
//           className="bg-purple-600 px-10"
//         >
//           Go to Dashboard
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex items-center space-x-4 pb-4 mb-6">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setStep("review")}
//           aria-label="Go back"
//         >
//           <ArrowLeft className="h-6 w-6 text-gray-600" />
//         </Button>
//         <h1 className="text-xl font-bold">Enter Your Payment Details</h1>
//       </div>

//       <div className="grid md:grid-cols-2 gap-10">
//         {/* Order Info */}
//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-xl border shadow-sm">
//             <h2 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">
//               Plan Summary
//             </h2>
//             <div className="mt-4 flex justify-between items-end">
//               <div>
//                 <p className="text-xl font-bold">{selectedSubscription.name}</p>
//                 <p className="text-sm text-gray-500">{billingCycle} Billing</p>
//               </div>
//               <p className="text-2xl font-black text-purple-600">
//                 ₦{paymentDetails.totalAmountNaira.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start space-x-3">
//             <Checkbox
//               id="terms"
//               checked={isAgreed}
//               onCheckedChange={(v) => setIsAgreed(!!v)}
//             />
//             <label
//               htmlFor="terms"
//               className="text-sm text-gray-600 leading-tight"
//             >
//               I authorize the charge of ₦
//               {paymentDetails.totalAmountNaira.toLocaleString()} and agree to
//               the Terms of Service.
//             </label>
//           </div>
//         </div>

//         {/* Right Side: Plan Details Summary (Repeated) */}
//         <div className="col-span-1 p-6 bg-purple-50 border border-purple-200 rounded-lg space-y-4 h-fit shadow-sm">
//           <div className="flex justify-end mb-4">
//             <div className="p-1 rounded-full bg-purple-100 flex space-x-1">
//               <Button
//                 variant="ghost"
//                 className="rounded-full bg-white shadow-sm text-purple-600 font-semibold h-9 px-4"
//               >
//                 Monthly
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="rounded-full text-gray-600 font-semibold h-9 px-4"
//               >
//                 Yearly
//               </Button>
//             </div>
//           </div>

//           <h2 className="text-xl font-bold">{selectedSubscription.name}</h2>
//           <p className="mt-1 text-sm text-gray-500">Billed monthly</p>
//           <p className="text-3xl font-extrabold text-gray-900">
//             ₦{selectedSubscription.monthlyPrice.toLocaleString()}{" "}
//             <span className="text-base font-medium text-gray-500">/seat</span>
//           </p>

//           <ul className="mt-4 space-y-3 text-sm text-gray-700">
//             {selectedSubscription.features.map((feature, index) => (
//               <li key={index} className="flex items-start">
//                 <Check className="h-5 w-5 text-purple-600 mr-2 shrink-0" />
//                 {feature}
//               </li>
//             ))}
//           </ul>

//           {/* Auto-renew Text */}
//           <p className="text-sm text-gray-500 pt-4">
//             Your Subscription will automatically renew each month.
//           </p>

//           <div className="pt-4">
//             <Button
//               size="lg"
//               className="w-full bg-purple-600 hover:bg-purple-700 h-14 text-lg"
//               disabled={!isAgreed || isLoading}
//               onClick={handlePayment}
//             >
//               {isLoading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 `Pay ₦${paymentDetails.totalAmountNaira.toLocaleString()}`
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
