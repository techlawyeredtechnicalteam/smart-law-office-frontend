"use client";

import { useState } from "react";
import { useAssignStore } from "@/store/assignCaseStore";
import { Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TableModal, TableColumn } from "@/components/shared/TableModal";

export function UnassignedCasesPanel() {
  const { unassignedCases } = useAssignStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = unassignedCases.filter(
    (c) =>
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: TableColumn<(typeof unassignedCases)[0]>[] = [
    {
      key: "case-client",
      header: "Case/Client",
      render: (item) => (
        <div className="pl-2">
          <div className="font-semibold text-gray-900">{item.id}</div>
          <div className="text-gray-500 text-xs">{item.clientName}</div>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (item) => <div className="text-gray-600">{item.caseType}</div>
    },
    {
      key: "date",
      header: "Date",
      render: (item) => <div className="text-gray-600">{item.date}</div>
    },
    {
      key: "time",
      header: "Time",
      render: (item) => <div className="text-gray-600">{item.time}</div>
    }
  ];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-4 flex flex-col h-[450px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Unassigned Cases</h2>
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

      <div className="flex-1 overflow-auto">
        {filteredCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Briefcase className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500">
              {searchQuery
                ? "No cases match your search."
                : "No unassigned cases available."}
            </p>
          </div>
        ) : (
          <TableModal
            data={filteredCases}
            columns={columns}
            emptyMessage="No unassigned cases available."
            getRowKey={(item) => item.id}
            containerClassName="h-full"
          />
        )}
      </div>
    </div>
  );
}
