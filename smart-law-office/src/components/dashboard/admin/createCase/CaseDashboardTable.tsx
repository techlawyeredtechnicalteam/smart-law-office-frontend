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
  console.log("CaseDashboard:", cases);

  const { caseTypes } = useCaseStore();
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
        // Lead Tip: Log one item here if you're still stuck to see its real shape
        // console.log("Case Item Shape:", caseItem);

        const name =
          caseItem.clientName || // Flat property
          caseItem.client?.name || // Nested object
          caseItem.client?.fullName || // Common backend variant
          caseItem.title || // Fallback title
          caseItem.clientEmail || // Use email as name if all else fails
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
      header: "Case Type",
      render: (caseItem: any) => {
        const type =
          caseItem.caseType || // Flat property
          caseItem.feeSchedule?.name || // Nested fee schedule
          caseItem.case_type?.name || // Common snake_case variant
          "Standard Case";

        return <span className="text-sm font-medium">{type}</span>;
      }
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
        const noteText = caseItem.notes || (caseItem as any).note;
        if (!noteText)
          return <span className="text-gray-400 italic text-xs">No notes</span>;
        return (
          <span title={noteText}>
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
    <TableModal
      data={cases}
      columns={columns}
      emptyMessage="No cases found. Create your first case to get started."
      getRowKey={(caseItem) => caseItem.id}
    />
  );
}
