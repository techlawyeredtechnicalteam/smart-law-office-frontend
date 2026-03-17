"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useCaseStore } from "@/store/createCase";
import { useAuthStore } from "@/store/authStore"; // Import Auth Store
import { CaseDashboard } from "@/components/dashboard/admin/createCase/CaseDashboardTable";
import { CreateCaseModal } from "@/components/dashboard/admin/createCase/CreateCaseModal";
import { CaseSuccessModal } from "@/components/dashboard/admin/createCase/CreateSuccessModal";
import { Briefcase } from "lucide-react";

export default function CasePage() {
  const { cases, isLoading, fetchCases, error } = useCaseStore();
  const { user } = useAuthStore(); // Get current user
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // 1. Filter cases based on role
  const assignedToMe = useMemo(() => {
    if (isAdmin) return cases;

    const currentUserEmail = user?.email?.toLowerCase();
    return cases.filter(
      (c) => c.staffEmail?.toLowerCase() === currentUserEmail
    );
  }, [cases, user, isAdmin]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleSuccessClose = () => setIsSuccessModalOpen(false);

  return (
    <>
      <div className="p-8 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Case</h1>
          <CreateCaseModal
            isSuccessOpen={isSuccessModalOpen}
            setSuccessOpen={setIsSuccessModalOpen}
          />
        </header>

        {isLoading && <p>Loading cases...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* 2. Check the length of filtered cases, not the raw store cases */}
        {assignedToMe.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
            <Briefcase className="h-16 w-16 text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-3">No Cases Assigned</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              {isAdmin
                ? "Once you add your first case, you'll be able to track progress and assign team members."
                : "You currently have no cases assigned to you. Once a case is assigned, it will appear here."}
            </p>
            {isAdmin && (
              <CreateCaseModal
                isSuccessOpen={isSuccessModalOpen}
                setSuccessOpen={setIsSuccessModalOpen}
              />
            )}
          </div>
        ) : (
          /* 3. Pass the filtered list to the dashboard table */
          <CaseDashboard cases={assignedToMe} />
        )}

        <CaseSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessClose}
        />
      </div>
    </>
  );
}
