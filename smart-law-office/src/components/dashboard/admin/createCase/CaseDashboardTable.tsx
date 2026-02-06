import { Case, useCaseStore } from "@/store/createCase";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { CaseDetailsModal } from "./CaseDetailsModal";
import { TableColumn, TableModal } from "@/components/shared/TableModal";
import { useState } from "react";

interface CaseDashboardProps {
  cases: Case[];
}

// Function to determine badge style based on status
const getStatusBadgeVariant = (status: string) => {
  const s = status?.toUpperCase();
  switch (s) {
    case "SCHEDULED":
      return "bg-violet-100 text-violet-800...";
    case "PENDING":
      return "bg-blue-100 text-blue-800...";
    case "COMPLETED":
      return "bg-green-100 text-green-800...";
    default:
      return "bg-gray-100 text-gray-800...";
  }
};

export function CaseDashboard({ cases }: CaseDashboardProps) {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (item: Case) => {
    setSelectedCase(item);
    setIsModalOpen(true);
  };

  const columns: TableColumn<Case>[] = [
    {
      key: "id",
      header: "Case ID",
      render: (caseItem) => (
        <span className="font-mono font-bold text-violet-700">
          {(caseItem as any).caseCode ||
            caseItem.id?.slice(-8).toUpperCase() ||
            "---"}
        </span>
      )
    },
    {
      key: "clientName",
      header: "Client Name",
      render: (caseItem: any) => {
        const name =
          caseItem.clientName ||
          caseItem.client?.name ||
          caseItem.client?.fullName ||
          caseItem.title ||
          caseItem.clientEmail ||
          "Unknown Client";

        return (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium capitalize">{name}</span>
          </div>
        );
      }
    },
    {
      key: "caseType",
      header: "Case Category",
      render: (caseItem) => (
        <div className="max-w-[200px]">
          <span className="text-xs font-semibold text-gray-700 block leading-tight">
            {caseItem.caseType}
          </span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (caseItem) => (
        <Badge
          className={`${getStatusBadgeVariant(caseItem.status)} border shadow-sm`}
        >
          {caseItem.status || "PENDING"}
        </Badge>
      )
    },
    {
      key: "notes",
      header: "Notes",
      render: (caseItem) => {
        // Updated to look into directCaseNotes array from your JSON
        const noteText =
          caseItem.notes !== "No notes added"
            ? caseItem.notes
            : (caseItem as any).directCaseNotes?.[0]?.description;

        if (!noteText)
          return <span className="text-gray-400 italic text-xs">No notes</span>;

        return (
          <span className="text-gray-600 text-xs" title={noteText}>
            {noteText.length > 35
              ? noteText.substring(0, 35) + "..."
              : noteText}
          </span>
        );
      }
    },
    {
      key: "document",
      header: "Document",
      render: (caseItem) => {
        // Check both 'documents' array and single 'document' field
        const docUrl =
          caseItem.documents?.[0]?.url || (caseItem as any).document;
        const docName = caseItem.documents?.[0]?.name || "View File";

        if (!docUrl) return <span className="text-gray-400">N/A</span>;

        return (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-800 underline text-sm font-medium"
          >
            {docName}
          </a>
        );
      }
    }
  ];

  return (
    <>
      <div className="cursor-pointer">
        <TableModal
          data={cases}
          columns={columns}
          emptyMessage="No cases found. Create your first case to get started"
          getRowKey={(caseItem) =>
            caseItem.id || (caseItem as any).directCaseId
          }
        />
      </div>

      <CaseDetailsModal
        selectedCase={selectedCase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
