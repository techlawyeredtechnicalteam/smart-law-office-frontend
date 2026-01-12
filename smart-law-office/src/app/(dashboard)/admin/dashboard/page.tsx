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

export default function AdminDashboardPage() {
  // 1. Fetch data on load and subscribe to real-time updates (by Zustand)
  const { cases, fetchCases } = useCaseStore();
  const { counsel, fetchCounsels } = useCounselStore();
  const { documents, isAddModalOpen, setIsAddModalOpen } = useDocumentStore();
  const totalDocuments = documents.length;
  // Assuming you have a document store or a way to get docu
  // ments (not fully provided, so we'll simulate it)

  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchCases();
    fetchCounsels();
    // In a real app, you'd also fetch documents/payments/etc.
  }, [fetchCases, fetchCounsels]);

  // 2. Prepare data for the OverviewMetrics component
  const totalCases = cases.length;
  const totalCounsels = counsel.length;
  // Assuming documents are stored in a separate store or derived from cases.
  // For now, we'll use a placeholder/derived value.

  // Derive Payments count (SIMULATED - requires a payments store for real data)
  const totalPayments = 0;

  const overviewData = {
    totalCases,
    totalDocuments: totalDocuments,
    totalPayments,
    totalCounsels
    // The '% since last month' indicators require backend data comparison
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP LEFT 4 METRICS & PERFORMANCE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <OverviewMetrics
              title="Total Cases"
              value={overviewData.totalCases}
              percentChange="+0.0% since last month"
              isPositive={true}
            />
            <OverviewMetrics
              title="Documents"
              value={overviewData.totalDocuments}
              subtext="2 unread documents"
            />
            <OverviewMetrics
              title="Payments"
              value={overviewData.totalPayments}
              percentChange="+0.0% since last month"
              isPositive={true}
            />
            <OverviewMetrics
              title="Counsel"
              value={overviewData.totalCounsels}
              subtext={`${overviewData.totalCounsels} counsel onboarded`}
            />
          </div>

          {/* PERFORMANCE REVIEW (Top Right in image) - Using lg:col-span-2 for layout adjustment */}
          {/* <PerformanceReviewPanel /> */}
        </div>

        {/* Documents & Cases (Middle of image) - Side-by-Side in Desktop */}
        <div className="space-y-6 lg:col-span-1">
          <DocumentsPanel /> {/* Limit to 3 for visual match */}
        </div>
      </div>

      {/* CASES TABLE (Middle of image) */}
      <CaseTablePanel cases={cases} />

      {/* MESSAGES (Bottom) */}
      <MessagesPanel />
    </div>
  );
}
