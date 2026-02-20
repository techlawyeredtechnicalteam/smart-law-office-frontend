"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useInvoiceStore } from "@/store/invoiceStore";

export function PaymentSuccessModal() {
  const { step, setStep, fetchInvoices } = useInvoiceStore();

  const isOpen = step === "success";

  const handleClose = async () => {
    await fetchInvoices();
    setStep("dashboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-8 text-center">
        <DialogHeader className="p-0 pt-4 flex flex-col items-center">
          <div className="p-4 rounded-full bg-green-100 border-4 border-green-200 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Payment Successful
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 mt-2">
          Your transaction was successful. The invoice has been generated and
          recorded in your billing history.
        </p>

        <div className="flex flex-col gap-3 pt-8">
          <Button
            onClick={handleClose}
            className="bg-purple-600 hover:bg-purple-700 w-full"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => setStep("form")}
            variant="outline"
            className="w-full"
          >
            Create Another Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
