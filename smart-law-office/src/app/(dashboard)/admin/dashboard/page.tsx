"use client";

import { useCaseStore } from "@/store/createCase";
import { useCounselStore } from "@/store/manageCounsel";
import { OverviewMetrics } from "@/components/dashboard/dashboard/OverViewMetric";
import { CaseTablePanel } from "@/components/dashboard/dashboard/CaseTablePanel";
import { DocumentsPanel } from "@/components/dashboard/dashboard/DocumentPanel";
import { MessagesPanel } from "@/components/dashboard/dashboard/MessagePanel";
import { PerformanceReviewPanel } from "@/components/dashboard/dashboard/PerformanceReviewPanel";
import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { useBillingStore } from "@/store/setRateBill";

export default function AdminDashboardPage() {
  const { cases, fetchCases } = useCaseStore();
  const { fetchBillingInitialData } = useBillingStore();
  const { counsel, fetchCounsels } = useCounselStore();

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const init = async () => {
      await fetchBillingInitialData();
      await fetchCases();

      if (isAdmin) fetchCounsels();
    };

    init();
  }, [isAdmin, fetchBillingInitialData, fetchCases, fetchCounsels]);

  const assignedToMe = useMemo(() => {
    if (isAdmin) return cases;

    const currentUserEmail = user?.email?.toLowerCase();
    return cases.filter(
      (c) => c.staffEmail?.toLowerCase() === currentUserEmail
    );
  }, [cases, user, isAdmin]);

  // Use 'assignedToMe' for your tables and document counts
  const recentCases = useMemo(() => assignedToMe.slice(0, 5), [assignedToMe]);
  // Use filteredCases for documents
  const allDocuments = useMemo(() => {
    return assignedToMe.flatMap((c) =>
      (c.documents || []).map((doc) => ({
        ...doc,
        caseName: c.clientName,
        caseDocumentId: doc.name || doc.url,
        status: "Discovery"
      }))
    );
  }, [assignedToMe]);

  const documentCount = allDocuments.length;

  const recentDocuments = useMemo(
    () => allDocuments.slice(0, 5),
    [allDocuments]
  );

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
                ? "grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            <OverviewMetrics title="Total Cases" value={assignedToMe.length} />
            {isAdmin ? (
              <OverviewMetrics title="Counsel" value={counsel.length} />
            ) : (
              <span className=""></span>
              // <OverviewMetrics title="Consultations" value={consultation.length} />
            )}
            <OverviewMetrics title="Documents" value={documentCount} />
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
        <CaseTablePanel
          cases={recentCases}
          viewAllLink={isAdmin ? "/admin/case-mgmt" : "/staff/my-cases"}
        />
        <DocumentsPanel
          documents={recentDocuments}
          viewAllLink={!isAdmin ? "/staff/document" : undefined}
        />
      </div>

      <div className="w-full">
        <MessagesPanel />
      </div>
    </div>
  );
}
