"use client";

import useConsultationStore from "@/store/consultationStore";
import { useAuthStore } from "@/store/authStore";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { CheckCircle2, Calendar, Clock, Hash, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function BookingSuccessModal() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    formData,
    step,
    isBookingOpen,
    resetBooking,
    lastCreatedConsultCode
  } = useConsultationStore();

  const isOpen = isBookingOpen && step === "success";

  if (!isOpen) return null;

  // --- Logic: Safe Data Formatting ---
  const clientName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "Client";

  // Handle date formatting whether it's a string from an input or a Date object
  let displayDate = "Not set";
  if (formData?.date) {
    const dateObj =
      typeof formData.date === "string"
        ? parseISO(formData.date)
        : formData.date;
    displayDate = isValid(dateObj)
      ? format(dateObj, "EEEE, MMM dd, yyyy")
      : formData.date;
  }

  const handleAction = () => {
    resetBooking();
    router.push("/client/manage-case");
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetBooking}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Top Decorative Banner */}
        <div className="h-2 bg-green-500 w-full" />

        <div className="p-8">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4 p-3 rounded-full bg-green-50 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-gray-900">
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 mt-2">
              Your appointment has been successfully scheduled. A confirmation
              has been sent to{" "}
              <span className="text-gray-900 font-medium">{user?.email}</span>.
            </DialogDescription>
          </DialogHeader>

          {/* Details Grid */}
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 grid grid-cols-2 gap-6">
            <DetailItem
              icon={<Hash className="w-3.5 h-3.5" />}
              label="Consultation ID"
              value={lastCreatedConsultCode || "PENDING"}
              highlight
            />
            <DetailItem
              icon={<Calendar className="w-3.5 h-3.5" />}
              label="Date"
              value={displayDate}
            />
            <DetailItem
              icon={<Clock className="w-3.5 h-3.5" />}
              label="Time"
              value={formData?.time || "---"}
            />
            <DetailItem
              icon={<Globe className="w-3.5 h-3.5" />}
              label="Platform"
              value="Google Meet"
            />
            <div className="col-span-2 pt-2 border-t border-gray-200/60 mt-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                Client
              </p>
              <p className="text-sm font-semibold text-gray-700 uppercase">
                {clientName}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200"
              onClick={resetBooking}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-[#6f42c1] hover:bg-[#5a369e] h-12 rounded-xl font-bold shadow-lg shadow-purple-100"
              onClick={handleAction}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable Sub-component for clean code
function DetailItem({
  label,
  value,
  icon,
  highlight = false
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-bold">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-bold ${highlight ? "text-[#6f42c1]" : "text-gray-800"}`}
      >
        {value}
      </p>
    </div>
  );
}
