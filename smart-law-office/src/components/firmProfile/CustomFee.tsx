"use client";
import { FirmProfileData, useFirmProfileStore } from "@/store/firmProfileStore";
import { Button } from "../ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";
import { validateFirmProfile, handleSignupError } from "@/utils/adminAuthUtils";
import { CustomFeeInput } from "./CustomFeeInput";
import { shallow } from "zustand/shallow";

const Step3CustomFee = () => {
  const router = useRouter();
  // ✅ FIX #1: Use the selector pattern correctly
  const formData = useFirmProfileStore((state) => state.formData);
  const updateFormData = useFirmProfileStore((state) => state.updateFormData);
  const SubmitCompleteSignup = useFirmProfileStore(
    (state) => state.SubmitCompleteSignup
  );
  const isSubmitting = useFirmProfileStore((state) => state.isSubmitting);
  const prevStep = useFirmProfileStore((state) => state.prevStep);

  // ✅ FIX #2: Use the selector pattern correctly for authStore
  const setRole = useAuthStore((state) => state.setRole);
  const signupFormTemp = useAuthStore((state) => state.signupFormTemp);
  const clearSignupFormTemp = useAuthStore((state) => state.setSignupFormTemp);

  const { isCustomFeeEnabled, customFeeAmount } = formData;

  // check if signup data exisit on mount
  React.useEffect(() => {
    if (!signupFormTemp) {
      toast.error("Session expired. Please start over");
      router.push("/admin/signup");
    }
  }, [signupFormTemp, router]);

  const handleToggle = () => {
    updateFormData({ isCustomFeeEnabled: !isCustomFeeEnabled });
  };

  const isComplete =
    !isCustomFeeEnabled ||
    (isCustomFeeEnabled && customFeeAmount !== null && customFeeAmount > 0);

  const handleCompleteSignup = async () => {
    if (!isComplete) {
      toast.error("Please complete all fields");
      return;
    }

    const validationError = validateFirmProfile(formData, signupFormTemp);
    if (validationError) {
      toast.error(validationError);
      if (validationError.includes("Session expired")) {
        router.push("/admin/signup");
      }
      return;
    }

    const userEmail = signupFormTemp!.email;

    try {
      setRole("ADMIN");
      await SubmitCompleteSignup(signupFormTemp);
      toast.success("Account created Successfully! Please verify your email");

      //clear tem data
      clearSignupFormTemp(null);

      //route to verify
      router.push(`/verify?email=${encodeURIComponent(userEmail)}&role=ADMIN`);
    } catch (error: any) {
      console.error("Complete signup error:", error);
      handleSignupError(error, router);
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="link" onClick={prevStep} className="text-sm mb-4 p-0">
        <ArrowLeft />
        Back
      </Button>

      <h3 className="text-lg font-semibold text-gray-600">
        Set a custom consultation fee
      </h3>

      {/* Toggle Switch */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Enable to set a custom consultation fee
        </p>
        <button
          type="button"
          aria-label="CustomFee Toggle"
          onClick={handleToggle}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                        ${isCustomFeeEnabled ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                            ${
                              isCustomFeeEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
          />
        </button>
      </div>

      {/* Amount Input (Conditional) */}
      {isCustomFeeEnabled && (
        <div className="pt-2">
          <CustomFeeInput
            customFeeAmount={customFeeAmount}
            updateFormData={updateFormData}
          />
        </div>
      )}

      <Button
        onClick={handleCompleteSignup}
        className="w-full mt-6"
        disabled={!isComplete || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Enter Profile"}
      </Button>
      <div className="text-sm text-center">
        <Button variant="link">Contact Support</Button>
      </div>
    </div>
  );
};

export default Step3CustomFee;
