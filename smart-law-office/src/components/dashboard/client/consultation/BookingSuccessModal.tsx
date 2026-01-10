"use client";

import useConsultationStore from "@/store/consultationStore";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

// Mock data for the successful booking details
const MOCK_SUCCESS_DETAILS = {
  consultationID: "2025-0012",
  platform: "Google Meet",
  paymentStatus: "Successful"
  // These date/time should ideally come from the API response but we use formData for now
};

interface BookSuccessModalProps {
  onViewConsultation: () => void;
}

export function BookingSuccessModal() {
  const { formData, isBookingOpen, resetBooking } = useConsultationStore();
  const isSuccessStep =
    isBookingOpen && useConsultationStore.getState().step === "success";

  if (!isSuccessStep) return null;

  // Formatting date/time from the form data
  const dateObj = formData?.date instanceof Date ? formData.date : new Date();
  const dateString = format(dateObj, "EEEE, MMM dd, yyyy");
  const timeString = formData?.time || "10:00 AM";
  const clientName = formData?.clientName || "N/A";

  // Note: The success image shows Friday, Nov 20, 2025 at 10:00 AM and ID 2025-0012.
  // We use the stored formData but reference the ID for realism.

  const handleViewConsultation = () => {
    resetBooking(); // Close the modal
    // Navigate the user to the details page/component
    // onViewConsultation(MOCK_SUCCESS_DETAILS.consultationID);
  };

  return (
    <Dialog open={isSuccessStep} onOpenChange={resetBooking}>
      <DialogContent className="sm:max-w-[480px] p-8 text-center">
        {/* Success Icon */}
        <DialogHeader>
          <div className="p-4 rounded-full bg-green-100 border-4 border-green-200">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Consultation Successfully Booked
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-500 max-w-[80%]">
            Your appointment is confirmed. A confirmation email has been sent to
            your email address.
          </p>
        </div>

        {/* Booking Details Table */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm mt-6 p-4 border rounded-lg bg-white">
          <div className="text-left">
            <p className="text-gray-500">Client Name</p>
            <p className="font-semibold">{clientName}</p>
          </div>
          <div className="text-left">
            <p className="text-gray-500">Date</p>
            <p className="font-semibold">{dateString}</p>
          </div>
          <div className="text-left">
            <p className="text-gray-500">Consultation ID</p>
            <p className="font-semibold text-[#6f42c1]">
              {MOCK_SUCCESS_DETAILS.consultationID}
            </p>
          </div>
          <div className="text-left">
            <p className="text-gray-500">Time</p>
            <p className="font-semibold">{timeString}</p>
          </div>
          <div className="text-left">
            <p className="text-gray-500">Payment Status</p>
            <p className="font-semibold text-green-600">
              {MOCK_SUCCESS_DETAILS.paymentStatus}
            </p>
          </div>
          <div className="text-left">
            <p className="text-gray-500">Platform</p>
            <p className="font-semibold">{MOCK_SUCCESS_DETAILS.platform}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={resetBooking}>
            Close
          </Button>
          <Button
            onClick={handleViewConsultation}
            className="bg-[#6f42c1] hover:bg-[#5a369e]"
          >
            View Consultation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
