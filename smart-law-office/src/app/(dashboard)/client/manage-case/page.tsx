"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCaseStore } from "@/store/createCase";
import useConsultationStore, { Consultation } from "@/store/consultationStore";
import { TableModal, TableColumn } from "@/components/shared/TableModal"; // Adjust path as needed
import Link from "next/link";
import { format } from "date-fns";
import { TbUserScreen } from "react-icons/tb";

const MyCasePage = () => {
  const { cases, fetchCases, isLoading: casesLoading } = useCaseStore();
  const {
    consultations,
    fetchConsultations,
    isLoading: consultLoading,
    openBooking
  } = useConsultationStore();

  useEffect(() => {
    // fetchCases();
    fetchConsultations();
  }, [fetchConsultations]);

  const getStatusColor = (status: string = "") => {
    const s = status.toLowerCase();
    if (s.includes("scheduled") || s.includes("progress"))
      return "bg-blue-100 text-blue-700";
    if (s.includes("completed")) return "bg-green-100 text-green-700";
    if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("cancel")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  // ✅ Consultation Columns Definition
  const consultationColumns = useMemo<TableColumn<Consultation>[]>(
    () => [
      {
        key: "id",
        header: "Consultation ID",
        render: (item) => {
          const suffix = item.id
            ? item.id.slice(-4).toUpperCase()
            : Math.floor(1000 + Math.random() * 9000);
          return `#2026-${suffix}`;
        }
      },
      { key: "type", header: "Case Type", render: () => "Family Law" },
      {
        key: "status",
        header: "Status",
        render: (item) => (
          <Badge className={getStatusColor(item.status)} variant="secondary">
            {item.status || "Pending"}
          </Badge>
        )
      },
      {
        key: "meeting",
        header: "Meeting",
        render: (item) =>
          item.consultAt
            ? format(new Date(item.consultAt), "yyyy-MM-dd HH:mm")
            : "---"
      },
      {
        key: "note",
        header: "Notes",
        cellClassName: "max-w-[200px] truncate",
        render: (item) => item.note || "No notes"
      },
      {
        key: "action",
        header: "Action",
        headerClassName: "text-right",
        cellClassName: "text-right",
        render: (consult) => (
          <Link href={`/client/consultations/${consult.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        )
      }
    ],
    []
  );

  // ✅ Case Columns Definition
  const caseColumns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: "id",
        header: "Case ID",
        render: (item) => (
          <span className="font-medium">
            #{item.id ? String(item.id).slice(-8).toUpperCase() : "N/A"}
          </span>
        )
      },
      {
        key: "type",
        header: "Case Type",
        render: (item) => item.caseType || "General"
      },
      {
        key: "status",
        header: "Status",
        render: (item) => (
          <Badge className={getStatusColor(item.status)} variant="secondary">
            {item.status}
          </Badge>
        )
      },
      {
        key: "document",
        header: "Document",
        render: (item) =>
          item.documents?.[0] ? (
            <span className="flex items-center text-purple-600 text-sm italic">
              📄 {item.documents[0].name.slice(0, 15)}...
            </span>
          ) : (
            "---"
          )
      },
      {
        key: "notes",
        header: "Notes",
        cellClassName: "max-w-[200px] truncate",
        render: (item) => item.notes || "---"
      },
      {
        key: "action",
        header: "Action",
        headerClassName: "text-right",
        cellClassName: "text-right",
        render: (item) => (
          <Link href={`/dashboard/client/manage-cases/${item.id}`}>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Link>
        )
      }
    ],
    []
  );

  if (
    !casesLoading &&
    !consultLoading &&
    cases.length === 0 &&
    consultations.length === 0
  ) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex flex-col items-center justify-center p-16 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
          <TbUserScreen className="h-16 w-16 text-purple-700 mb-4" />
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">My Case</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Cases and Consultations will appear here. Set up a consultation to
            manage meetings.
          </p>
          <Button
            onClick={openBooking}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Book First Consultation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* SECTION: CONSULTATIONS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Consultations</h2>
          <Button
            onClick={openBooking}
            className="bg-purple-600 hover:bg-purple-700"
          >
            + Book a Consultation
          </Button>
        </div>
        <TableModal
          data={consultations}
          columns={consultationColumns}
          emptyMessage="No consultations found"
          containerClassName="bg-white rounded-xl shadow-sm border overflow-hidden"
          getRowKey={(item) => item.id || (item as any)._id || Math.random()}
        />
      </section>

      {/* SECTION: CASES */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cases</h2>
        <TableModal
          data={cases}
          columns={caseColumns}
          emptyMessage="No active cases found"
          containerClassName="bg-white rounded-xl shadow-sm border overflow-hidden"
          getRowKey={(item) => item.id || Math.random()}
        />
      </section>
    </div>
  );
};

export default MyCasePage;
