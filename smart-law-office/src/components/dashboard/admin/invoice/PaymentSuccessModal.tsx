"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useInvoiceStore } from "@/store/invoiceStore";

export function PaymentSuccessModal() {
  const { step, setStep, finalizeInvoice } = useInvoiceStore();
  const isOpen = step === "success";

  const handleViewHistory = () => {    
    finalizeInvoice();
    setStep("dashboard");
  };

  const handleBack = () => {    
    finalizeInvoice();    
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[400px] p-8 text-center">
        <DialogHeader className="p-0 pt-4 flex flex-col items-center">
          <div className="p-4 rounded-full bg-green-100 border-4 border-green-200">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 pt-4">
            Payment Successful
          </h2>
        </DialogHeader>

        <p className="text-sm text-gray-500 mt-2">
          Your transaction was successful. A confirmation has been sent to your
          email.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="text-gray-700"
          >
            Back
          </Button>
          <Button
            onClick={handleViewHistory}
            className="bg-purple-600 hover:bg-purple-700"
          >
            View History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
