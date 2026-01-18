import { CreateModal } from "@/components/shared/CreateModal";
import React from "react";
import { BookConsultationForm } from "../consultation/BookConsultForm";

interface CreateCaseModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function CreateCaseModal({ setSuccessOpen }: CreateCaseModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setSuccessOpen(true);
  };

  return (
    <CreateModal
      triggerText="+ Book Consultations"
      modalTitle="Book Consultations"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      triggerClassName="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
    >
      <BookConsultationForm />
    </CreateModal>
  );
}
