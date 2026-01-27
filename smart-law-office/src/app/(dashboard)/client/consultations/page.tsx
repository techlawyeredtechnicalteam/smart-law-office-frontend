"use client";

import { BookConsultationForm } from "@/components/dashboard/client/consultation/BookConsultForm";
import { BookingSuccessModal } from "@/components/dashboard/client/consultation/BookingSuccessModal";
import { ConsultationDashboard } from "@/components/dashboard/client/consultation/ConsultationDashboard";
import { ConsultationSummary } from "@/components/dashboard/client/consultation/ConsultationSummary";
import { PaymentVerification } from "@/components/dashboard/client/consultation/PaymentGateway";
import { CreateModal } from "@/components/shared/CreateModal";
import useConsultationStore from "@/store/consultationStore";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import { useBillingStore } from "@/store/setRateBill";
import React from "react";

export default function ConsultationFlowPage() {
  const { step, isBookingOpen, closeBooking, openBooking, resetBooking } =
    useConsultationStore();
  const { fetchConsultationFeesOnly, rates } = useBillingStore();
  const { fetchProfile, formData: firmProfile } = useFirmProfileStore();

  const [viewMode, setViewMode] = React.useState<"dashboard" | "details">(
    "dashboard"
  );

  const [selectedConsultCode, setSelectedConsultCode] =
    React.useState<string>("");

  // 1. Define the variable HERE (above the return)
  const isFormOpen = isBookingOpen && step === "form";
  const isSummaryOpen = isBookingOpen && step === "summary";
  const isPaymentOpen = isBookingOpen && step === "payment";

  React.useEffect(() => {
    if (rates.length === 0) {
      fetchConsultationFeesOnly();
    }

    // Fetch firm bank details if empty
    if (!firmProfile || !firmProfile.bankAccountNumber) {
      fetchProfile();
    }
  }, [fetchConsultationFeesOnly, rates.length, firmProfile, fetchProfile]);

  // Function to handle clicking 'View' on the dashboard
  const handleViewDetails = (id: string) => {
    setSelectedConsultCode(id);
    setViewMode("details");
  };

  // Function passed to the Success Modal to handle navigation
  const handleViewConsultation = (id: string) => {
    resetBooking();
    setSelectedConsultCode(id);
    setViewMode("details");
  };

  // Function to go back to the dashboard
  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setSelectedConsultCode("");
  };

  return (
    <div className="p-8">
      {/* Conditional Rendering of Dashboard vs. Details View */}
      {viewMode === "dashboard" && (
        <ConsultationDashboard
          isAdminView={false}
          // onBookConsultation={openBooking}
          // onViewDetails={handleViewDetails}
        />
      )}
      {/* {viewMode === "details" && selectedConsultCode && (
        <ConsultationDetailsView
          consultCode={selectedConsultCode}
          onBack={handleBackToDashboard}
        />
      )} */}
      {/* --- Modals Orchestration --- */}
      <CreateModal
        isOpen={isBookingOpen}
        onOpenChange={(open) => !open && closeBooking()}
        triggerText=""
        customTrigger={<span />}
        modalTitle={
          step === "form"
            ? "Book a Consultation"
            : step === "summary"
              ? "Review & Pay"
              : "Verify Payment"
        }
      >
        <div className="w-full">
          {step === "form" && <BookConsultationForm onClose={closeBooking} />}
          {step === "summary" && <ConsultationSummary />}
          {step === "payment" && <PaymentVerification />}
        </div>
      </CreateModal>
      {/* Step 4: Success Modal */}
      {step === "success" && <BookingSuccessModal />}
    </div>
  );
}
