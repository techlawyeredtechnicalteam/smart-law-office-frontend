// Example: src/app/dashboard/page.tsx
"use client";

import { useCaseStore } from "@/store/createCase";
import { useCounselStore } from "@/store/manageCounsel";
import { OverviewMetrics } from "@/components/dashboard/dashboard/OverViewMetric";
import { CaseTablePanel } from "@/components/dashboard/dashboard/CaseTablePanel";
import { DocumentsPanel } from "@/components/dashboard/dashboard/DocumentPanel";
import { MessagesPanel } from "@/components/dashboard/dashboard/MessagePanel";
import { PerformanceReviewPanel } from "@/components/dashboard/dashboard/PerformanceReviewPanel";
import React, { useEffect } from "react";
import { useDocumentStore } from "@/store/documentStore";
import { useAuthStore } from "@/store/authStore";
import useConsultationStore from "@/store/consultationStore";
import { useBillingStore } from "@/store/setRateBill";

export default function AdminDashboardPage() {
  const { cases, fetchCases } = useCaseStore();
  const { fetchBillingInitialData } = useBillingStore();
  const { counsel, fetchCounsels } = useCounselStore();
  const { documents } = useDocumentStore();
  // const {fetchConsultationDirect, consultation} = useConsultationStore()

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const init = async () => {
      // Load Billing first to ensure the 'rates' dictionary is ready
      await fetchBillingInitialData();
      // Then load cases so they can find their names in the rates dictionary
      await fetchCases();

      if (isAdmin) fetchCounsels();
    };

    init();
  }, [isAdmin]);
  // 2. Prepare data for the OverviewMetrics component
  const totalCases = cases.length;
  const totalCounsels = counsel.length;

  const totalPayments = 0;

  // const overviewData = {
  //   totalCases,
  //   totalDocuments,
  //   totalPayments,
  //   totalCounsels
  //   // The '% since last month' indicators require backend data comparison
  // };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>

      {/* Main Wrapper: 3-column grid for Admin, 1-column stack for Staff */}
      <div
        className={`grid gap-6 ${isAdmin ? "lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {/* LEFT/MAIN COLUMN */}
        <div
          className={`${isAdmin ? "lg:col-span-2" : "col-span-1"} space-y-6`}
        >
          {/* 1. Metrics Bar */}
          <div
            className={`grid gap-4 ${
              isAdmin
                ? "grid-cols-2" // Admin: 2x2 inside the 2/3 column
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" // Staff: Straight 4-card line
            }`}
          >
            <OverviewMetrics title="Total Cases" value={cases.length} />
            {isAdmin ? (
              <OverviewMetrics title="Counsel" value={counsel.length} />
            ) : (
              <span className=""></span>
              // <OverviewMetrics title="Consultations" value={consultation.length} />
            )}
            <OverviewMetrics title="Documents" value={documents.length} />
            <OverviewMetrics title="Payments" value={0} />
          </div>
        </div>

        {isAdmin && (
          <div className="lg:col-span-1">
            <PerformanceReviewPanel />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CaseTablePanel cases={cases} />
        <DocumentsPanel />
      </div>

      <div className="w-full">
        <MessagesPanel />
      </div>
    </div>
    // <div className="p-6 space-y-6">
    //   <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>

    //   <div className={`flex flex-col gap-6`}>
    //     {/* Left Column*/}
    //     <div className="w-full">
    //       <div
    //         className={`grid gap-4 ${
    //           isAdmin
    //             ? "lg:grid-cols-2 lg:w-2/3" // 2x2 Grid taking up part of the screen
    //             : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" // Straight horizontal line on desktop
    //         }`}
    //       >
    //         <OverviewMetrics title="Total Cases" value={cases.length} />

    //         {/* Staff sees Consultation, Admin sees Counsel */}
    //         {isAdmin ? (
    //           <OverviewMetrics title="Counsel" value={counsel.length} />
    //         ) : (
    //           <OverviewMetrics title="Consultations" value={cases.length} />
    //         )}
    //         <OverviewMetrics title="Documents" value={documents.length} />
    //         <OverviewMetrics title="Payments" value={0} />
    //       </div>
    //     </div>

    //     {/* RIght Column */}
    //     {isAdmin && (
    //       <div className="lg:col-span-1 lg:absolute lg:right-6 lg:top-24 lg:w-1/3">
    //         <PerformanceReviewPanel />
    //       </div>
    //     )}

    //     {/* Bottom Cases */}
    //     <div className={`${isAdmin ? "lg:col-span-2" : "lg:col-span-1"}`}>
    //       <CaseTablePanel cases={cases} />
    //     </div>

    //     {/* Documents & messages */}
    //     <div className="lg:col-span-1">
    //       <DocumentsPanel /> {/* Limit to 3 for visual match */}
    //     </div>
    //     {/* <div className="lg:col-span-1"></div> */}
    //   </div>
    //   <MessagesPanel />
    // </div>
  );
}
