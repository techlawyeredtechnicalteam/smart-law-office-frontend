"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import React from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm
}: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] border-none">
        <DialogHeader className="flex flex-col items-center justify-center pt-4">
          <div className="bg-red-50 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 pt-2">
            Are you sure you want to delete your account? This action is
            <span className="text-red-600 font-semibold"> permanent</span> and
            all your case data will be lost.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-800 hover:bg-transparent font-medium order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-11 order-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Anyway"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
