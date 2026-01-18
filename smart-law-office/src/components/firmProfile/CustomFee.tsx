"use client";
import { FirmProfileData, useFirmProfileStore } from "@/store/firmProfileStore";
import { Button } from "../ui/button";
import { ArrowLeft, DollarSign, Loader2 } from "lucide-react";
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

  const {
    formData,
    updateFormData,
    isSubmitting,
    prevStep,
    SubmitCompleteSignup
  } = useFirmProfileStore();
  const { signupFormTemp, clearSignupTemp } = useAuthStore();

  const { isCustomFeeEnabled, customFeeAmount } = formData;

  // Security Check: Redirect if the first page of signup is missing
  React.useEffect(() => {
    if (!signupFormTemp) {
      toast.error("Session expired. Please start over");
      router.push("/admin/signup");
    }
  }, [signupFormTemp, router]);

  const handleToggle = () => {
    updateFormData({ isCustomFeeEnabled: !isCustomFeeEnabled });
  };

  // const isComplete =
  //   !isCustomFeeEnabled ||
  //   (isCustomFeeEnabled && customFeeAmount !== null && customFeeAmount > 0);
  const isComplete =
    !isCustomFeeEnabled || (isCustomFeeEnabled && (customFeeAmount ?? 0) > 0);

  const handleCompleteSignup = async () => {
    if (!isComplete) {
      toast.error("Please provide a valid fee amount");
      return;
    }

    // move later to utility
    const validationError = validateFirmProfile(formData, signupFormTemp);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      // this handles the merge of signipFormTemp + formData internally
      await SubmitCompleteSignup(signupFormTemp);
      toast.success("Account created Successfully! Please verify your email");

      const email = signupFormTemp!.email;

      //route to verify
      router.push(`/verify?email=${encodeURIComponent(email)}&role=ADMIN`);
    } catch (error: any) {
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
      {/* <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
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
      </div> */}
      <div
        className={`p-5 rounded-xl border-2 transition-all ${
          isCustomFeeEnabled
            ? "border-violet-200 bg-violet-50/30"
            : "border-gray-100 bg-gray-50/50"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">
              Custom Consultation Fee
            </p>
            <p className="text-xs text-gray-500">
              Override the default platform fee
            </p>
          </div>
          <button
            aria-label="CustomFee Toggle"
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              isCustomFeeEnabled ? "bg-[#7C3AED]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isCustomFeeEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Amount Input (Conditional) */}
        {isCustomFeeEnabled && (
          // <div className="pt-2">
          //   <CustomFeeInput
          //     customFeeAmount={customFeeAmount}
          //     updateFormData={updateFormData}
          //   />
          // </div>
          <div className="mt-6 pt-6 border-t border-violet-100 animate-in slide-in-from-top-2">
            <CustomFeeInput
              customFeeAmount={customFeeAmount}
              updateFormData={updateFormData}
            />
          </div>
        )}
      </div>

      {/* <Button
        onClick={handleCompleteSignup}
        className="w-full mt-6"
        disabled={!isComplete || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Enter Profile"}
      </Button>
      <div className="text-sm text-center">
        <Button variant="link">Contact Support</Button>
      </div> */}
      <div className="pt-4">
        <Button
          onClick={handleCompleteSignup}
          className="w-full h-12 text-base font-bold bg-[#7C3AED] hover:bg-[#6D28D9]"
          disabled={!isComplete || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...
            </>
          ) : (
            "Complete & Sign up"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step3CustomFee;
