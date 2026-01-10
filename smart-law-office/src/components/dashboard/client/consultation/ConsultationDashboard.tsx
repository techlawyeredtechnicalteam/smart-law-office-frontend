"use client";

import React, { useEffect, useState } from "react";
import useConsultationStore from "@/store/consultationStore";
import { Consultation, ConsultationStatus } from "@/types/Consultation.schema";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConsultationEmptyState } from "./ConsultationEmptyState";
import { TableColumn, TableModal } from "@/components/shared/TableModal";

// Helper function to render status badge
const StatusBadge = ({ status }: { status: ConsultationStatus }) => {
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

// Helper function to get initials for the Avatar
const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0][0];
};

interface ConsultationDashboardProps {
  onBookConsultation: () => void;
  onViewDetails: (id: string) => void;
}

export function ConsultationDashboard({
  onBookConsultation,
  onViewDetails
}: ConsultationDashboardProps) {
  const { consultations, setConsultations } = useConsultationStore();
  const [isLoading, setIsLoading] = useState(true);

  // Check if there are no consultations
  const hasNoConsultations = consultations.length === 0;

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // const data = await ConsultService.getConsultations();
        // setConsultations(data);
        // For now, simulate loading
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // If the store is empty, fetch data. This prevents re-fetching after a new booking.
    if (consultations.length === 0) {
      fetchConsultations();
    } else {
      setIsLoading(false);
    }
  }, [setConsultations, consultations.length]);

  // Define table columns configuration
  const columns: TableColumn<Consultation>[] = [
    {
      key: "consultationId",
      header: "Consultation Id",
      headerClassName:
        "w-[100px] bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "font-medium text-[#6f42c1]",
      render: (consult) => consult.consultationId
    },
    {
      key: "clientName",
      header: "Client Name",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-purple-100">
            <AvatarFallback className="text-sm bg-purple-200 text-[#6f42c1]">
              {getInitials(consult.clientName)}
            </AvatarFallback>
          </Avatar>
          <span>{consult.clientName}</span>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => consult.caseType
    },
    {
      key: "status",
      header: "Status",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => <StatusBadge status={consult.status} />
    },
    {
      key: "meeting",
      header: "Meeting",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "text-gray-600",
      render: (consult) => `${consult.meetingDate} ${consult.meetingTime}`
    },
    {
      key: "notes",
      header: "Notes",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "max-w-[200px] truncate text-gray-600",
      render: (consult) => consult.notesSummary
    },
    {
      key: "action",
      header: "Action",
      headerClassName:
        "text-right w-[100px] bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "text-right",
      render: (consult) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(consult.consultationId)}
          className="text-[#6f42c1] hover:bg-purple-100"
        >
          View <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      )
    }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="text-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          Loading consultations...
        </div>
      </div>
    );
  }

  // / Show empty state when there are no consultations
  if (hasNoConsultations) {
    return <ConsultationEmptyState onBookConsultation={onBookConsultation} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Consultation</h2>
        <Button
          onClick={onBookConsultation}
          className="bg-[#6f42c1] hover:bg-[#5a369e] text-white font-semibold flex items-center"
        >
          + Book a Consultation
        </Button>
      </div>

      <div className="overflow-x-auto">
        <TableModal
          data={consultations}
          columns={columns}
          getRowKey={(consult) => consult.consultationId}
          containerClassName="min-w-full hover:bg-purple-50 transition-colors"
          emptyMessage="No consultations found"
        />
      </div>
    </div>
  );
}
