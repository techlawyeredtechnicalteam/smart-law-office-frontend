// src/components/subscription/PaymentSummary.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";

export function PaymentSummary() {
  const { user } = useAuthStore();
  const {
    selectedSubscription,
    billingCycle,
    setStep,
    setIsLoading,
    isLoading,
    paymentFormData,
    setPaymentReference
  } = useSubscriptionStore();
  const [isAgreed, setIsAgreed] = useState(false);

  // calculate amount in Kobo
  const paymentDetails = useMemo(() => {
    const isYearly = billingCycle === "Yearly";
    const multiplier = isYearly ? 12 : 1;
    const discount = isYearly ? 0.8 : 1; // 20% discount
    const rawAmount = selectedSubscription.monthlyPrice * multiplier * discount;

    return {
      totalAmountNaira: rawAmount,
      totalAmountKobo: rawAmount * 100,
      discountApplied: isYearly ? "20% Yearly Discount" : null
    };
  }, [selectedSubscription, billingCycle]);

  // Payment Configuration
  const config = {
    reference: `REF_${new Date().getTime()}`,
    email: user?.email || "",
    amount: paymentDetails.totalAmountKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metaData: {
      customField: [
        {
          display_name: "Subscription Plan",
          variable_name: "plan",
          value: selectedSubscription.name
        },
        { display_name: "User ID", variable_name: "userId", value: user?.id },
        { display_name: "Type", variable_name: "type", value: "subscription" }
      ],
      // adding a flat object in case backend prefers it
      userId: user?.id,
      planName: selectedSubscription.name,
      type: "subscription"
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    setIsLoading(false);
    toast.success("Payment Successful! Reference: " + reference.reference);
    setPaymentReference(reference.reference);
    setStep("verify");
  };

  const onClose = () => {
    toast.info("Payment process was not completed.");
    setIsLoading(false);
  };

  const handlePayment = () => {
    if (!user?.email) {
      toast.warning(
        "Please provide your email address to proceed with payment."
      );
      return;
    }

    setIsLoading(true);
    initializePayment({ onSuccess, onClose });
  };

  // If user navigated here directly without filling form, handle undefined
  if (!paymentFormData) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-4 pb-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("payment")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        <h1 className="text-xl font-bold">Enter Your Payment Details</h1>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Side: Payment Summary Details */}
        <div className="col-span-2 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Payment Details</h2>
          <div className="p-6 border rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Card Number</span>
              <span className="font-medium text-right">
                {paymentFormData.cardNumber}
              </span>

              <span className="text-gray-500">Expiration Date</span>
              <span className="font-medium text-right">
                {paymentFormData.cardExpiry}
              </span>

              <span className="text-gray-500">CVV</span>
              <span className="font-medium text-right">
                {paymentFormData.cvv}
              </span>
            </div>

            <div className="border-t pt-4 grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Billing Address</span>
              <span className="font-medium text-right">
                {paymentFormData.billingAddress}
              </span>

              <span className="text-gray-500">Country</span>
              <span className="font-medium text-right">
                {paymentFormData.country}
              </span>

              <span className="text-gray-500">State</span>
              <span className="font-medium text-right">
                {paymentFormData.state}
              </span>

              <span className="text-gray-500">City</span>
              <span className="font-medium text-right">
                {paymentFormData.city}
              </span>

              <span className="text-gray-500">Zip code</span>
              <span className="font-medium text-right">
                {paymentFormData.zipCode}
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setStep("payment")}
            >
              Edit Details
            </Button>
          </div>

          {/* Total Section */}
          <div className="mt-6 flex justify-between items-center text-lg font-bold p-4 border-y">
            {/* <span>Total Due Today ({paymentDetails.termDisplay})</span> */}
            <span className="text-purple-600">
              ₦{paymentDetails.totalAmountNaira.toLocaleString()}
            </span>
          </div>

          {/* Consent Form */}
          <div className="flex items-center space-x-3 mt-8">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
              className=""
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none text-gray-700"
            >
              I agree to this Legal{" "}
              <span className="text-blue-600 cursor-pointer">
                Terms of Service
              </span>
              , and{" "}
              <span className="text-blue-600 cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>
        </div>

        {/* Right Side: Plan Details Summary (Repeated) */}
        <div className="col-span-1 p-6 bg-purple-50 border border-purple-200 rounded-lg space-y-4 h-fit shadow-sm">
          <div className="flex justify-end mb-4">
            <div className="p-1 rounded-full bg-purple-100 flex space-x-1">
              <Button
                variant="ghost"
                className="rounded-full bg-white shadow-sm text-purple-600 font-semibold h-9 px-4"
              >
                Monthly
              </Button>
              <Button
                variant="ghost"
                className="rounded-full text-gray-600 font-semibold h-9 px-4"
              >
                Yearly
              </Button>
            </div>
          </div>

          <h2 className="text-xl font-bold">{selectedSubscription.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Billed monthly</p>
          <p className="text-3xl font-extrabold text-gray-900">
            ₦{selectedSubscription.monthlyPrice.toLocaleString()}{" "}
            <span className="text-base font-medium text-gray-500">/seat</span>
          </p>

          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            {selectedSubscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Auto-renew Text */}
          <p className="text-sm text-gray-500 pt-4">
            Your Subscription will automatically renew each month.
          </p>

          <div className="pt-4">
            <Button
              onClick={handlePayment}
              disabled={!isAgreed || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Upgrade"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
