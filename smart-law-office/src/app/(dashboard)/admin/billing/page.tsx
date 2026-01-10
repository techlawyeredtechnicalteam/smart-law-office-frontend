// /app/(dashboard)/billing/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useBillingStore } from "@/store/setRateBill";
import SetRateModal from "@/components/dashboard/admin/billing/SetRateModal";
import SetRateCaseModal from "@/components/dashboard/admin/billing/SetRateCaseModal";
import ConfiguredServiceRateTable from "@/components/dashboard/admin/billing/ConfiguredServiceRateTable";
import { SetRateBillEmptyState } from "@/components/dashboard/admin/billing/SetRateEmptyState";
import { Loader2 } from "lucide-react";

const BillingPage = () => {
  const { isLoading, rates, fetchBillingInitialData, openSetRateModal } =
    useBillingStore();

  React.useEffect(() => {
    // We still fetch service types so the modals have data when opened
    fetchBillingInitialData();
  }, [fetchBillingInitialData]);

  return (
    <div className="p-6">
      {/* Main Content: Always show the EmptyState if not loading
      {isLoading ? (
        <div className="text-center p-10">Loading...</div>
      ) : (
        <SetRateBillEmptyState />
      )}

      
      {!isLoading && rates.length > 0 && <ConfiguredServiceRateTable />}

      
      <SetRateModal />
      <SetRateCaseModal /> */}
      {/* Conditional Rendering Logic */}
      <main>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#6f42c1]" />
            {/* <p className="font-medium">Loading billing configurations...</p> */}
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
      <SetRateModal />
      <SetRateCaseModal />
    </div>
  );
};

export default BillingPage;
