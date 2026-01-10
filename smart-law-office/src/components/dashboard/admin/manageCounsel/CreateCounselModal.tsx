import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
// import CreateCaseForm from "./CreateCaseForm";
import React from "react";
import { Button } from "../../../ui/button";
import AddCounselModal from "./AddCounsel";

interface CreateCaseModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function CreateCounselModal({
  isSuccessOpen,
  setSuccessOpen
}: CreateCaseModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setSuccessOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          + Create Counsel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Case</DialogTitle>
        </DialogHeader>
        <AddCounselModal />
      </DialogContent>
    </Dialog>
  );
}
