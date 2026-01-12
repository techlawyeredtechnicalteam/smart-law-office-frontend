"use client";

import { useState } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useCaseStore } from "@/store/createCase";

export function AssignedCasesTable() {
  // const { assignedCases } = useAssignStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { cases, caseTypes } = useCaseStore();

  // 1. Filter for cases that have any indication of staff assignment
  const assignedCases = cases.filter((c) => {
    // Check every possible field the backend might use for assignment
    return !!c.staffEmail || !!(c as any).staffId || !!(c as any).staffName;
  });

  // 2. Refined Search Logic
  const filteredCases = assignedCases.filter((ac) => {
    const search = searchQuery.toLowerCase();
    const typeName =
      caseTypes.find((t) => t.caseTypeId === ac.caseTypeId)?.name || "";

    return (
      (ac.caseCode || "").toLowerCase().includes(search) ||
      ac.id.toLowerCase().includes(search) ||
      ac.clientName.toLowerCase().includes(search) ||
      typeName.toLowerCase().includes(search) ||
      (ac.staffEmail || "").toLowerCase().includes(search)
    );
  });

  const columns: TableColumn<(typeof assignedCases)[0]>[] = [
    // {
    //   key: "case-client",
    //   header: "Case/Client",
    //   headerClassName: "rounded-l-lg",
    //   render: (item) => (
    //     <div>
    //       <div className="font-bold text-gray-900">{item.caseId}</div>
    //       <div className="text-gray-500 text-xs">{item.clientName}</div>
    //     </div>
    //   )
    // },
    // {
    //   key: "caseType",
    //   header: "Case Type",
    //   render: (item) => <div className="text-gray-700">{item.caseType}</div>
    // },
    // {
    //   key: "dateTime",
    //   header: "Date/Time",
    //   render: (item) => <div className="text-gray-700">{item.dateTime}</div>
    // },
    {
      key: "case-client",
      header: "Case/Client",
      render: (item) => (
        <div>
          <div className="font-bold text-gray-900">
            {item.id && item.id !== "UNKNOWN"
              ? item.id.slice(-8).toUpperCase()
              : "PENDING"}
          </div>
          <div className="text-gray-500 text-xs">{item.clientName}</div>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (item) => {
        const type = caseTypes.find((t) => t.caseTypeId === item.caseTypeId);
        return (
          <div className="text-gray-700">{type?.name || "Standard Case"}</div>
        );
      }
    },
    {
      key: "dateTime",
      header: "Assigned To",
      render: (item) => (
        <div className="text-xs text-purple-600 font-medium">
          {item.staffEmail || "Not Specified"}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border font-medium">
          {item.status}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: () => (
        <Button
          variant="outline"
          size="sm"
          className="bg-purple-50 text-purple-700"
        >
          View Case
        </Button>
      )
    },
    {
      key: "assignedTo", // Changed key to be unique
      header: "Assigned To",
      render: (item) => (
        <div className="flex flex-col">
          <div className="text-sm text-purple-700 font-semibold">
            {item.staffEmail || "Staff Member"}
          </div>
          {(item as any).staffId && !item.staffEmail && (
            <div className="text-[10px] text-gray-400 font-mono">
              ID: {(item as any).staffId.slice(-6)}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Assigned Cases</h2>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-50 border-none h-9 text-sm"
          />
        </div>
      </div>

      {assignedCases.length === 0 ? (
        <EmptyState />
      ) : (
        <TableModal
          data={filteredCases}
          columns={columns}
          emptyMessage="No cases match your search."
          getRowKey={(item, index) => item.id || `assigned-${index}`}
        />
      )}
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="bg-purple-50 p-4 rounded-full mb-3">
        <Briefcase className="h-8 w-8 text-purple-500" />
      </div>
      <h3 className="text-lg font-bold">No assigned cases yet</h3>
      <p className="text-gray-500 text-sm">
        Assign a case above to see it listed here.
      </p>
    </div>
  );
}
