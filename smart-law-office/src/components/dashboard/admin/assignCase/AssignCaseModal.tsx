"use client";

import React, { useState } from "react";
import { AssignedCase } from "@/store/assignCaseStore";
import { CreateModal } from "@/components/shared/CreateModal";
import { AssignCaseForm } from "./AssignFormCase";
import { AssignCaseSuccessModal } from "./AssignCaseSuccessModal";

interface AssignCaseModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function AssignCaseModal({ isSuccessOpen, setSuccessOpen }: AssignCaseModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setIsOpen(false);
    setSuccessOpen(true);
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
        <AssignCaseForm
          onSuccess={handleFormSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </CreateModal>
    </>
  );
}
