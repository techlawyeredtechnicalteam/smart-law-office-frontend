"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import React from "react";

const DeleteCounselModal = () => {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedCounsel,
    deleteCounsel,
    isLoading
  } = useCounselStore();

  const handleDelete = async () => {
    if (!selectedCounsel) return;

    try {
      await deleteCounsel(selectedCounsel.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent className="sm:max-w-[425px] text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">
          Are you sure you want to remove this Counsel?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          You are about to permanently remove the counsel below. This action is
          irreversible.
        </p>

        {/* Counsel Info Box */}
        {selectedCounsel && (
          <div className="bg-violet-50 p-3 rounded-lg inline-block mb-6 border border-violet-200">
            <p className="font-bold text-lg text-violet-800">
              {selectedCounsel.fullName}
            </p>
            <p className="text-sm text-violet-600">SCN-{selectedCounsel.scn}</p>
          </div>
        )}

        <p className="text-xs text-red-600 mb-6 font-medium">
          This will result in the immediate loss of their access to all cases,
          documents and communications.
        </p>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={closeDeleteModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCounselModal;
