"use client";
import { CreateCaseModal } from "@/components/dashboard/client/mycase/CreateCaseModal";
import { TbUserScreen } from "react-icons/tb";
import React from "react";

const MyCasePage = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
        {/* Icon*/}
        <TbUserScreen className="h-16 w-16 text-purple-700 mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">My Case</h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-sm">
          Cases, Consultations will appear here. Set up a consultation to manage
          meetings and sync your availability.
        </p>

        {/* Modal Trigger/Button (Keep your existing component) */}
        <CreateCaseModal
          isSuccessOpen={isSuccessModalOpen}
          setSuccessOpen={setIsSuccessModalOpen}
        />
      </div>
    </div>
  );
};

export default MyCasePage;
