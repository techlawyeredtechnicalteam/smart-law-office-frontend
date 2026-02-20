"use client";

import React, { useEffect, useState } from "react";
import useConsultationStore from "@/store/consultationStore";
import { ConsultationStatus } from "@/types/Consultation.schema";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConsultationEmptyState } from "./ConsultationEmptyState";
import { TableColumn, TableModal } from "@/components/shared/TableModal";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { BookConsultationForm } from "./BookConsultForm";
import { CreateModal } from "@/components/shared/CreateModal";

// Helper function to render status badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-600 border-yellow-200",
    PROGRESS: "bg-blue-100 text-blue-600 border-blue-200",
    COMPLETED: "bg-green-100 text-green-600 border-green-200"
    // Pending: "bg-yellow-100 text-yellow-600 border-yellow-200"
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border",
        styles[status] || "bg-gray-100 text-gray-600"
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
  onBookConsultation?: () => void;
  onViewDetails?: (id: string) => void;
  isAdminView?: boolean;
}

export function ConsultationDashboard({
  isAdminView
}: {
  isAdminView?: boolean;
}) {
  const {
    consultations,
    fetchConsultations,
    fetchConsultationDirect,
    isLoading: storeLoading
  } = useConsultationStore();
  const { user } = useAuthStore();
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    setInternalLoading(true);
    const loadData = isAdminView ? fetchConsultationDirect : fetchConsultations;

    loadData().finally(() => setInternalLoading(false));
  }, [isAdminView, fetchConsultations, fetchConsultationDirect]);

  const loading = internalLoading || storeLoading;

  const columns: TableColumn<any>[] = React.useMemo(
    () => [
      {
        key: "id",
        header: "Consultation Id",
        render: (consult) =>
          `#${consult.code || consult.id.slice(-6).toUpperCase()}`
      },

      {
        key: "client",
        header: "Client",
        render: (consult) => {
          const name = consult.clientName
            ? consult.clientName
            : !isAdminView && user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`.trim()
              : "Client";

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
        render: (consult) => (
          <Link
            href={
              isAdminView
                ? `/admin/consultations/${consult.id}`
                : `/client/consultations/${consult.id}`
            }
          >
            <Button variant="ghost" size="sm">
              Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )
      },
      {
        key: "note",
        header: "Client Notes",
        render: (consult) => (
          <div className="flex items-start gap-2">
            <FileText className="w-3 h-3 mt-0.5 text-gray-400 shrink-0" />
            <span title={consult.note}>{consult.note}</span>
          </div>
        )
      },
      {
        key: "action",
        header: "Action",
        headerClassName:
          "text-right bg-gray-50 text-gray-600 uppercase text-xs tracking-wider",
        cellClassName: "text-right",
        render: (consult) => (
          <Link href={`/client/consultations/${consult.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#6f42c1] hover:bg-purple-50 hover:text-[#5a369e] font-bold text-xs"
            >
              Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )
      }
    ],
    [user]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6f42c1]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-b border-gray-50">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Consultations</h2>
          <p className="text-xs text-gray-500 mt-1">
            {isAdminView
              ? "Review incoming client bookings"
              : "Manage your legal appointments"}
          </p>
        </div>

        {/* HIDE FOR ADMIN */}
        {!isAdminView && (
          <CreateModal
            triggerText={"+ Book Consultation"}
            modalTitle={"Book Consultation"}
          >
            <BookConsultationForm />
          </CreateModal>
        )}
      </div>

      <div className="overflow-x-auto">
        <TableModal
          data={consultations}
          columns={columns}
          getRowKey={(consult) => consult.id}
          emptyMessage={
            isAdminView
              ? "No client consultations yet."
              : "You haven't booked any consultations."
          }
        />
      </div>
    </div>
  );
}
