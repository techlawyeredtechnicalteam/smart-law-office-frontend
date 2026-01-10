// components/CaseDashboard.tsx
import { Case } from "@/store/createCase";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { TableColumn, TableModal } from "@/components/shared/TableModal";

interface CaseDashboardProps {
  cases: Case[];
}

// Function to determine badge style based on status
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function CaseDashboard({ cases }: CaseDashboardProps) {
  // const { cases } = useCaseStore();
  const columns: TableColumn<Case>[] = [
    {
      key: "id",
      header: "Case ID",
      render: (caseItem) => caseItem.id
    },
    {
      key: "clientName",
      header: "Client Name",
      render: (caseItem) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span>{caseItem.clientName}</span>
        </div>
      )
    },
    {
      key: "caseType",
      header: "Case Type",
      render: (caseItem) => caseItem.caseType
    },
    {
      key: "status",
      header: "Status",
      render: (caseItem) => (
        <Badge className={getStatusBadgeVariant(caseItem.status)}>
          {caseItem.status}
        </Badge>
      )
    },
    {
      key: "document",
      header: "Document",
      render: (caseItem) =>
        caseItem.documents.length > 0 ? caseItem.documents[0].name : "N/A"
    },
{
      key: "notes",
      header: "Notes",
      render: (caseItem) =>
        caseItem.notes ? caseItem.notes.substring(0, 50) + "..." : "No consultation notes"
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
