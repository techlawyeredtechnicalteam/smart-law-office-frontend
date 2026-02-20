"use client";

import React from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceEmptyState } from "@/components/dashboard/admin/invoice/InvoiceEmptyState";
import { CreateInvoiceForm } from "@/components/dashboard/admin/invoice/InvoiceForm";
import { InvoiceDetailsSummary } from "@/components/dashboard/admin/invoice/InvoiceDetailsSummary";
import { InvoiceDashboard } from "@/components/dashboard/admin/invoice/BillingDashboard";
import { PaymentSuccessModal } from "@/components/dashboard/admin/invoice/PaymentSuccessModal";
import { ArrowLeft } from "lucide-react";

export default function BillingAndInvoiceManagement() {
  const { step, setStep, invoiceHistory } = useInvoiceStore();
  const hasHistory = invoiceHistory.length > 0;

  const renderHeader = () => {
    if (step === "form") {
      return (
        <div className="flex items-center space-x-2 bg-white p-6 rounded-t-lg shadow-sm mb-4">
          <h1 className="text-2xl font-bold">Create Invoice</h1>
        </div>
      );
    }
    return null;
  };

  const renderFlowStep = () => {
    switch (step) {
      case "dashboard":
        if (!hasHistory) {
          return (
            <div className="p-4 sm:p-8">
              <h1 className="text-3xl font-bold mb-8">Billing</h1>
              <InvoiceEmptyState GenerateInvoice={() => setStep("form")} />
            </div>
            // <InvoiceDashboard />
          );
        }
        return <InvoiceDashboard />;

      case "form":
        return <CreateInvoiceForm />;

      case "details":
        return <InvoiceDetailsSummary />;
      case "success":
        return <InvoiceDetailsSummary />;
      // case "history":

      default:
        return <InvoiceDashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {renderHeader()}

        <div className={step === "dashboard" ? "" : ""}>{renderFlowStep()}</div>
      </div>

      <PaymentSuccessModal />
    </div>
  );
}
