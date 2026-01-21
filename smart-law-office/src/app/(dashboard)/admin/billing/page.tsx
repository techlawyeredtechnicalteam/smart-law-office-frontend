"use client";
import React from "react";
import { useBillingStore } from "@/store/setRateBill";
import ConfiguredServiceRateTable from "@/components/dashboard/admin/billing/ConfiguredServiceRateTable";
import { SetRateBillEmptyState } from "@/components/dashboard/admin/billing/SetRateEmptyState";
import { Loader2 } from "lucide-react";
import SetRateConsultation from "@/components/dashboard/admin/billing/SetRateConsultation";
import SetRateCase from "@/components/dashboard/admin/billing/SetRateCase";

const BillingPage = () => {
  const {
    isLoading,
    rates,
    fetchBillingInitialData,
    isSetRateModalOpen,
    isSetRateCaseModalOpen
  } = useBillingStore();

  // Trigger fetch on Page Mount
  React.useEffect(() => {
    fetchBillingInitialData();
  }, []);

  return (
    <div className="p-6">
      {/* Conditional Rendering Logic */}
      <main>
        {isLoading && rates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#6f42c1]" />
          </div>
        ) : rates.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ConfiguredServiceRateTable />
          </div>
        ) : (
          <div className="mt-10">
            <SetRateBillEmptyState />
          </div>
        )}
      </main>

      {/* Modals - Always rendered but visibility controlled by Zustand */}
      <SetRateConsultation />
      <SetRateCase />
    </div>
  );
};

export default BillingPage;
