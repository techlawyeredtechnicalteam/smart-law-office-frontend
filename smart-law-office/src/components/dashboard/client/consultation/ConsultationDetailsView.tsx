"use client";

import React, { useEffect, useState } from "react";
// import { ConsultService } from "@/lib/consultService";
import {
  ConsultationDetails,
  ConsultationStatus
} from "@/types/Consultation.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ClipboardCopy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for status badge (reused from Dashboard)
const StatusBadge = ({ status }: { status: ConsultationStatus }) => {
  // ... (replicate the StatusBadge logic from the Dashboard component)
  let className = "";
  switch (status) {
    case "Scheduled":
      className = "bg-blue-100 text-blue-600 border-blue-200";
      break;
    case "Pending":
      className = "bg-yellow-100 text-yellow-600 border-yellow-200";
      break;
    case "Completed":
      className = "bg-green-100 text-green-600 border-green-200";
      break;
  }
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-semibold rounded-full border",
        className
      )}
    >
      {status}
    </span>
  );
};

interface ConsultationDetailsViewProps {
  consultCode: string; // The ID of the consultation to view
  onBack: () => void;
}

export function ConsultationDetailsView({
  consultCode,
  onBack
}: ConsultationDetailsViewProps) {
  const [details, setDetails] = useState<Partial<ConsultationDetails> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // MOCK DATA for testing the UI rendering
  const MOCK_DETAILS: ConsultationDetails = {
    consultationId: "CSL-00123",
    clientName: "Christine Adeola",
    caseType: "Contract Review",
    status: "Scheduled",
    meetingDate: "2025-12-25", // Replace with a current date format
    meetingTime: "10:00 AM", // Replace with a current time format
    notesSummary: "Discussed contract terms and next steps.",
    date: "Dec 25, 2025", // Use your desired display format
    time: "10:00 AM",
    platform: "Zoom",
    paymentBank: "First Bank",
    paymentAccountName: "Law Firm PLLC",
    paymentAccountNumber: "3012345678",
    fullNotes:
      "The client requested a comprehensive review of their service agreement...\n\n- Key issues identified: Termination clause and indemnity limits.\n- Advised a renegotiation strategy.",
    immediateActions: [
      "Draft redlines for Clause 4 and 9.",
      "Schedule follow-up call with opposing counsel.",
      "Prepare client memo on risk."
    ]
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        // const data = await ConsultService.getConsultationDetails(consultCode);
        // setDetails(data);
        setDetails(MOCK_DETAILS);
      } catch (error) {
        console.error("Failed to fetch consultation details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [consultCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Show a toast/notification for successful copy
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading consultation details...
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-8 text-center text-red-500">
        Consultation not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header and Action Button */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <h1 className="text-2xl font-bold">Consultation Details</h1>
        </div>
        <Button className="bg-[#6f42c1] hover:bg-[#5a369e]">
          Convert to Case
        </Button>
      </div>

      {/* Key Metadata Table */}
      <div className="grid grid-cols-6 text-sm py-4 border-b">
        {[
          "Consultation Id",
          "Client Name",
          "Status",
          "Date",
          "Time",
          "Platform"
        ].map((label, index) => (
          <div key={label} className="p-2">
            <p className="text-gray-500 font-medium">{label}</p>
            <p className="font-semibold text-gray-800 mt-1">
              {index === 0 && details.consultationId}
              {index === 1 && details.clientName}
              {index === 2 && (
                <StatusBadge
                  status={(details.status as ConsultationStatus) || "Scheduled"}
                />
              )}
              {index === 3 && details.date}
              {index === 4 && details.time}
              {index === 5 && details.platform}
            </p>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Notes</h2>
        <div className="space-y-6">
          {/* Main Consultation Notes */}
          <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-line text-sm text-gray-700">
            {details.fullNotes}
          </div>

          {/* Immediate Action Items */}
          <div>
            <h3 className="text-lg font-bold mb-2">Immediate action items:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {details.immediateActions?.map((action, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-xl font-bold mb-3">Payment Details</h2>
        <div className="grid grid-cols-3 gap-4 text-sm max-w-xl">
          {["Bank Name", "Account Name", "Account Number"].map(
            (label, index) => (
              <div key={label} className="p-2 border rounded-lg bg-white">
                <p className="text-gray-500">{label}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-semibold text-gray-800">
                    {index === 0 && details.paymentBank}
                    {index === 1 && details.paymentAccountName}
                    {index === 2 && details.paymentAccountNumber}
                  </p>
                  {index === 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleCopy(details.paymentAccountNumber || "")
                      }
                      aria-label="Copy account number"
                    >
                      <ClipboardCopy className="h-4 w-4 text-[#6f42c1]" />
                    </Button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
