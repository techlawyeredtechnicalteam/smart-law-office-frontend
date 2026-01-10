import { CreateModal } from "@/components/shared/CreateModal";
import React from "react";
import { AddDocumentModal } from "./AddDocumentModal";

interface CreateDocumentModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function CreateDocumentModal({
  setSuccessOpen
}: CreateDocumentModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setSuccessOpen(true);
  };

  return (
    <CreateModal
      triggerText="+ Upload Document"
      modalTitle="Upload Document"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      triggerClassName="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
    >
      <AddDocumentModal />
    </CreateModal>
  );
}
