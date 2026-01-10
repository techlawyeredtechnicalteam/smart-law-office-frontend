"use client";

import { useState } from "react";
import { AssignedCase } from "@/store/assignCaseStore";
import { CreateModal } from "@/components/shared/CreateModal";
import { AssignCaseForm } from "./AssignFormCase";
import { AssignCaseSuccessModal } from "./AssignCaseSuccessModal";

export function AssignCaseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastAssignedCase, setLastAssignedCase] = useState<AssignedCase | null>(
    null
  );

  const handleSuccess = (assignedCase: AssignedCase) => {
    setLastAssignedCase(assignedCase);
    setIsOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setLastAssignedCase(null);
  };

  return (
    <>
      <CreateModal
        triggerText="+ Assign Case"
        modalTitle="Assign Case"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerClassName="bg-[#7C5CFC] hover:bg-[#6B46C1] whitespace-nowrap"
      >
        <AssignCaseForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </CreateModal>

      <AssignCaseSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        assignedCase={lastAssignedCase}
      />
    </>
  );
}
