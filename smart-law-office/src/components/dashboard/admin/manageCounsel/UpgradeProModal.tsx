"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
//
const UpgradeToProModal = () => {
  const router = useRouter();
  const { isUpgradeModalOpen, closeUpgradeModal } = useCounselStore();

  const handleUpgrade = () => {
    // Logic for handling the actual upgrade process
    router.push("/subscribe");
    //  pass a query param so the subscription page knows the user wants to add counsel specifically
    // router.push("/subscribe?reason=add_counsel")
    console.log("Redirecting for upgrade...");
    closeUpgradeModal();
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="sm:max-w-[425px] text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full h-16 w-16 bg-violet-100 flex items-center justify-center">
            {/* Using a custom icon from the image mockup, but Zap is a good alternative */}
            {/* The image shows a briefcase/subscription icon */}
            <Zap className="w-8 h-8 text-violet-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Upgrade to Pro</h3>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Adding and managing counsel requires the purchase of a seat on a Basic
          or Pro subscription.
        </p>

        <div className="flex justify-center space-x-4">
          <Button type="button" variant="outline" onClick={closeUpgradeModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-700 relative"
            onClick={handleUpgrade}
          >
            Upgrade
            {/* The orange 'T' in the image is likely a tour/tooltip indicator. 
                I'm simulating it with a small badge for visual reference. */}
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
              T
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProModal;
