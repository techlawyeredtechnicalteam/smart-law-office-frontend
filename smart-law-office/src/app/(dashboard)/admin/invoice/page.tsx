"use client";
import React, { useEffect } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceEmptyState } from "@/components/dashboard/admin/invoice/InvoiceEmptyState";
import { CreateInvoiceForm } from "@/components/dashboard/admin/invoice/InvoiceForm";
import { InvoiceDetailsSummary } from "@/components/dashboard/admin/invoice/InvoiceDetailsSummary";
import { InvoiceDashboard } from "@/components/dashboard/admin/invoice/BillingDashboard";
import { InvoiceSuccessView } from "@/components/dashboard/admin/invoice/InvoiceSuccessView";

export default function BillingAndInvoiceManagement() {
  const { step, setStep, invoiceHistory, fetchInvoices } = useInvoiceStore();

  // Fetch data on initial mount to determine which view to show
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const renderFlowStep = () => {
    switch (step) {
      case "form":
        return <CreateInvoiceForm />;

      case "details":
        return <InvoiceDetailsSummary />;

      case "success":
        return <InvoiceSuccessView />;

      case "dashboard":
      default:
        if (invoiceHistory.length > 0) {
          return <InvoiceDashboard />;
        }
        return (
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
    </div>
  );
}
