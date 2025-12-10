"use client";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import { Button } from "../../shared/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Input } from "../../shared/ui/input";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import React from "react";

const Step3CustomFee = () => {
  const router = useRouter();
  const {
    formData,
    updateFormData,
    SubmitCompleteSignup,
    isSubmitting,
    prevStep
  } = useFirmProfileStore();
  const { setRole } = useAuthStore();
  const { isCustomFeeEnabled, customFeeAmount } = formData;
  const signupFormTemp = useAuthStore((state) => state.signupFormTemp);
  const clearSignupFormTemp = useAuthStore((state) => state.setSignupFormTemp);

  // check if signup data exisit on mount
  React.useEffect(() => {
    if (!signupFormTemp) {
      toast.error("Session expired. Please start over");
      router.push("/signup");
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

    // Validate that we have signup data - EARLY RETURN IF NULL
    if (!signupFormTemp) {
      toast.error("Session expired. Please start over.");
      router.push("/signup");
      return;
    }

    // Validate firm profile is complete
    if (!formData.firmName || !formData.firmType) {
      toast.error("Please complete all firm profile steps");
      return;
    }

    // Validate required files
    if (!formData.logoFile) {
      toast.error("Please upload a firm logo");
      return;
    }

    if (!formData.cacFile) {
      toast.error("Please upload CAC certificate");
      return;
    }

    // DEBUG: Check what we have
    console.log("=== SIGNUP DATA CHECK ===");
    console.log("signupFormTemp:", signupFormTemp);
    console.log("formData:", formData);
    console.log("Logo File Present:", !!formData.logoFile);
    console.log("CAC File Present:", !!formData.cacFile);

    try {
      setRole("ADMIN");
      // store email before clearing
      const userEmail = signupFormTemp.email;

      // call with signupdata
      await SubmitCompleteSignup(signupFormTemp);
      toast.success("Account created Successfully! Please verify your email");

      //clear tem data
      clearSignupFormTemp(null);

      //route to verify
      router.push(`/verify?email=${encodeURIComponent(userEmail)}`);
    } catch (error: any) {
      console.error("Complete signup error:", error);

      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message;

      if (statusCode === 409 || statusCode === 400) {
        if (
          typeof errorMessage === "string" &&
          (errorMessage.toLowerCase().includes("already") ||
            errorMessage.toLowerCase().includes("exists"))
        ) {
          toast.error(
            "This email is already registered. Please sign in instead."
          );
          router.push("/login");
        } else {
          toast.error(
            Array.isArray(errorMessage) ? errorMessage.join(". ") : errorMessage
          );
        }
      } else if (statusCode === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        const displayMessage = Array.isArray(errorMessage)
          ? errorMessage.join(". ")
          : errorMessage || "Registration failed. Please try again.";
        toast.error(displayMessage);
      }
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
          <div className="pt-2 space-y-2">
            <Label
              htmlFor="customFeeAmount"
              className="text-base font-semibold text-gray-600"
            >
              Amount
            </Label>
            <div className="relative">
              <Input
                id="customFeeAmount"
                placeholder="E.g 20,000"
                value={customFeeAmount || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  const numValue = parseFloat(value) || 0;
                  updateFormData({ customFeeAmount: numValue });
                }}
                className="pr-10"
              />
              {customFeeAmount && (
                <span className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2">
                  &#8358;
                </span>
                // <DollarSign className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All other fees will be in line with the Legal Practitioners
              Remuneration Act 2023.
            </p>
          </div>
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
