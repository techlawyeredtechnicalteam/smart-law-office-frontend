"use client";

import Step2Branding from "@/components/firmProfile/Branding";
import Step3CustomFee from "@/components/firmProfile/CustomFee";
import Step1FirmType from "@/components/firmProfile/FirmType";
import ProgressBar from "@/components/firmProfile/ProgressBar";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import { useEffect, useState } from "react";
// import { SessionManager } from "@/components/admin/onboarding/SessionManager";

const FirmProfilePage = () => {
  const step = useFirmProfileStore((state) => state.step);
  const resetProfile = useFirmProfileStore((state) => state.resetProfile);
  const formData = useFirmProfileStore((state) => state.formData);
  const totalSteps = 3;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    // If the user arrives here but 'firmName' is empty and they are on Step 1,
    // we ensure the store is in its 'initialState' just to be safe.
    if (step === 1 && !formData.firmName) {
      resetProfile();
    }
  }, []);

  if (!isMounted) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1FirmType />;
      case 2:
        return <Step2Branding />;
      case 3:
        return <Step3CustomFee />;
      default:
        return <Step1FirmType />;
    }
  };
  return (
    <>
      <div className="mb-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[${TEXT_COLOR}]">
          Create Your Law Firm Profile
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Step {step} of {totalSteps}
        </p>
        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        {renderStepContent()}
      </div>
    </>
  );
};

export default FirmProfilePage;
