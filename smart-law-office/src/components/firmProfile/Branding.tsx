"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Check } from "lucide-react";
import FileUpload from "../shared/FileUpload";
import { toast } from "sonner";

const Step2Branding = () => {
  // ✅ 1. Use Selectors to get exactly what we need
  const formData = useFirmProfileStore((state) => state.formData);
  const updateFormData = useFirmProfileStore((state) => state.updateFormData);
  const nextStep = useFirmProfileStore((state) => state.nextStep);
  const prevStep = useFirmProfileStore((state) => state.prevStep);
  const setFile = useFirmProfileStore((state) => state.setFile);

  // ✅ 2. Define the missing colors array (renamed from 'presets' to 'availableColors' to match your JSX)
  const availableColors = [
    "#7C3AED", // Violet
    "#2563EB", // Blue
    "#059669", // Green
    "#DC2626", // Red
    "#D97706", // Amber
    "#000000" // Black
  ];

  const isComplete = formData.logoFile && formData.cacFile;

  const handleLogoChange = (
    fileData: string | null,
    fileName: string | null
  ) => {
    // Call setFile with correct parameters: (field, fileData, fileName)
    setFile("logoFile", fileData, fileName);

    if (fileData) {
      toast.success("Logo uploaded successfully");
    }
  };

  // Handle CAC file change
  const handleCacChange = (
    fileData: string | null,
    fileName: string | null
  ) => {
    // Call setFile with correct parameters: (field, fileData, fileName)
    setFile("cacFile", fileData, fileName);

    if (fileData) {
      toast.success("CAC certificate uploaded successfully");
    }
  };

  return (
    <div className="space-y-2">
      <Button variant="link" onClick={prevStep} className="text-sm mb-4 p-0">
        <ArrowLeft />
        Back
      </Button>

      {/* Logo Upload */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-600">Logo</h3>
        <FileUpload
          id="logo-upload"
          label="Firm Logo"
          fileData={formData.logoFile}
          fileName={formData.logoFileName}
          onFileChange={handleLogoChange}
          accept="image/*"
          maxSize={5}
          fileTypeInfo="PNG, JPG. Max 5MB"
        />
      </div>

      {/* Brand Color Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">
          Select Brand Colour
        </h3>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color) => (
            <div
              key={color}
              style={{ backgroundColor: color }}
              className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center
                ${
                  formData.brandColor === color
                    ? "ring-4 ring-offset-2 ring-violet-200 scale-110"
                    : "hover:scale-105 border border-gray-100"
                }`}
              onClick={() => updateFormData({ brandColor: color })}
            >
              {formData.brandColor === color && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
          ))}

          {/* Custom Color Input - simplified for better UX */}
          <div className="relative w-10 h-10">
            <input
              aria-label="Color Input"
              type="color"
              value={formData.brandColor}
              onChange={(e) => updateFormData({ brandColor: e.target.value })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              +
            </div>
          </div>
        </div>
      </div>

      {/* CAC upload  */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-600">Upload CAC</h3>
        <FileUpload
          id="cac-upload"
          label="CAC Certificate"
          fileData={formData.cacFile}
          fileName={formData.cacFileName}
          onFileChange={handleCacChange}
          accept="application/pdf"
          maxSize={5}
          fileTypeInfo="PDF only. Max 5MB"
        />
      </div>

      <Button onClick={nextStep} className="w-full mt-6" disabled={!isComplete}>
        Continue
      </Button>
      <div className="text-sm text-center">
        <Button variant="link">Contact Support</Button>
      </div>
    </div>
  );
};

export default Step2Branding;
