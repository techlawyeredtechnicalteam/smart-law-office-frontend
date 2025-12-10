"use client";

import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 4
}) => {
  // calculate the position of the indicator based on current step
  const indicatorPosition = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // clamp the position between 0 and 100
  const clampedPosition = Math.max(0, Math.min(100, indicatorPosition));

  return (
    <div className="relative w-full h-2 bg-gray-300 rounded-full mt-4 mb-8">
      {/* Progress fill */}
      <div
        className={`absolute h-full rounded-full transition-all duration-500 ease-out ${
          clampedPosition ? "bg-violet-600" : "bg-black"
        }`}
      />

      {/* Animated handle/slider */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg transition-all duration-500 ease-out"
        style={{
          left: `calc(${clampedPosition}% - 0.5rem)`, // Center the handle
          border: "3px solid #7c3AED"
        }}
      />
    </div>
  );
};

export default ProgressBar;
