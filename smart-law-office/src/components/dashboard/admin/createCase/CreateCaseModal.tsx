import { CreateModal } from "@/components/shared/CreateModal";
import CreateCaseForm from "./CreateCaseForm";
import React from "react";

interface CreateCaseModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function CreateCaseModal({ setSuccessOpen }: CreateCaseModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setIsOpen(false);
    setSuccessOpen(true);
  };

  return (
    <CreateModal
      triggerText="+ Create Case"
      modalTitle="Create Case"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      triggerClassName="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
    >
      <CreateCaseForm
        onSuccess={handleFormSuccess}
        onClose={() => setIsOpen(false)}
      />
    </CreateModal>
  );
}
