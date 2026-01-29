// @/app/dashboard/case-management/page.tsx
"use client";

import React, { useEffect } from "react";
import { useCaseStore } from "@/store/createCase";
import useConsultationStore from "@/store/consultationStore"; // Import your consult store
import { CaseStats } from "@/components/dashboard/admin/caseManagement/CaseStats"; // The stat cards component
import { AssignedCasesTable } from "@/components/dashboard/admin/assignCase/AssignCaseTable";
import { ConsultationDashboard } from "@/components/dashboard/client/consultation/ConsultationDashboard";
import { AssignCaseModal } from "@/components/dashboard/admin/assignCase/AssignCaseModal";
import { Briefcase, Loader2 } from "lucide-react";
import { CreateCaseModal } from "@/components/dashboard/admin/createCase/CreateCaseModal";
import { CreateModal } from "@/components/shared/CreateModal";

const CaseManagementPage = () => {
  const { cases, stats, isLoading, fetchCases } = useCaseStore();
  const { consultations, fetchConsultationDirect } = useConsultationStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Sync data on mount
  useEffect(() => {
    fetchCases();
    fetchConsultationDirect(); // Fetch the table data for the top section
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* 1. Top Header */}
      <header className="flex justify-end items-center">
        <CreateCaseModal
          isSuccessOpen={isSuccessModalOpen}
          setSuccessOpen={setIsSuccessModalOpen}
        />
      </header>

      {/* 2. Stat Cards (The 4 cards from the image) */}
      <CaseStats stats={stats} />

      {/* 3. Consultations Section (Top Table in PNG) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Consultations</h2>
          <button className="text-sm text-purple-600 font-medium">
            View All
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border">
          {/* Create a simple table or reuse a component for Consultations */}
          <ConsultationDashboard isAdminView={true} />
        </div>
      </section>

      {/* 4. Active Cases Section (Bottom Table in PNG) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Cases</h2>
          <button className="text-sm text-purple-600 font-medium">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-purple-600" />
          </div>
        ) : cases.length === 0 ? (
          <EmptyState
            setIsSuccessModalOpen={setIsSuccessModalOpen}
            isSuccessModalOpen={isSuccessModalOpen}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border">
            <AssignedCasesTable />
          </div>
        )}
      </section>

      {/* 5. Recent Activity (Matching the sidebar/bottom design) */}
      {/* You can add your Activity Feed component here */}
    </div>
  );
};

// Helper for the empty state
const EmptyState = ({ setIsSuccessModalOpen, isSuccessModalOpen }: any) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl text-center border border-dashed border-gray-200">
    <Briefcase className="h-12 w-12 text-purple-200 mb-4" />
    <h2 className="text-xl font-semibold mb-2">No active cases</h2>
    <p className="text-gray-500 mb-6 max-w-xs">
      Start by assigning a consultation to a lawyer to create an active case.
    </p>
    <CreateCaseModal
      isSuccessOpen={isSuccessModalOpen}
      setSuccessOpen={setIsSuccessModalOpen}
    />
    {/* <AssignCaseModal
      isSuccessOpen={isSuccessModalOpen}
      setSuccessOpen={setIsSuccessModalOpen}
    /> */}
  </div>
);

export default CaseManagementPage;
