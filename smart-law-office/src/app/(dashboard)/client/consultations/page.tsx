"use client";

import { BookConsultationForm } from "@/components/dashboard/client/consultation/BookConsultForm";
import { BookingSuccessModal } from "@/components/dashboard/client/consultation/BookingSuccessModal";
// ... (imports for flow components and store) ...
import { ConsultationDashboard } from "@/components/dashboard/client/consultation/ConsultationDashboard";
import { ConsultationDetailsView } from "@/components/dashboard/client/consultation/ConsultationDetailsView";
import { ConsultationSummary } from "@/components/dashboard/client/consultation/ConsultationSummary";
import { PaymentGateway } from "@/components/dashboard/client/consultation/PaymentGateway";
import { CreateModal } from "@/components/shared/CreateModal";
import useConsultationStore from "@/store/consultationStore";
import React from "react";

export default function ConsultationFlowPage() {
  const { step, isBookingOpen, closeBooking, openBooking, resetBooking } =
    useConsultationStore();
  const [viewMode, setViewMode] = React.useState<"dashboard" | "details">(
    "dashboard"
  );
  const [selectedConsultCode, setSelectedConsultCode] =
    React.useState<string>("");

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
          onBookConsultation={openBooking}
          onViewDetails={handleViewDetails}
        />
      )}

      {viewMode === "details" && selectedConsultCode && (
        <ConsultationDetailsView
          consultCode={selectedConsultCode}
          onBack={handleBackToDashboard}
        />
      )}

      {/* --- Modals Orchestration --- */}

      {/* Step 1: Book Consultation Form Modal */}
      {isBookingOpen && step === "form" && (
        <CreateModal
          triggerText=""
          modalTitle="Book a Consultation"
          isOpen={isBookingOpen && step === "form"}
          onOpenChange={(open) => {
            if (!open) closeBooking();
          }}
          customTrigger={<></>}
        >
          <BookConsultationForm onClose={closeBooking} />
        </CreateModal>
      )}

      {/* Step 2: Consultation Summary Modal */}
      {isBookingOpen && step === "summary" && (
        <CreateModal
          triggerText=""
          modalTitle="Consultation Summary"
          isOpen={isBookingOpen && step === "summary"}
          onOpenChange={(open) => {
            if (!open) closeBooking();
          }}
          customTrigger={<></>}
        >
          <ConsultationSummary />
        </CreateModal>
      )}

      {/* Step 3: Payment Gateway Modal */}
      {isBookingOpen && step === "payment" && (
        <CreateModal
          triggerText=""
          modalTitle="Payment"
          isOpen={isBookingOpen && step === "payment"}
          onOpenChange={(open) => {
            if (!open) closeBooking();
          }}
          customTrigger={<></>}
        >
          <PaymentGateway />
        </CreateModal>
      )}

      {/* Step 4: Success Modal */}
      {step === "success" && <BookingSuccessModal />}
    </div>
  );
}

// "use client";
// import { CreateCaseModal } from "@/components/dashboard/client/mycase/CreateCaseModal";
// import { TbUserScreen } from "react-icons/tb";
// import React from "react";
// import { CreateModal } from "@/components/shared/CreateModal";
// import { BookConsultationForm } from "@/components/dashboard/client/consultation/BookConsultForm";

// const ConsultationPage = () => {
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
//   return (
//     <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
//       {/* Icon*/}
//       <TbUserScreen className="h-16 w-16 text-purple-700 mb-4" />

//       {/* Heading */}
//       <h2 className="text-2xl font-semibold mb-3 text-gray-800">
//         Book Consultation
//       </h2>

//       {/* Description */}
//       <p className="text-gray-600 mb-8 max-w-sm">
//         Consultation will appear here. Set up a consultation to manage clients
//         meetings and sync your availability.
//       </p>

//       {/* Modal Trigger/Button (Keep your existing component) */}
//       <CreateModal
//         triggerText="Book Consultation"
//         modalTitle="Book a Consultation"
//         triggerClassName="bg-[#6f42c1] hover:bg-[#5a369e] text-white"
//       >
//         <BookConsultationForm />
//       </CreateModal>
//     </div>
//   );
// };

// export default ConsultationPage;
