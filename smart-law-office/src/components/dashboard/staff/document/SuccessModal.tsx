"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";

export function SuccessModal() {
  const { isSuccessModalOpen, setIsSuccessModalOpen } = useDocumentStore();

  return (
    <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
      <DialogContent className="sm:maxw-[400px] p-8 flex flex-col items-center text-center">
        {/* Success Checkmark Circle */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white border-2 border-green-500 rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-green-500" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Document uploaded
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Your file is now securely saved and attached to your record.
          Everything looks good.
        </p>

        <Button
          onClick={() => setIsSuccessModalOpen(false)}
          className="w-full bg-purple-600 hover:bg-purple-700 h-12 rounded-xl font-bold"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
