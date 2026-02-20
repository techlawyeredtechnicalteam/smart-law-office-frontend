"use client";

import React, { useEffect } from "react";
import nextDynamic from "next/dynamic";
import { useCounselStore } from "@/store/manageCounsel";
import { Button } from "@/components/ui/button";
import { Plus, User, CheckCircle, Loader2 } from "lucide-react";
import CounselTable from "@/components/dashboard/admin/manageCounsel/CounselTable";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

const AddCounselModal = nextDynamic(
  () => import("@/components/dashboard/admin/manageCounsel/AddCounsel"),
  { ssr: false }
);
const EditCounselModal = nextDynamic(
  () => import("@/components/dashboard/admin/manageCounsel/EditCounsel"),
  { ssr: false }
);
const DeleteCounselModal = nextDynamic(
  () => import("@/components/dashboard/admin/manageCounsel/DeleteCounselModal"),
  { ssr: false }
);

const ManageCounselPage = () => {
  const {
    counsel: counsels,
    openAddModal,
    fetchCounsels,
    isLoading,
    lastAddedCounsel,
    setLastAddedCounsel
  } = useCounselStore();

  useEffect(() => {
    fetchCounsels();
  }, [fetchCounsels]);

  const handleSendInvitation = () => {
    toast.info("Invitation Sent!", {
      description: "Email invitation has been sent to the newly added counsel."
    });
    setLastAddedCounsel(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Counsel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Add and manage legal professionals within your firm.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Counsel
        </Button>
      </div>

      {lastAddedCounsel && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-8 flex justify-between items-center rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-bold">Transaction Successful</span>
              <p className="text-sm opacity-90">
                {lastAddedCounsel.name} has been added to your firm.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setLastAddedCounsel(null)}
              variant="ghost"
              size="sm"
              className="text-green-700 hover:bg-green-100"
            >
              Dismiss
            </Button>
            <Button
              onClick={handleSendInvitation}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Send Email Invitation
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50/50 border-2 border-dashed rounded-2xl">
          <Loader2 className="h-10 w-10 text-violet-600 animate-spin mb-4" />
        </div>
      ) : counsels.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
          {/* Icon */}
          <User className="h-16 w-16 text-purple-700 mb-4" />

          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            Add Counsel
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-sm">
            Add and manage legal professionals within your firm.
          </p>

          {/* Add Counsel Button */}
          <Button
            onClick={openAddModal}
            className="bg-[#6f42c1] hover:bg-[#5a369e] text-white px-6 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Counsel
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <CounselTable />
        </div>
      )}

      <AddCounselModal />
      <EditCounselModal />
      <DeleteCounselModal />
    </div>
  );
};

export default ManageCounselPage;
