"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Clock, Info, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import useConsultationStore from "@/store/consultationStore";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import React from "react";

const NairaSymbol = ({ className = "" }) => (
  <span className={cn("font-medium text-lg align-top", className)}>₦</span>
);

export function ConsultationSummary() {
  const { formData, setStep, resetBooking } = useConsultationStore();
  const firmProfile = useFirmProfileStore((state) => state.formData);

  const feeDetails = formData?.feeDetails;

  const formattedDate = React.useMemo(() => {
    if (!formData?.date) return "N/A";
    try {
      return format(new Date(formData.date), "MMM dd, yyyy");
    } catch (e) {
      return "Invalid Date";
    }
  }, [formData?.date]);

  const formattedTime = formData?.time || "N/A";

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-purple-200">
            <User className="h-5 w-5 text-[#6f42c1]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
              Selected Service
            </p>
            <p className="font-semibold text-gray-800">
              {feeDetails
                ? `${feeDetails.consultType} (${feeDetails.duration} mins)`
                : "Loading..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Date
            </p>
            <p className="text-sm font-medium text-gray-700">{formattedDate}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Time
            </p>
            <p className="text-sm font-medium text-gray-700">{formattedTime}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <p className="text-sm font-semibold text-gray-700">
            Consultation Fee
          </p>
          <p className="text-2xl font-bold text-[#6f42c1]">
            <NairaSymbol className="mr-1" />
            {(feeDetails?.rate || 0).toLocaleString()}
          </p>
        </div>

        {formData?.note && (
          <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center">
              <Info className="h-3 w-3 mr-1" /> Client Note
            </p>
            <p className="text-xs text-gray-600 italic line-clamp-3">
              "{formData.note}"
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="bg-[#6f42c1] text-white p-5 rounded-2xl shadow-lg">
          <p className="text-xs opacity-80 uppercase">{firmProfile.bankName}</p>
          <p className="text-xl font-normal tracking-wider">
            {firmProfile.bankAccountNumber}
          </p>
          <p className="text-sm uppercase">{firmProfile.bankAccountName}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          onClick={() => setStep("payment")}
          disabled={!feeDetails || !firmProfile?.bankAccountNumber}
          className="w-full bg-[#6f42c1] hover:bg-[#5a369e] py-6 text-base font-semibold"
        >
          Proceed to Upload Receipt
        </Button>
        <Button
          variant="ghost"
          onClick={resetBooking}
          className="text-gray-500"
        >
          Cancel and Exit
        </Button>
      </div>
    </div>
  );
}
