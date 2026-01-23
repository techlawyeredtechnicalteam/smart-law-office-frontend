"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Copy,
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2
} from "lucide-react";
import useConsultationStore from "@/store/consultationStore";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "sonner";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import { useBillingStore } from "@/store/setRateBill";

export function PaymentVerification() {
  const {
    formData,
    setStep,
    submitConsultation,
    setFormData,
    isLoading: isStoreLoading
  } = useConsultationStore();
  const { formData: firmProfile, fetchProfile } = useFirmProfileStore();
  const [receipt, setReceipt] = useState<string>("");

  // 1. Initialize bank profile if missing
  React.useEffect(() => {
    if (!firmProfile.bankAccountNumber) {
      fetchProfile();
    }
  }, [firmProfile.bankAccountNumber, fetchProfile]);

  const totalAmount = formData?.feeDetails?.rate || 0;

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
  };

  const handleSubmit = async () => {
    // Validation
    const receipt = formData?.paymentReceipt;
    if (!receipt) {
      toast.error("Please upload your payment receipt before proceeding.");
      return;
    }

    try {
      // The store handles the API call, mapping, and step transition to "success"
      await submitConsultation();
      toast.success("Consultation booked successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Confirm Payment</h2>
        <p className="text-sm text-gray-500">
          Transfer{" "}
          <span className="font-bold text-[#6f42c1]">
            ₦{totalAmount.toLocaleString()}
          </span>{" "}
          to Firm account
        </p>
      </div>

      <Card className="p-5 border-dashed border-2 bg-purple-50/30 border-purple-100">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-gray-500 font-bold">
              Bank
            </span>
            <span className="font-medium">
              {firmProfile.bankName || "Loading..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase text-gray-500 font-bold">
              Account Name
            </span>
            <span className="font-medium text-right uppercase text-xs w-2/3">
              {firmProfile.bankAccountName || "Loading..."}
            </span>
          </div>
          <div className="pt-2 border-t border-purple-100 flex justify-between items-center">
            <div>
              <span className="text-xs uppercase text-gray-500 font-bold">
                Account Number
              </span>
              <p className="text-xl font-mono font-bold text-[#6f42c1]">
                {firmProfile.bankAccountNumber || "----------"}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-purple-200 text-[#6f42c1]"
              onClick={() => handleCopy(firmProfile.bankAccountNumber)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <UploadCloud className="h-4 w-4 text-[#6f42c1]" />
          Upload Payment Receipt
        </label>
        <FileUpload
          id="receipt-upload"
          label="Upload receipt (PDF, JPG, PNG)"
          fileData={formData?.paymentReceipt || ""}
          onFileChange={(data) => {
            // 4. FIX: Update the store so the button unlocks
            setFormData({ paymentReceipt: data || "" });
          }}
          accept=".pdf,.jpg,.png,.jpeg"
        />
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!formData?.paymentReceipt || isStoreLoading}
          className="w-full bg-[#6f42c1] hover:bg-[#5a369e] h-14 text-lg font-bold shadow-lg shadow-purple-100"
        >
          {isStoreLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            "I have made payment"
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStep("summary")}
          disabled={isStoreLoading}
          className="text-gray-400"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
