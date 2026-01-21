"use client";

import React, { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { CheckCircle2, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function VerificationStep() {
  const router = useRouter();
  const { setStep, selectedSubscription, resetFlow } = useSubscriptionStore();
  const [progress, setProgress] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Incrementing slightly faster for a snappy feel
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Small delay to make the "100%" feel real before showing success
      const timeout = setTimeout(() => {
        setIsConfirmed(true);
        // We trigger the 'success' state in the store for background logic
        setStep("success");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, setStep]);

  const handleFinalize = () => {
    resetFlow();
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        {!isConfirmed ? (
          <>
            <Loader2 className="h-20 w-20 animate-spin text-purple-600 stroke-[1.5]" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-700">
              {progress}%
            </span>
          </>
        ) : (
          <div className="animate-in zoom-in duration-300">
            <CheckCircle2 className="h-20 w-20 text-green-500 fill-green-50 stroke-[1.5]" />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {isConfirmed ? "Subscription Activated!" : "Securing your Subscription"}
      </h2>

      <p className="text-sm text-gray-500 mt-3 max-w-sm leading-relaxed">
        {isConfirmed
          ? `Welcome to the ${selectedSubscription.name} plan. Your premium features are now unlocked and ready to use.`
          : `We are finalizing your access to the ${selectedSubscription.name} features. Please don't refresh the page.`}
      </p>

      {isConfirmed && (
        <div className="mt-10 animate-in slide-in-from-bottom-4 duration-500">
          <Button
            onClick={handleFinalize}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-105"
          >
            Go to Dashboard
          </Button>
          <p className="mt-4 text-xs text-gray-400">
            A receipt has been sent to your email.
          </p>
        </div>
      )}
    </div>
  );
}
