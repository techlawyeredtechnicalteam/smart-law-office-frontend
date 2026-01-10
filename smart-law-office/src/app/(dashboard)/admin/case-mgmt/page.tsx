"use client";

import { AssignCaseModal } from "@/components/dashboard/admin/assignCase/AssignCaseModal";
import { AssignedCasesTable } from "@/components/dashboard/admin/assignCase/AssignCaseTable";
import { CaseDashboard } from "@/components/dashboard/admin/createCase/CaseDashboardTable";
import { CreateCaseModal } from "@/components/dashboard/admin/createCase/CreateCaseModal";
import { CaseSuccessModal } from "@/components/dashboard/admin/createCase/CreateSuccessModal";
import { useCaseStore } from "@/store/createCase";
import { Briefcase } from "lucide-react";
import React from "react";

const CaseManagementPage = () => {
  const { cases, isLoading, error } = useCaseStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const handleSuccessClose = () => setIsSuccessModalOpen(false);
  return (
    <div>
      <div className="p-8 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Case</h1>
          {/* Button that triggers the Create Case Modal */}
          <AssignCaseModal />
        </header>

        {/* Conditional rendering for the dashboard */}
        {isLoading && <p>Loading cases...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {cases.length === 0 && !isLoading ? (         
          <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
            {/* Icon */}
            <Briefcase className="h-16 w-16 text-purple-600 mb-4" />
            {/* Heading */}
            <h2 className="text-2xl font-semibold mb-3">Case</h2>
            {/* Descritption */}
            <p className="text-gray-800 mb-4 max-w-sm">
              Start by assigning a case to a lawyer or legal team. This helps
              streamline workflow, track progress, and keep everyone aligned.
            </p>
            <span className="text-gray-400 font-light font-sm max-w-sm mb-8">
              We cannot access funds without your permission
            </span>
            <AssignCaseModal />
          </div>
        ) : (
          <AssignedCasesTable />
        )}        
      </div>
    </div>
  );
};

export default CaseManagementPage;
