"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Copy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import useConsultationStore from "@/store/consultationStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// A utility component to represent the Naira currency symbol
const NairaSymbol = ({ className = "" }) => (
  <span className={cn("font-medium text-lg align-top", className)}>₦</span>
);

export function ConsultationSummary() {
  const { formData, isBookingOpen, resetBooking, setStep } =
    useConsultationStore();

  // Ensure this component is only rendered when in the 'summary' step and data exists
  const isSummaryStep =
    isBookingOpen && useConsultationStore.getState().step === "summary";

  if (!formData) return null;

  const handlePayClick = () => {
    // 1. In a real application, you would initialize the payment transaction here
    // const { code } = await ConsultService.createConsultation(formData);

    // 2. Transition to the payment page/modal
    setStep("payment");
  };

  const formattedDate = formData.date
    ? format(formData.date, "MMM dd, yyyy")
    : "N/A";
  const formattedTime = formData.time || "N/A";

  // Fixed payment details as per book consult 3.jpg
  const PAYMENT_DETAILS = {
    bank: "UBA",
    accountName: "Smart Law Office",
    accountNumber: "3231324233"
  };

  return (
    <Dialog open={isSummaryStep} onOpenChange={resetBooking}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md p-6">
        <div className="flex flex-col items-center text-center">
          {/* Client Profile and Details Area */}
          <div className="w-full">
            {/* Profile/User Info based on the image */}
            <div className="flex items-center space-x-3 mb-4 border-b pb-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-5 w-5 text-[#6f42c1]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {formData.clientName}
                </p>
                <p className="text-sm text-gray-500">{formData.email}</p>
              </div>
            </div>

            {/* Service/Fee Details */}
            <div className="grid grid-cols-2 gap-y-2 text-left text-sm mb-6">
              <div>
                <p className="text-gray-500">Service</p>
                <p className="font-medium">Consultation</p>
              </div>
              <div>
                <p className="text-gray-500">Consultation Fee</p>
                <p className="font-medium text-[#6f42c1]">
                  <NairaSymbol className="text-lg mr-0.5" />
                  {formData.consultationFee?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-gray-500">Date and Time</p>
                <p className="font-medium">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-semibold mb-2">Notes</p>
              <p className="text-sm text-gray-600 italic">{formData.notes}</p>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="w-full text-left">
            <p className="font-bold text-lg mb-3">Payment Details</p>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {PAYMENT_DETAILS.bank}
                </span>
                <span className="text-sm text-gray-500">
                  {PAYMENT_DETAILS.accountName}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-[#6f42c1]">
                  {PAYMENT_DETAILS.accountNumber}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber)
                  }
                  aria-label="Copy account number"
                >
                  <Copy className="h-4 w-4 text-[#6f42c1]" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={resetBooking}>
            Cancel
          </Button>
          <Button
            onClick={handlePayClick}
            className="bg-[#6f42c1] hover:bg-[#5a369e]"
          >
            Pay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
