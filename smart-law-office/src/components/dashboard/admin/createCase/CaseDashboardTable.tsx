import { Case, useCaseStore } from "@/store/createCase";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, User } from "lucide-react";
import { CaseDetailsModal } from "./CaseDetailsModal";
import { TableColumn, TableModal } from "@/components/shared/TableModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateModal } from "@/components/shared/CreateModal";
import DeleteCaseForm from "./DeleteCaseForm";
import CaseForm from "./CreateCaseForm";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleRowClick = (item: Case) => {
    setSelectedCase(item);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    // Optional: setSelectedCase(null);
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
        <div className="max-w-50">
          <span className="text-xs font-semibold text-gray-700 block leading-tight">
            {caseItem.caseType}
          </span>
        </div>
      )
    },
    // {
    //   key: "status",
    //   header: "Status",
    //   render: (caseItem) => (
    //     <Badge
    //       className={`${getStatusBadgeVariant(caseItem.status)} border shadow-sm`}
    //     >
    //       {caseItem.status || "PENDING"}
    //     </Badge>
    //   )
    // },
    {
      key: "notes",
      header: "Notes",
      render: (caseItem) => {
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
    },
    {
      key: "actions" as any,
      header: "Actions",
      render: (caseItem) => (
        <div className="flex items-center gap-2">
          {/* View Details Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-violet-700 hover:bg-violet-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCase(caseItem);
              setIsDetailsOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCase(caseItem);
              setIsEditOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCase(caseItem);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="cursor-pointer">
        <TableModal
          data={cases}
          columns={columns}
          emptyMessage="No cases found."
          getRowKey={(caseItem) => caseItem.id}
          onRowClick={(item) => {
            setSelectedCase(item);
            setIsDetailsOpen(true);
          }}
        />
      </div>

      {/* <CaseDetailsModal
        selectedCase={selectedCase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}

      {/* 1. Case Details Modal */}
      <CaseDetailsModal
        selectedCase={selectedCase}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Edit Modal using your CreateModal */}
      <CreateModal
        modalTitle={`Edit Case: ${selectedCase?.caseCode || ""}`}
        triggerText=""
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        customTrigger={<span className="hidden" />}
      >
        <CaseForm
          caseData={selectedCase}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => {
            setIsEditOpen(false);
          }}
        />
      </CreateModal>

      {/* Delete Modal using your CreateModal */}
      <CreateModal
        modalTitle="Confirm Deletion"
        triggerText=""
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        customTrigger={<span className="hidden" />}
      >
        {selectedCase && (
          <DeleteCaseForm
            caseData={selectedCase}
            onClose={() => setIsDeleteOpen(false)}
            onSuccess={() => setIsDeleteOpen(false)}
          />
        )}
      </CreateModal>
    </>
  );
}
