// components/dashboard/client/consultation/ConsultationEmptyState.tsx
import React from "react";
import { TbUserScreen } from "react-icons/tb";
import { Button } from "@/components/ui/button";

interface ConsultationEmptyStateProps {
  onBookConsultation: () => void;
}

export function ConsultationEmptyState({
  onBookConsultation
}: ConsultationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
      {/* Icon */}
      <TbUserScreen className="h-16 w-16 text-purple-700 mb-4" />

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Book Consultation
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-sm">
        Consultation will appear here. Set up a consultation to manage client
        meetings and sync your availability.
      </p>

      {/* Book Consultation Button */}
      <Button
        onClick={onBookConsultation}
        className="bg-[#6f42c1] hover:bg-[#5a369e] text-white px-6 py-3"
      >
        Book Consultation
      </Button>
    </div>
  );
}
