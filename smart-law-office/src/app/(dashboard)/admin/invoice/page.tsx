"use client";
import React from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceEmptyState } from "@/components/dashboard/admin/invoice/InvoiceEmptyState";
import { CreateInvoiceForm } from "@/components/dashboard/admin/invoice/InvoiceForm";
import { InvoiceDetailsSummary } from "@/components/dashboard/admin/invoice/InvoiceDetailsSummary";
import { InvoiceDashboard } from "@/components/dashboard/admin/invoice/BillingDashboard";
import { PaymentSuccessModal } from "@/components/dashboard/admin/invoice/PaymentSuccessModal";

export default function BillingAndInvoiceManagement() {
  const { step, setStep, invoiceHistory } = useInvoiceStore();
  const hasHistory = invoiceHistory.length > 0;

  const renderFlowStep = () => {
    switch (step) {
      case "form":
        return <CreateInvoiceForm />;

      case "details":
        return <InvoiceDetailsSummary />;

      case "success":
        return hasHistory ? (
          <InvoiceDashboard />
        ) : (
          <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-8">Billing</h1>
            <InvoiceEmptyState GenerateInvoice={() => setStep("form")} />
          </div>
        );

      case "dashboard":
      default:
        return hasHistory ? (
          <InvoiceDashboard />
        ) : (
          <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-8">Billing</h1>
            <InvoiceEmptyState GenerateInvoice={() => setStep("form")} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">{renderFlowStep()}</div>
      <PaymentSuccessModal />
    </div>
  );
}
