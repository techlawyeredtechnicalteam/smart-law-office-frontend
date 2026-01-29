"use client";

import { useState } from "react";
import { Search, Briefcase, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useCaseStore } from "@/store/createCase";

export function AssignedCasesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { cases, fetchCases, isLoading } = useCaseStore();

  // Filter for cases that have an assigned staff member
  const assignedCases = cases.filter(
    (c) => c.staffEmail && c.staffEmail !== "Unassigned"
  );

  const filteredCases = assignedCases.filter((ac) => {
    const search = searchQuery.toLowerCase().trim();
    if (!search) return true;

    return [
      ac.caseCode,
      ac.clientName,
      ac.caseType,
      ac.staffEmail,
      ac.staffName,
      ac.status
    ];
  });

  const columns: TableColumn<(typeof filteredCases)[0]>[] = [
    {
      key: "case-client",
      header: "Case / Client",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {item.caseCode}
          </span>
          <span className="font-bold text-violet-700">{item.clientName}</span>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Type",
      render: (item) => (
        <span className="text-gray-700 font-medium text-sm">
          {item.caseType}
        </span>
      )
    },
    {
      key: "schedule",
      header: "Assigned Date",
      render: (item) => (
        <div className="flex flex-col text-xs text-gray-600">
          <span>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
          <span className="text-gray-400 italic">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : ""}
          </span>
        </div>
      )
    },
    {
      key: "staff",
      header: "Assigned Counsel",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-[10px] font-bold border border-violet-200">
            {String(item.staffName || item.staffEmail || "S")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-none">
              {item.staffName || item.staffEmail?.split("@")[0]}
            </span>
            <span className="text-[10px] text-gray-400">Counsel</span>
          </div>
        </div>
      )
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-violet-600 hover:bg-violet-50 font-bold"
          onClick={() => console.log("Navigate to Case ID:", item.id)}
        >
          Manage
        </Button>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg">Assigned Cases</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchCases()}
            disabled={isLoading}
            className="h-6 w-6 p-0 text-gray-400 hover:text-violet-600"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cases/staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-50 border-none h-9 text-sm focus-visible:ring-violet-400"
          />
        </div>
      </div>

      {assignedCases.length === 0 ? (
        <EmptyState />
      ) : (
        <TableModal
          data={filteredCases}
          columns={columns}
          emptyMessage="No matching cases found."
          getRowKey={(item) => item.id}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-lg">
      <div className="bg-violet-50 p-4 rounded-full mb-3">
        <Briefcase className="h-8 w-8 text-violet-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">No Assigned Cases</h3>
      <p className="text-gray-500 text-sm">
        Assign a staff member to a case to see it here.
      </p>
    </div>
  );
}
