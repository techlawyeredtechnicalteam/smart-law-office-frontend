"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Button } from "@/components/ui/button"; // Placeholder
import { Plus, User, CheckCircle } from "lucide-react";
import CounselTable from "@/components/dashboard/admin/manageCounsel/CounselTable";
import AddCounselModal from "@/components/dashboard/admin/manageCounsel/AddCounsel";
import EditCounselModal from "@/components/dashboard/admin/manageCounsel/EditCounsel";
import DeleteCounselModal from "@/components/dashboard/admin/manageCounsel/DeleteCounselModal";
import { toast } from "sonner";
import React from "react";
import UpgradeToProModal from "@/components/dashboard/admin/manageCounsel/UpgradeProModal";
import { CreateCounselModal } from "@/components/dashboard/admin/manageCounsel/CreateCounselModal";

const ManageCounselPage = () => {
  const {
    counsel,
    openAddModal,
    fetchCounsels,
    isLoading,
    lastAddedCounsel,
    setLastAddedCounsel
  } = useCounselStore();

  React.useEffect(() => {
    fetchCounsels();
  }, []);

  const handleSendInvitation = () => {
    toast.info("Invitation Sent!", {
      description: "Email invitation has been sent to the newly added counsel."
    });
    setLastAddedCounsel(null);
  };

  const showEmptyState = !isLoading && counsel.length === 0;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Counsel</h1>
        <Button
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Counsel
        </Button>
      </div>

      {/* SUCCESS NOTIFICATION BANNER (managecounselnoti.png) */}
      {lastAddedCounsel && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 flex justify-between items-center rounded-lg shadow-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
            <span className="font-medium">Counsel Added!</span>
            <p className="ml-2 text-sm">
              You have successfully added a new counsel to your team.
            </p>
          </div>
          <Button
            onClick={handleSendInvitation}
            className="bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Send Email Invitation
          </Button>
        </div>
      )}

      <div className="p-6">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4"></div>
            <p className="text-gray-500">Loading counsels...</p>
          </div>
        ) : showEmptyState ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
            {/* Icon */}
            <User className="h-16 w-16 text-purple-600 mb-4" />
            {/* Heading */}
            <h2 className="text-2xl font-semibold mb-3">Case</h2>
            {/* Descritption */}
            <p className="text-gray-800 mb-4 max-w-sm">
              No Counsel has been added yet. Add a counsel to begin manage your
              legal team.
            </p>
            <Button
              onClick={openAddModal}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Counsel
            </Button>
          </div>
        ) : (
          <CounselTable />
        )}
      </div>

      {/* Modals */}
      <UpgradeToProModal />
      <AddCounselModal />
      <EditCounselModal />
      <DeleteCounselModal />
    </>
  );
};

export default ManageCounselPage;
