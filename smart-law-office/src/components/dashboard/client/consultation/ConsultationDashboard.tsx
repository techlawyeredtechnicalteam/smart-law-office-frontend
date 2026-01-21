"use client";

import React, { useEffect, useState } from "react";
import useConsultationStore from "@/store/consultationStore";
import { ConsultationStatus } from "@/types/Consultation.schema";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConsultationEmptyState } from "./ConsultationEmptyState";
import { TableColumn, TableModal } from "@/components/shared/TableModal";

// Helper function to render status badge
const StatusBadge = ({ status }: { status: ConsultationStatus }) => {
  const styles: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-600 border-blue-200",
    Pending: "bg-yellow-100 text-yellow-600 border-yellow-200",
    Completed: "bg-green-100 text-green-600 border-green-200"
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border",
        styles[status] || styles.Pending
      )}
    >
      {status}
    </span>
  );
};

// Helper for initials
const getInitials = (name?: string): string => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

interface ConsultationDashboardProps {
  onBookConsultation: () => void;
  onViewDetails: (id: string) => void;
}

export function ConsultationDashboard({
  onBookConsultation,
  onViewDetails
}: ConsultationDashboardProps) {
  const {
    consultations,
    fetchConsultations,
    isLoading: storeLoading
  } = useConsultationStore();
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (consultations.length === 0) {
      setInternalLoading(true);
      fetchConsultations().finally(() => setInternalLoading(false));
    }
  }, [fetchConsultations, consultations.length]);

  const loading = internalLoading || storeLoading;

  // Define table columns based on the STORE'S interface
  const columns: TableColumn<any>[] = [
    {
      key: "id",
      header: "Ref Code",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "font-mono font-bold text-[#6f42c1]",
      render: (consult) => consult.id?.slice(-8).toUpperCase() || "N/A"
    },
    {
      key: "client",
      header: "Client",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => {
        const name = consult.clientName || "Current User"; // Adjust based on your API response
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 border border-purple-100">
              <AvatarFallback className="text-[10px] bg-purple-50 text-[#6f42c1] font-bold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-700">{name}</span>
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => <StatusBadge status={consult.status} />
    },
    {
      key: "schedule",
      header: "Schedule",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      render: (consult) => {
        if (!consult.consultAt) return "Not set";
        const date = parseISO(consult.consultAt);
        return (
          <div className="flex flex-col text-[11px]">
            <span className="flex items-center gap-1 font-bold text-gray-900">
              <Calendar className="w-3 h-3 text-gray-400" />{" "}
              {format(date, "MMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3 text-gray-400" />{" "}
              {format(date, "hh:mm a")}
            </span>
          </div>
        );
      }
    },
    {
      key: "note",
      header: "Reason",
      headerClassName:
        "bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "max-w-[180px] truncate text-gray-500 italic text-xs",
      render: (consult) => consult.note || "No notes provided"
    },
    {
      key: "action",
      header: "Action",
      headerClassName:
        "text-right bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
      cellClassName: "text-right",
      render: (consult) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(consult.id)}
          className="text-[#6f42c1] hover:bg-purple-50 hover:text-[#5a369e] font-bold text-xs"
        >
          Details <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6f42c1]"></div>
          <p className="text-gray-500 font-medium">
            Synchronizing consultations...
          </p>
        </div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return <ConsultationEmptyState onBookConsultation={onBookConsultation} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-b border-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Consultations</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage and track your legal appointments
          </p>
        </div>
        <Button
          onClick={onBookConsultation}
          className="bg-[#6f42c1] hover:bg-[#5a369e] text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-purple-100 transition-all active:scale-95"
        >
          + New Booking
        </Button>
      </div>

      <div className="overflow-x-auto">
        <TableModal
          data={consultations}
          columns={columns}
          getRowKey={(consult) => consult.id}
          containerClassName="min-w-full"
          emptyMessage="No consultations found"
        />
      </div>
    </div>
  );
}
