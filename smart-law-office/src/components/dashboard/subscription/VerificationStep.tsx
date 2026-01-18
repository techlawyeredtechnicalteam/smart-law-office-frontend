"use client";

import React, { useEffect, useState } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export function VerificationStep() {
  const { setStep, selectedSubscription } = useSubscriptionStore();
  // const { user } = useAuthStore();
  // const role = user?.role
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // monitor the user object.
  useEffect(() => {
    if (progress === 100) {
      // 2. Once the 'fake' verification is done, we move to success.
      // We don't change the role here because the user is already ADMIN/STAFF
      setStep("success");
    }
  }, [progress, setStep]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {progress}%
        </span>
      </div>
      <h2 className="text-xl font-bold">Securing your Subscription</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-xs">
        We are finalizing your access to the {selectedSubscription.name}{" "}
        features. Please don't refresh the page.......
      </p>
    </div>
  );
}
