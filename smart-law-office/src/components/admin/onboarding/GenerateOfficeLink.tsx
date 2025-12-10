"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import { Check, Copy, Lock } from "lucide-react";
import React from "react";
import { Button } from "../../shared/ui/button";

const Step5GenerateOfficeLink = () => {
  const { formData, nextStep, prevStep, generateOfficeLink } =
    useFirmProfileStore();
  const [isCopied, setIsCopied] = React.useState(false);

  // Generate office link when component mounts or firmName changes
  React.useEffect(() => {
    if (formData.firmName && !formData.officeLink) {
      generateOfficeLink();
    }
  }, [formData.firmName, formData.officeLink, generateOfficeLink]);

  const handleCopy = () => {
    // Use document.execCommand('copy') for better compatibility in sandboxed environments
    try {
      const tempInput = document.createElement("input");
      tempInput.value = formData.officeLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* <Button
        variant="link"
        onClick={prevStep}
        icon={ArrowLeft}
        className="text-sm mb-4 p-0"
      >
        Back
      </Button> */}

      <div>
        <h3 className="text-lg font-semibold text-[${TEXT_COLOR}]">
          Generate your office link
        </h3>
        <p className="text-sm text-gray-500">
          This will be your unique web address for clients
        </p>
      </div>

      {/* Basic Link */}
      <div className="pt-6">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          Basic
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 px-4 py-2 bg-gray-50">
          <input
            aria-label="Office Link"
            type="text"
            readOnly
            value={formData.officeLink}
            className="w-full bg-transparent focus:outline-none text-base text-[${TEXT_COLOR}]"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`ml-2 p-1 rounded-full ${
              isCopied
                ? "text-green-500"
                : "text-gray-400 hover:text-[${PRIMARY_COLOR}]"
            }`}
          >
            {isCopied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Upgrade Link (Custom Domain) */}
      <div className="pt-6">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          Upgrade
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 px-4 py-2 bg-gray-200">
          <input
            aria-label="Upgrade Link"
            type="text"
            readOnly
            value="seredanpartners@seredanpartners.com"
            className="w-full bg-transparent focus:outline-none text-base text-gray-400"
          />
          <Lock className="w-5 h-5 text-gray-400 ml-2" />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Use your custom domain for a professional brand identity. To upgrade
          to a custom domain, please contact{" "}
          <a href="#" className="font-medium text-gray-600 hover:underline">
            Cynt law office support team
          </a>
        </p>
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

export default Step5GenerateOfficeLink;
