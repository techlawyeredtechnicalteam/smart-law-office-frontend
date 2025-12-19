// src/components/manage-counsel/DeleteCounselModal.tsx

import { UseCounselStore } from "@/store/manageCounsel";
import { Dialog, DialogContent } from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { User, Save } from "lucide-react";
import React from "react";

const DeleteCounselModal = () => {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedCounsel,
    deleteCounsel,
    isSubmitting
  } = UseCounselStore();

  const handleDelete = async () => {
    if (selectedCounsel) {
      await deleteCounsel(selectedCounsel.id);
    }
  };

  if (!selectedCounsel) return null;

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent className="sm:max-w-md text-center p-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full h-16 w-16 bg-yellow-100 flex items-center justify-center">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">
          Are you sure you want to remove this Counsel?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          You are about to permanently remove the counsel below. This action is
          irreversible.
        </p>

        <div className="bg-gray-100 p-3 rounded-lg inline-block mb-6">
          <p className="font-bold text-lg">{selectedCounsel.fullName}</p>
          <p className="text-sm text-gray-600">{selectedCounsel.scn}</p>
        </div>

        <p className="text-xs text-red-600 mb-6">
          This will result in the immediate loss of their access to all cases,
          documents and communications. Their assigned cases will need to be
          reassigned.
        </p>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={closeDeleteModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
<Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Removing..." : "Remove Counsel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCounselModal;
