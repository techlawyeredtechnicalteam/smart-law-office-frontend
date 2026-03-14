"use client";

import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useDocumentStore } from "@/store/documentStore";
import { toast } from "sonner";
import { deleteDocuemntApi } from "@/app/api/document.api";
import { DropdownModal } from "@/components/shared/DropdownModal";
import { handleDownload } from "@/components/shared/HandleDownload";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Discovery: "bg-green text-green-600 border-green-100",
    Contract: "bg-orange-50 text-orange-600 border-orange-100",
    Pleading: "bg-blue-50 text-blue-600 border-blue-100"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export function DocumentTable({ data }: { data: any[] }) {
  const { setViewMode, setSelectedDoc, deleteDocumentStore } =
    useDocumentStore();

  const handleOnDelete = async (caseDocumentId: string) => {
    try {
      // confirm delete
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this document"
      );
      if (!confirmDelete) return;

      await deleteDocuemntApi(caseDocumentId);
      deleteDocumentStore(caseDocumentId);
      toast.success("Document Deleted");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Could not delete document");
    }
  };

  // Define column
  const columns: TableColumn<any>[] = [
    {
      key: "name",
      header: "Document name",
      cellClassName: "font-medium text-gray-900",
      render: (doc) => doc.name
    },
    {
      key: "caseName",
      header: "Case",
      render: (doc) => doc.caseName || "Unassigned"
    },
    {
      key: "status",
      header: "Status",
      render: (doc) => <StatusBadge status={doc.status} />
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "text-right pr-4",
      render: (doc) => (
        <div className="flex justify-end pr-2">
          <DropdownModal
            item={doc}
            onView={(item) => {
              setSelectedDoc(item);
              setViewMode("view");
            }}
            onDownload={(item) =>
              handleDownload(item.fileData || item.url, item.name)
            }
            onDelete={() => handleOnDelete(doc.caseDocumentId)}
          />
        </div>
      )
    }
  ];

  return (
    <TableModal
      data={data}
      columns={columns}
      emptyMessage="No documents uploaded yet."
      getRowKey={(doc) => doc.caseDocumentId || doc.id}
      containerClassName="border rounded-xl bg-white shadow-sm overflow-hidden"
    />
  );
}
