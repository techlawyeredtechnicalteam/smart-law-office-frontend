"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Button } from "@/components/ui/button";
import { Plus, User, CheckCircle, ShieldAlert } from "lucide-react";
import CounselTable from "@/components/dashboard/admin/manageCounsel/CounselTable";
import AddCounselModal from "@/components/dashboard/admin/manageCounsel/AddCounsel";
import EditCounselModal from "@/components/dashboard/admin/manageCounsel/EditCounsel";
import DeleteCounselModal from "@/components/dashboard/admin/manageCounsel/DeleteCounselModal";
import { toast } from "sonner";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import UpgradeToProModal from "@/components/dashboard/admin/manageCounsel/UpgradeProModal";

const ManageCounselPage = () => {
  const {
    counsel,
    openAddModal,
    fetchCounsels,
    isLoading,
    lastAddedCounsel,
    setLastAddedCounsel
  } = useCounselStore();
  const { user } = useAuthStore();
  // const hasPlan = (user as any)?.subscriptionStatus === "ACTIVE";

  const hasPlan =
    (user as any)?.subscriptionStatus?.toLowerCase() === "active" ||
    (user as any)?.isPro === true ||
    (user as any)?.plan === "ACTIVE";

  React.useEffect(() => {
    if (hasPlan) {
      fetchCounsels();
    }
  }, [fetchCounsels, hasPlan]);

  const handleSendInvitation = () => {
    toast.info("Invitation Sent!", {
      description: "Email invitation has been sent to the newly added counsel."
    });
    setLastAddedCounsel(null);
  };

  // const showEmptyState = !isLoading && counsel.length === 0;

  // Always show the Manage Counsel page for admins (temporary change)
  if (!hasPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-violet-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Manage Your Team</h1>
        <p className="text-gray-500 max-w-md mb-8">
          The ability to add, manage, and assign cases to counsel members is
          reserved for Pro and Basic plan subscribers.
        </p>
        <Button
          onClick={openAddModal} // This will trigger the UpgradeModal because hasPlan is false
          className="bg-violet-600 hover:bg-violet-700 h-12 px-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Counsel Member
        </Button>
        <UpgradeToProModal />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Counsel</h1>
        <Button onClick={openAddModal} className="bg-violet-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Counsel
        </Button>
      </div>

      {/* Success Notification after adding counsel */}
      {lastAddedCounsel && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 flex justify-between items-center rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
            <div>
              <span className="font-bold">Counsel Added!</span>
              <p className="text-sm">
                You have successfully added {lastAddedCounsel.name}.
              </p>
            </div>
          </div>
          <Button
            onClick={handleSendInvitation}
            size="sm"
            className="bg-green-600"
          >
            Send Email Invitation
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse text-violet-600">
          <div className="h-8 w-8 border-4 border-t-transparent border-violet-600 rounded-full animate-spin mb-4" />
          <p>Loading counsels...</p>
        </div>
      ) : counsel.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-2xl bg-gray-50">
          <User className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No counsel members found.</p>
          <p className="text-sm text-gray-400">
            Click "Add Counsel" to start building your team.
          </p>
        </div>
      ) : (
        <CounselTable />
      )}

      <UpgradeToProModal />
      <AddCounselModal />
      <EditCounselModal />
      <DeleteCounselModal />
    </div>
  );
};

export default ManageCounselPage;
