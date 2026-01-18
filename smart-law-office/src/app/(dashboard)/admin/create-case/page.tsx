"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useCaseStore } from "@/store/createCase";
import { CaseDashboard } from "@/components/dashboard/admin/createCase/CaseDashboardTable";
import { CreateCaseModal } from "@/components/dashboard/admin/createCase/CreateCaseModal";
import { CaseSuccessModal } from "@/components/dashboard/admin/createCase/CreateSuccessModal";
import { Briefcase, Loader2, AlertCircle } from "lucide-react";

export default function CasePage() {
  const { cases, isLoading, fetchCases, fetchCaseTypes, error, clearError } =
    useCaseStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Use useCallback to prevent re-renders if these are passed as props
  const loadData = useCallback(async () => {
    await Promise.all([fetchCases()]);
  }, [fetchCases]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSuccessClose = () => setIsSuccessModalOpen(false);

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50/30">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-sm text-gray-500">
            Manage and track your firm's legal proceedings
          </p>
        </div>

        {/* Only show the top button if there are cases */}
        {cases.length > 0 && (
          <CreateCaseModal
            isSuccessOpen={isSuccessModalOpen}
            setSuccessOpen={setIsSuccessModalOpen}
          />
        )}
      </header>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-purple-600">
          <Loader2 className="h-10 w-10 animate-spin mb-2" />
          <p className="text-gray-500 animate-pulse">Loading cases...</p>
        </div>
      ) : cases.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-dashed border-purple-100 rounded-3xl text-center shadow-sm max-w-2xl mx-auto mt-10">
          <div className="bg-purple-100 p-4 rounded-full mb-6">
            <Briefcase className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No cases yet
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Once you add your first case, you'll be able to track progress,
            assign team members, and centralize every detail seamlessly.
          </p>
          <CreateCaseModal
            isSuccessOpen={isSuccessModalOpen}
            setSuccessOpen={setIsSuccessModalOpen}
          />
        </div>
      ) : (
        /* Populated Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <CaseDashboard cases={cases} />
        </div>
      )}

      <CaseSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
