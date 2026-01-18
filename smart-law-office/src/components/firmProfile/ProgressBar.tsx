"use client";

import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 3
}) => {
  const step = Number(currentStep);
  const total = Number(totalSteps);

  const indicatorPosition = ((step - 1) / (total - 1)) * 100;
  const clampedPosition = Math.max(0, Math.min(100, indicatorPosition));

  return (
    <div className="relative w-full h-2 bg-gray-100 rounded-full mt-4 mb-8">
      {/* Progress fill */}
      <div
        className="absolute h-full rounded-full bg-violet-600 transition-all duration-500 ease-out"
        style={{ width: `${clampedPosition}%` }} // Added this line to actually show the fill!
      />

      {/* Animated handle/slider */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 ease-out"
        style={{
          left: `calc(${clampedPosition}% - 0.625rem)`,
          border: "4px solid #7c3AED"
        }}
      />
    </div>
  );
};

export default ProgressBar;
