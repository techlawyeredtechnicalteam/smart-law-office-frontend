"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CaseSuccessModal({ isOpen, onClose }: CaseSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold leading-6 text-gray-900 mt-3">
          Case Created
        </h3>
        <p className="text-sm text-gray-500">
          Your case is now active. You can now begin managing documents,
          parties, and case activities.
        </p>
        <div className="mt-5 sm:mt-6">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
