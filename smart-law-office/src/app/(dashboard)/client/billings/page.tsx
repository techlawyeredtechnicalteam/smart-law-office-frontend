// src/app/billing/BillingAndInvoiceManagement.tsx
"use client";

import React from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceEmptyState } from "@/components/dashboard/client/billings&payment/InvoiceEmptyState";
import { CreateInvoiceForm } from "@/components/dashboard/client/billings&payment/InvoiceForm";
import { InvoiceDetailsSummary } from "@/components/dashboard/client/billings&payment/InvoiceDetailsSummary";
import { PaymentPage } from "@/components/dashboard/client/billings&payment/PaymentPage";
import { PaymentSuccessModal } from "@/components/dashboard/client/billings&payment/PaymentSuccessModal";
import { BillingDashboard } from "@/components/dashboard/client/billings&payment/BillingDashboard";
import { ArrowLeft } from "lucide-react";

// Assuming the InvoiceEmptyState component is saved correctly with the fix below:
// NOTE: I am assuming you rename your empty state file to InvoiceEmptyState.tsx
// and update the button label from "Book Consultation" to "Generate Invoice"

export default function BillingAndInvoiceManagement() {
  const { step, setStep, invoiceHistory } = useInvoiceStore();

  // Check if there is any history to determine if we show the dashboard or the empty state
  const hasHistory = invoiceHistory.length > 0;

  const renderHeader = () => {
    switch (step) {
      case "form":
        return (
          <div className="flex items-center space-x-2">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={() => setStep("dashboard")}
            />
            <h1 className="text-2xl font-bold">Create Invoice</h1>
          </div>
        );
      case "details":
      case "history":
        return (
          <div className="flex items-center space-x-2">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={() => setStep("dashboard")}
            />
            <h1 className="text-2xl font-bold">
              {step === "history" ? "Invoice History" : "Invoice Details"}
            </h1>
          </div>
        );
      case "payment":
        return (
          <div className="flex items-center space-x-2">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={() => setStep("details")}
            />
            <h1 className="text-2xl font-bold">PAY WITH</h1>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFlowStep = () => {
    switch (step) {
      case "dashboard":
        if (!hasHistory) {
          // Show Empty State
          return (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-8">Billing</h1>
              <InvoiceEmptyState GenerateInvoice={() => setStep("form")} />
            </div>
          );
        }
        // Show Full Dashboard with History
        return <BillingDashboard />;

      case "form":
        return <CreateInvoiceForm />;

      case "details":
        return <InvoiceDetailsSummary />;

      case "payment":
        return <PaymentPage />;

      case "history":
        return <InvoiceDetailsSummary />; // History view is handled by this component

      case "success":
        // Corresponds to paymentSuccess.png (renders the details view with the modal overlay)
        return (
          <div className="relative">
            <InvoiceDetailsSummary />
            {/* Overlay the success modal */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PaymentSuccessModal />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // The main container structure
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Conditionally render header based on step */}
        {step !== "dashboard" && step !== "history" && (
          <div className="bg-white p-6 rounded-t-lg shadow-md mb-4">
            {renderHeader()}
          </div>
        )}

        {/* Render the main content (Flow or Dashboard) */}
        <div
          className={
            step === "dashboard" ? "" : "bg-white p-6 rounded-lg shadow-md"
          }
        >
          {renderFlowStep()}
        </div>
      </div>
    </div>
  );
}
