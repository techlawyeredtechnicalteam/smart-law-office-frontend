"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import { Check, Info } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";

const Step1FirmType = () => {
  const firmName = useFirmProfileStore((state) => state.formData.firmName);
  const firmType = useFirmProfileStore((state) => state.formData.firmType);
  const updateFormData = useFirmProfileStore((state) => state.updateFormData);
  const nextStep = useFirmProfileStore((state) => state.nextStep);

  const firmTypes = useMemo(
    () => [
      { label: "Solo practice", capacity: "1 attorney" },
      { label: "Small Firm", capacity: "2-10 attorneys" },
      { label: "Medium Firm", capacity: "11-50 attorneys" },
      { label: "Large Firm", capacity: "50+ attorneys" }
    ],
    []
  );

  // Validation Login
  const canContinue = useMemo(() => {
    const isNameValid = firmName.trim().length >= 2;
    const isTypeValid = !!firmType;
    return isNameValid && isTypeValid;
  }, [firmName, firmType]);

  const handleTypeSelect = (label: string, capacity: string) => {
    updateFormData({ firmType: `${label} (${capacity})` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="firmName"
            className="text-sm font-bold text-gray-700 uppercase tracking-tight"
          >
            Name of Law Firm
          </Label>
          <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">
            REQUIRED
          </span>
        </div>
        <div className="relative">
          <Input
            id="firmName"
            placeholder="e.g. Smart Law Office"
            value={firmName}
            onChange={(e) => updateFormData({ firmName: e.target.value })}
            className={`pr-10 h-12 border-2 transition-all ${
              firmName.length >= 2
                ? "border-violet-200 focus:border-violet-500"
                : "focus:border-violet-500"
            }`}
          />
          {firmName.length >= 2 && (
            <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">
            Type of Law Firm
          </h3>
          <Info className="w-3 h-3 text-gray-400" />
        </div>

        <div className="grid gap-3">
          {firmTypes.map((type, index) => {
            const fullLabel = `${type.label} (${type.capacity})`;
            const isSelected = firmType === fullLabel;

            return (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => handleTypeSelect(type.label, type.capacity)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleTypeSelect(type.label, type.capacity)
                }
                className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? "border-violet-600 bg-violet-50/50 shadow-sm"
                      : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isSelected ? "text-violet-900" : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500">{type.capacity}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-violet-600 border-violet-600"
                      : "border-gray-200"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={nextStep}
          disabled={!canContinue}
          size="lg"
          className="w-full h-12 text-base font-bold transition-all bg-[#7C3AED] hover:bg-[#6D28D9] shadow-lg shadow-violet-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
          Continue to Credentials
        </Button>
      </div>
    </div>
  );
};

export default Step1FirmType;
