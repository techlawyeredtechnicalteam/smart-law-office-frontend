"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCaseStore, Case } from "@/store/createCase";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteCaseFormProps {
  caseData: Case;
  onSuccess: () => void;
  onClose: () => void;
}

const DeleteCaseForm = ({
  caseData,
  onSuccess,
  onClose
}: DeleteCaseFormProps) => {
  const { executeDelete, isLoading } = useCaseStore();

  const handleDelete = async () => {
    const success = await executeDelete(caseData.caseCode);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="p-4 text-center">
      <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-red-600 h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold">Delete Case</h3>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to delete case{" "}
        <strong>{caseData.caseCode}</strong>? This action cannot be undone.
      </p>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Delete Case"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DeleteCaseForm;
