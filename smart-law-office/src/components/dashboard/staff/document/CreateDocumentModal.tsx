import { CreateModal } from "@/components/shared/CreateModal";
import React from "react";
import { AddDocumentModal } from "./AddDocumentModal";
import { useDocumentStore } from "@/store/documentStore";

export function CreateDocumentModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setIsSuccessModalOpen } = useDocumentStore();

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
