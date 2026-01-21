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
    //safe string checking
    const fieldsToSearch = [
      ac.caseTypeId,
      ac.id,
      ac.clientEmail,
      ac.staffEmail,
      ac.status
    ].map((field) => (field || "").toLowerCase());

    return fieldsToSearch.some((val) => val.includes(search));
  });

  const columns: TableColumn<(typeof assignedCases)[0]>[] = [
    {
      key: "case-client",
      header: "Case/Client",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-bold text-violet-700">
            {item.caseTypeId || item.id?.slice(-8).toUpperCase() || "PENDING"}
          </span>
          <span className="text-gray-500 text-xs font-medium uppercase tracking-tight">
            {item.clientEmail || ""}
          </span>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (item) => {
        // 🚀 Use the unified billing store for the lookup
        const type = caseTypes.find((t) => t.name === item.title);
        return (
          <div className="text-gray-700 font-medium">
            {type?.name || "Standard Case"}
          </div>
        );
      }
    },
    {
      key: "assignedTo",
      header: "Assigned Counsel",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
            {item.staffEmail?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {item.staffEmail}
            </span>
            <span className="text-[10px] text-gray-400 italic">
              Counsel Assigned
            </span>
          </div>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 text-[10px] rounded-full border font-bold uppercase ${
            item.status === "Active"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          {item.status || "Assigned"}
        </span>
      )
    },
    {
      key: "action",
      header: "View",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-bold"
          onClick={() => console.log("Navigate to case:", item.id)}
        >
          Manage
        </Button>
      )
    }
    // {
    //   key: "assignedTo", // Changed key to be unique
    //   header: "Assigned To",
    //   render: (item) => (
    //     <div className="flex flex-col">
    //       <div className="text-sm text-purple-700 font-semibold">
    //         {item.staffEmail || "Staff Member"}
    //       </div>
    //       {(item as any).staffId && !item.staffEmail && (
    //         <div className="text-[10px] text-gray-400 font-mono">
    //           ID: {(item as any).staffId.slice(-6)}
    //         </div>
    //       )}
    //     </div>
    //   )
    // }
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
