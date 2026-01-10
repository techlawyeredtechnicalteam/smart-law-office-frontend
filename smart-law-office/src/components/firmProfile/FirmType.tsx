"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import { Check } from "lucide-react";
import React, { useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";

interface FirmTypeProps {
  label: string;
  range: string;
}

const Step1FirmType = () => {
  const { formData, updateFormData, nextStep } = useFirmProfileStore();

  const firmTypes = useMemo(
    () => [
      { label: "Solo practice", range: "1 attorney" },
      { label: "Small Firm", range: "2-10 attorneys" },
      { label: "Medium Firm", range: "11-50 attorneys" },
      { label: "Large Firm", range: "50+ attorneys" }
    ],
    []
  );

  const selectedType = formData.firmType;

  const FirmTypeCard: React.FC<FirmTypeProps> = ({ label, range }) => {
    const fullLabel = `${label} (${range})`;
    const isSelected = selectedType === fullLabel;

    return (
      <div
        onClick={() => updateFormData({ firmType: fullLabel })}
        className={`flex justify-between items-center p-2 rounded-lg border cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? "border-violet-600 bg-gray-50 shadow-md"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
      >
        <div>
          <p className="font-medium ">{label}</p>
          <p className="text-sm text-gray-500">{range}</p>
        </div>
        {isSelected && <Check className="w-5 h-5 text-green-600" />}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Name of Law Firm Input */}
      <div className="space-y-2">
        <Label
          htmlFor="firmName"
          className="text-base font-semibold text-gray-600 mb-8"
        >
          Name of Law Firm
        </Label>
        <div className="relative">
          <Input
            id="firmName"
            placeholder="e.g. Smart Law Office"
            value={formData.firmName}
            onChange={(e) => updateFormData({ firmName: e.target.value })}
            className="pr-10"
          />
          {formData.firmName && (
            <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-600">
          Type of Law Firm
        </h3>
        {firmTypes.map((type, index) => (
          <FirmTypeCard key={index} label={type.label} range={type.range} />
        ))}
      </div>

      <Button onClick={nextStep} className="w-full mt-6">
        Continue
      </Button>
      <div className="text-sm text-center">
        <Button variant="link">Contact Support</Button>
      </div>
    </div>
  );
};

export default Step1FirmType;
