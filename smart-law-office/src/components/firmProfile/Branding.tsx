"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Check } from "lucide-react";
import FileUpload from "../shared/FileUpload";
import { toast } from "sonner";

const Step2Branding = () => {
  const { formData, updateFormData, nextStep, prevStep, setFile } =
    useFirmProfileStore();
  const availableColors = React.useMemo(
    () => ["#0A84FF", "#FFD433", "#4CAF50", "#000000", "#7c3AED"],
    []
  );

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
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-600">
          Select Brand Colour
        </h3>
        <div className="flex space-x-3">
          {availableColors.map((color) => (
            <div
              key={color}
              style={{ backgroundColor: color }}
              className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center
                                ${
                                  formData.brandColor === color
                                    ? "ring-4 ring-offset-2 ring-gray-300"
                                    : "hover:ring-2 hover:ring-gray-300"
                                }`}
              onClick={() => updateFormData({ brandColor: color })}
            >
              {formData.brandColor === color && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
          ))}
          {/* Add Custom Color Button */}
          <div
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 hover:border-gray-600 transition-colors"
            onClick={() =>
              toast.info(
                "Custom color picker feature is not implemented in this demo."
              )
            }
          >
            +
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Selected Color:{" "}
          <span className={`${formData.brandColor}`}>
            {formData.brandColor}
          </span>
        </p>
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
