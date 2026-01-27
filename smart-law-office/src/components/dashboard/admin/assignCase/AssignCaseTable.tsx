"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useCaseStore } from "@/store/createCase";
import { useAssignStore } from "@/store/assignCaseStore";

// Extend AssignedCase type to include staffName if not already present
type AssignedCase = {
  id: string;
  caseCode: string;
  clientEmail?: string;
  clientName?: string;
  caseType?: string;
  staffEmail?: string;
  status?: string;
  staffName?: string; // <-- Add this line
  [key: string]: any;
};

export function AssignedCasesTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { cases, fetchCases } = useCaseStore();
  const { getEnrichedData } = useAssignStore();

  // Filter for assigned cases
  const assignedCases = cases.filter((c) => {
    return c.staffEmail && c.staffEmail !== "Unassigned";
  });

  console.log("📊 Assigned Cases:", assignedCases);

  const filteredCases = assignedCases.filter((ac) => {
    const search = searchQuery.toLowerCase();

    // Try to get enrichment data
    const enrichment = getEnrichedData(ac.caseCode) || getEnrichedData(ac.id);

    const fieldsToSearch = [
      ac.id,
      ac.caseCode,
      ac.clientEmail,
      ac.clientName,
      enrichment?.clientName,
      ac.caseType,
      enrichment?.caseType,
      ac.staffEmail,
      ac.status
    ].map((field) => (field || "").toLowerCase());

    return fieldsToSearch.some((val) => val.includes(search));
  });

  const columns: TableColumn<(typeof assignedCases)[0]>[] = [
    {
      key: "case-client",
      header: "Case/Client",
      render: (item) => {
        // Lookup by id or caseCode (whichever the backend returned)
        const enrichment =
          getEnrichedData(item.caseCode) || getEnrichedData(item.id);

        // If backend returns fallback, use our local enrichment
        const clientName =
          item.clientName === "Unknown Client" || !item.clientName
            ? enrichment?.clientName || "Unknown Client"
            : item.clientName;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-violet-700">{clientName}</span>
            <span className="text-gray-500 text-xs font-medium">
              {item.clientEmail || enrichment?.dateTime || "No contact info"}
            </span>
          </div>
        );
      }
    },
    {
      key: "caseType",
      header: "Type",
      render: (item) => {
        const enrichment =
          getEnrichedData(item.caseCode) || getEnrichedData(item.id);
        const type =
          item.caseType === "General Case" || !item.caseType
            ? enrichment?.caseType || "Legal Case"
            : item.caseType;

        return <div className="text-gray-700 font-medium">{type}</div>;
      }
    },
    {
      key: "assignedTo",
      header: "Assigned Counsel",
      render: (item) => {
        // Try to get enrichment
        let enrichment = getEnrichedData(item.id);
        if (!enrichment) {
          enrichment = getEnrichedData(item.caseCode);
        }
        if (!enrichment && (item as any).consultCode) {
          enrichment = getEnrichedData((item as any).consultCode);
        }

        let staffName = item.staffEmail || "Staff Member";

        // If we have enriched staff name, use it
        if (enrichment?.staffName) {
          staffName = enrichment.staffName;
        }

        const initial = staffName.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {staffName}
              </span>
              <span className="text-[10px] text-gray-400 italic">
                Counsel Assigned
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          COMPLETED: {
            label: "Completed",
            color: "bg-gray-50 text-gray-700 border-gray-200"
          },
          IN_PROGRESS: {
            label: "Active",
            color: "bg-green-50 text-green-700 border-green-200"
          },
          PENDING: {
            label: "Pending",
            color: "bg-yellow-50 text-yellow-700 border-yellow-200"
          },
          ACTIVE: {
            label: "Active",
            color: "bg-green-50 text-green-700 border-green-200"
          }
        };

        const rawStatus = item.status || "PENDING";
        const status = statusMap[rawStatus] || {
          label: rawStatus,
          color: "bg-blue-50 text-blue-700 border-blue-200"
        };

        return (
          <span
            className={`px-2.5 py-0.5 text-[10px] rounded-full border font-bold uppercase ${status.color}`}
          >
            {status.label}
          </span>
        );
      }
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
            className="h-6 w-6 p-0 text-gray-400 hover:text-violet-600"
            title="Refresh cases"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cases..."
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
