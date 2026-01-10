"use client";

import Step2Branding from "@/components/firmProfile/Branding";
import Step3CustomFee from "@/components/firmProfile/CustomFee";
import Step1FirmType from "@/components/firmProfile/FirmType";
import ProgressBar from "@/components/firmProfile/ProgressBar";
import { useFirmProfileStore } from "@/store/firmProfileStore";
// import { SessionManager } from "@/components/admin/onboarding/SessionManager";

const FirmProfilePage = () => {
  const { currentStep } = useFirmProfileStore();
  const totalSteps = 3;

  const renderStepContent = () => {
    switch (currentStep) {
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
          Step {currentStep} of {totalSteps}
        </p>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {renderStepContent()}
      </div>
    </>
  );
};

export default FirmProfilePage;
