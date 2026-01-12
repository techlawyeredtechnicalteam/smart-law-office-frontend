// components/CaseDashboard.tsx
import { Case, useCaseStore } from "@/store/createCase";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { TableColumn, TableModal } from "@/components/shared/TableModal";

interface CaseDashboardProps {
  cases: Case[];
}

// Function to determine badge style based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Discovery":
      return "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100";
    case "Scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
  }
};

export function CaseDashboard({ cases }: CaseDashboardProps) {
  const { caseTypes } = useCaseStore();
  const columns: TableColumn<Case>[] = [
    {
      key: "id",
      header: "Case ID",
      render: (caseItem) => {
        // If id exists, slice it. Otherwise, return a placeholder.
        return caseItem?.id ? caseItem.id.slice(-8).toUpperCase() : "PENDING";
      }
    },
    {
      key: "clientName",
      header: "Client Name",
      render: (caseItem) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium capitalize">
            {caseItem.clientName ||
              (caseItem as any).clientEmail ||
              "Unknown Client"}
          </span>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (caseItem) => {
        // Find the name in the master list using the ID stored in the case
        const masterData = caseTypes.find(
          (t) =>
            t.caseTypeId === caseItem.caseTypeId ||
            t.feeScheduleId === caseItem.caseTypeId
        );

        const typeName = masterData?.name || "Standard Case";
        return <span className="capitalize">{typeName.toLowerCase()}</span>;
      }
    },
    {
      key: "status",
      header: "Status",
      render: (caseItem) => (
        <Badge
          className={`${getStatusBadgeVariant(
            caseItem.status
          )} border shadow-sm`}
        >
          {caseItem.status}
        </Badge>
      )
    },
    {
      key: "document",
      header: "Document",
      render: (caseItem) =>
        caseItem.documents && caseItem.documents.length > 0
          ? caseItem.documents[0].name
          : "N/A"
    },
    {
      key: "notes",
      header: "Notes",
      render: (caseItem) =>
        caseItem.notes ? (
          caseItem.notes.length > 50 ? (
            caseItem.notes.substring(0, 50) + "..."
          ) : (
            caseItem.notes
          )
        ) : (
          <span className="text-gray-400 italic text-xs">No notes</span>
        )
    }
  ];

  return (
    <TableModal
      data={cases}
      columns={columns}
      emptyMessage="No cases found. Create your first case to get started."
      getRowKey={(caseItem) => caseItem.id}
    />
  );
}
