"use client";

import { UseCounselStore } from "@/store/manageCounsel";
import { Button } from "@/components/shared/ui/button"; // Placeholder
import { Plus, User, CheckCircle } from "lucide-react";
import CounselTable from "@/components/admin/manageCounsel/CounselTable";
import AddCounselModal from "@/components/admin/manageCounsel/AddCounsel";
import EditCounselModal from "@/components/admin/manageCounsel/EditCounsel";
import DeleteCounselModal from "@/components/admin/manageCounsel/DeleteCounselModal";
import { toast } from "sonner";
import React from "react";
import { fetchCounsel } from "@/app/api/signup.api";

const ManageCounselPage = () => {
  const { counsel, openAddModal, fetchCounsels, isLoading } = UseCounselStore();

  React.useEffect(() => {
    fetchCounsels();
  }, []);

  // const handleSendInvitation = () => {
  //   toast.info("Invitation Sent!", {
  //     description: "Email invitation has been sent to the newly added counsel."
  //   });
  //   // In a real app, you'd trigger an API call here.
  // };

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
          Add New Counsel
        </Button>
      </div>

<div className="bg-white p-6 rounded-xl shadow-lg">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4"></div>
            <p className="text-gray-500">Loading counsels...</p>
          </div>
        ) : showEmptyState ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-20 bg-violet-50/50 rounded-lg border-2 border-dashed border-violet-200">
            <User className="w-12 h-12 text-violet-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Manage Counsel</h2>
            <p className="text-gray-500 mb-6 text-center">
              No counsels have been added yet. Add a counsel to begin managing
              your legal team.
            </p>
            <Button
              onClick={openAddModal}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Counsel
            </Button>
          </div>
        ) : (
          <CounselTable />
        )}
      </div>

      {/* Modals */}
      <AddCounselModal />
      <EditCounselModal />
      <DeleteCounselModal />
    </>
  );
};

export default ManageCounselPage;
