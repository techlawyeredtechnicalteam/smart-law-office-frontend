// "use client";

// import React from "react";
// import { ArrowRight, CheckCircle, FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import { useSubscriptionStore } from "@/store/subscriptionStore";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";

// export function UpgradeSuccessModal() {
//   const { paymentReference, selectedSubscription, resetFlow } =
//     useSubscriptionStore();
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const handleNavigate = () => {
//     const role = user?.role; // Access the existing role (Admin remains Admin)
//     resetFlow(); // Clear payment state
//     // Route based on the role they ALREADY have
//     if (role === "ADMIN") {
//       router.replace("/admin/overview");
//     } else if (role === "CLIENT") {
//       router.replace("/client/my-case");
//     } else {
//       router.replace("/role");
//     }
//   };

//   const downloadReceipt = () => {
//     if (paymentReference) {
//       // official paystack public receipt url
//       window.open(
//         `https://dashboard.paystack.com/receipt/verify/${paymentReference}`,
//         "_blank"
//       );
//     }
//   };

//   return (
//     // The modal should appear over the previous screen (Payment Details in this case)
//     <Dialog >
//       <DialogContent className="sm:max-w-[425px] p-8 text-center">
//         <DialogHeader className="p-0 pt-4 flex flex-col items-center">
//           <div className="p-4 rounded-full bg-green-100 border-4 border-green-200">
//             <CheckCircle className="h-10 w-10 text-green-600" />
//           </div>
//           <DialogTitle className="text-xl font-bold text-gray-800 pt-4">
//             Upgrade Successful
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex flex-col items-center space-y-4 mt-2">
//           <p className="text-sm text-gray-500">
//             You have successfully upgraded to the Pro plan. Enjoy unlimited
//             access to all features.
//           </p>
//         </div>

//         {/* Action Button */}
//         <div className="w-full space-y-3 pt-6">
//           <Button
//             onClick={handleNavigate}
//             className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
//           >
//             Continue to Dashboard
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>

//           {/* Secondary Receipt Button */}
//           <Button
//             variant="outline"
//             onClick={downloadReceipt}
//             className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
//           >
//             <FileText className="mr-2 h-4 w-4" />
//             View Payment Receipt
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
