import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/shared/ui/dialog";
import CreateCaseForm from "./CreateCaseForm";
import React from "react";
import { Button } from "../../shared/ui/button";

interface CreateCaseModalProps {
  isSuccessOpen: boolean;
  setSuccessOpen: (open: boolean) => void;
}

export function CreateCaseModal({
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
          + Create Case
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Case</DialogTitle>
        </DialogHeader>
        <CreateCaseForm
          onSuccess={handleFormSuccess}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
