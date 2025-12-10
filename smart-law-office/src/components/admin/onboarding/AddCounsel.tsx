"use client";

import { useFirmProfileStore } from "@/store/firmProfileStore";
import { Button } from "../../shared/ui/button";
import { Check, Trash2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../shared/ui/input";
import FileUpload from "./FileUpload";

const Step4Counsel = () => {
  const { formData, updateCounsel, removeCounsel, nextStep } =
    useFirmProfileStore();
  const maxCounsel = 20;

  const isComplete = formData.counsel.every(
    (c) => c.fullName && c.scn && c.callToBarFile
  );

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
          Add Counsel
        </h3>
        <p className="text-sm text-gray-500">
          Counsel Added: {formData.counsel.length}/{maxCounsel}
        </p>
      </div>

      {formData.counsel.map((counsel, index) => (
        <div
          key={counsel.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-violet-600">
              Counsel #{index + 1}
            </h4>
            {formData.counsel.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCounsel(counsel.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor={`counsel-name-${counsel.id}`}>Full name</Label>
            <div className="relative">
              <Input
                id={`counsel-name-${counsel.id}`}
                placeholder="Enter full name"
                value={counsel.fullName}
                onChange={(e) =>
                  updateCounsel(counsel.id, "fullName", e.target.value)
                }
                className="pr-10"
              />
              {counsel.fullName && (
                <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>

          {/* SCN */}
          <div className="space-y-2">
            <Label htmlFor={`counsel-scn-${counsel.id}`}>SCN</Label>
            <div className="relative">
              <Input
                id={`counsel-scn-${counsel.id}`}
                placeholder="Enter SCN"
                value={counsel.scn}
                onChange={(e) =>
                  updateCounsel(counsel.id, "scn", e.target.value)
                }
                className="pr-10"
              />
              {counsel.scn && (
                <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>

          {/* Call to Bar Certificate */}
          <FileUpload
            id={`bar-cert-${counsel.id}`}
            label="Call to Bar Certificate"
            file={counsel.callToBarFile}
            onFileChange={(file) =>
              updateCounsel(counsel.id, "callToBarFile", file)
            }
          />
        </div>
      ))}

      {/* Form to Add New Counsel */}
      <Button
        onClick={() => alert("Add Counsel modal will open here.")}
        variant="outline"
        className="w-full"
        disabled={formData.counsel.length >= maxCounsel}
      >
        + Add Counsel
      </Button>

      <Button onClick={nextStep} className="w-full mt-6" disabled={!isComplete}>
        Continue
      </Button>
      <div className="text-sm text-center">
        <Button variant="link">Contact Support</Button>
      </div>
    </div>
  );
};

export default Step4Counsel;
