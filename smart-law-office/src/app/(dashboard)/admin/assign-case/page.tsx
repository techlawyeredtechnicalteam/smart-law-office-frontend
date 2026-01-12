"use client";

import { useEffect, useState } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { AssignCaseModal } from "@/components/dashboard/admin/assignCase/AssignCaseModal";
// import { UnassignedCasesPanel } from "@/components/dashboard/admin/assignCase/UnassignedCasesPanel";
// import { AvailableLawyersPanel } from "@/components/dashboard/admin/assignCase/AvailableLawyersPanel";
import { AssignedCasesTable } from "@/components/dashboard/admin/assignCase/AssignCaseTable";
import { UnassignedCasesPanel } from "@/components/dashboard/admin/assignCase/UnassignedCasePanel";
import { AvailableLawyersPanel } from "@/components/dashboard/admin/assignCase/AvailableLawyerPanel";
import { CreateCaseModal } from "@/components/dashboard/admin/createCase/CreateCaseModal";
import { AssignCaseSuccessModal } from "@/components/dashboard/admin/assignCase/AssignCaseSuccessModal";

export default function AssignCasePage() {
  const { fetchData, isLoading } = useAssignStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSuccessClose = () => setIsSuccessModalOpen(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Assign Case</h1>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-500">Loading case data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Assign Case</h1>
        <AssignCaseModal />
      </div> */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Case</h1>
        <AssignCaseModal
          isSuccessOpen={isSuccessModalOpen}
          setSuccessOpen={setIsSuccessModalOpen}
        />
      </header>

      {/* Grid Section: Unassigned Cases + Available Lawyers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UnassignedCasesPanel />
        <AvailableLawyersPanel />
      </div>

      {/* <AssignCaseSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
      /> */}

      {/* Bottom Section: Assigned Cases */}
      <AssignedCasesTable />
    </div>
  );
}
