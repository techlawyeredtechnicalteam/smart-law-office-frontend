"use client";

import { useState } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableModal, TableColumn } from "@/components/shared/TableModal";

export function AssignedCasesTable() {
  const { assignedCases } = useAssignStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter assigned cases based on search query
  const filteredCases = assignedCases.filter(
    (ac) =>
      ac.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.counselName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: TableColumn<(typeof assignedCases)[0]>[] = [
    {
      key: "case-client",
      header: "Case/Client",
      headerClassName: "rounded-l-lg",
      render: (item) => (
        <div>
          <div className="font-bold text-gray-900">{item.caseId}</div>
          <div className="text-gray-500 text-xs">{item.clientName}</div>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (item) => <div className="text-gray-700">{item.caseType}</div>
    },
    {
      key: "dateTime",
      header: "Date/Time",
      render: (item) => <div className="text-gray-700">{item.dateTime}</div>
    },
    {
      key: "lawyer",
      header: "Lawyer",
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.counselName}</div>
          <div className="text-gray-500 text-xs">{item.counselSpecialty}</div>
        </div>
      )
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "rounded-r-lg text-right",
      cellClassName: "text-right",
      render: () => (
        <Button
          variant="outline"
          size="sm"
          className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
        >
          View Case
        </Button>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      {/* Header */}
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

      {/* Table or Empty State */}
      {filteredCases.length === 0 && assignedCases.length === 0 ? (
        <EmptyState />
      ) : filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Briefcase className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500">No cases match your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TableModal
            data={filteredCases}
            columns={columns}
            emptyMessage="No assigned cases yet"
            getRowKey={(item) => item.id}
          />
        </div>
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
