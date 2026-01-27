"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useSubscriptionStore } from "@/store/subscriptionStore";
//
const UpgradeToProModal = () => {
  const router = useRouter();
  const { isUpgradeModalOpen, closeUpgradeModal } = useCounselStore();

  const { selectPlan } = useSubscriptionStore();

  const handleUpgrade = () => {
    // Tell the sub system the user wants to upgrade to Pro
    selectPlan("PRO");

    // redirect to subscription page
    router.push("/subscribe?reason=add_counsel");

    // clean up
    closeUpgradeModal();
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="sm:max-w-[400px] text-center p-8">
        {/* Accessibility Requirements */}
        <DialogTitle className="text-xl font-bold">Upgrade to Pro</DialogTitle>

        <div className="flex justify-center my-4">
          <div className="rounded-full h-16 w-16 bg-violet-100 flex items-center justify-center animate-pulse">
            <Zap className="w-8 h-8 text-violet-600 fill-violet-600" />
          </div>
        </div>

        <DialogDescription className="text-gray-500 mb-6 text-center text-sm">
          Adding and managing counsel requires the purchase of a seat on a Basic
          or Pro subscription. Upgrade your plan to expand your legal team.
        </DialogDescription>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={closeUpgradeModal}
            className="text-gray-500"
          >
            Maybe Later
          </Button>
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-700 relative px-8"
            onClick={handleUpgrade}
          >
            Upgrade Now
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white shadow-sm">
              T
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeToProModal;
