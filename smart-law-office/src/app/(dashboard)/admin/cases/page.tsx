"use client";
import React, { useEffect, useState } from "react";
import { useCaseStore } from "@/store/createCase";
import { CaseDashboard } from "@/components/admin/createCase/CaseDashboardTable"; // The table component
import { CreateCaseModal } from "@/components/admin/createCase/CreateCaseModal";
import { CaseSuccessModal } from "@/components/admin/createCase/CreateSuccessModal";
import { Briefcase } from "lucide-react";
// import SmartLawOfficeDashboard from "@/components/layout/SmartLawOfficeDashboard";

export default function CasePage() {
  const { cases, isLoading, fetchCases, error } = useCaseStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch data on component mount
  // useEffect(() => {
  //   fetchCases();
  // }, [fetchCases]);

  // Handler to close the success modal
  const handleSuccessClose = () => setIsSuccessModalOpen(false);

  return (
    <>
      <div className="p-8 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Case</h1>
          {/* Button that triggers the Create Case Modal */}
          <CreateCaseModal
            isSuccessOpen={isSuccessModalOpen}
            setSuccessOpen={setIsSuccessModalOpen}
          />
        </header>

        {/* Conditional rendering for the dashboard
        {isLoading && <p>Loading cases...</p>}
        {error && <p className="text-red-500">Error: {error}</p>} */}

        {cases.length === 0 && !isLoading ? (
          // Replicates the initial state (createcase.png)
          <div className="flex flex-col items-center justify-center p-20 bg-purple-50/50 rounded-xl text-center">
            <Briefcase className="h-16 w-16 text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Case</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              Once you add your first case, you'll be able to track progress,
              assign team members, and centralize every detail seamlessly.
            </p>
            <CreateCaseModal
              isSuccessOpen={isSuccessModalOpen}
              setSuccessOpen={setIsSuccessModalOpen}
            />
          </div>
        ) : (
          // Replicates the populated dashboard (createcase2.png)
          <CaseDashboard cases={cases} />
        )}

        <CaseSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessClose}
        />
      </div>
    </>
  );
}
