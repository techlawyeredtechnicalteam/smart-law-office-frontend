"use client";

import React, { useState } from "react";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useDocumentStore } from "@/store/documentStore";
import { toast } from "sonner";
import { deleteDocuemntApi } from "@/app/api/document.api";
import { handleDownload } from "@/components/shared/HandleDownload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, Trash2, Gavel } from "lucide-react";
import { CreateModal } from "@/components/shared/CreateModal";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Discovery: "bg-green-100 text-green-700 border-green-200",
    Contract: "bg-orange-100 text-orange-700 border-orange-200",
    Pleading: "bg-blue-100 text-blue-700 border-blue-200"
  };

  return (
    <Badge
      className={`${styles[status] || "bg-gray-100 text-gray-700"} border shadow-none px-3`}
    >
      {status}
    </Badge>
  );
};

export function DocumentTable({ data }: { data: any[] }) {
  const { setViewMode, setSelectedDoc, deleteDocumentStore } =
    useDocumentStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<any>(null);

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await deleteDocuemntApi(docToDelete.caseDocumentId);
      deleteDocumentStore(docToDelete.caseDocumentId);
      toast.success("Document Deleted");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Could not delete document");
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: "name",
      header: "Document Name",
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900 truncate max-w-[200px]">
            {doc.name}
          </span>
        </div>
      )
    },
    {
      key: "caseName",
      header: "Associated Case",
      render: (doc) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Gavel className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm">{doc.caseName || "Unassigned"}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (doc) => <StatusBadge status={doc.status} />
    },
    // {
    //   key: "id",
    //   header: "Doc ID",
    //   render: (doc) => (
    //     <span className="font-mono text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-1 rounded">
    //       {(doc.caseDocumentId || doc.id)?.slice(-6).toUpperCase()}
    //     </span>
    //   )
    // },
    {
      key: "action",
      header: "Actions",
      headerClassName: "text-right pr-4",
      render: (doc) => (
        <div className="flex justify-end gap-1">
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-violet-600"
            onClick={() => {
              setSelectedDoc(doc);
              setViewMode("view");
            }}
          >
            <Eye className="w-4 h-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500"
            onClick={() => handleDownload(doc.fileData || doc.url, doc.name)}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-50"
            onClick={() => {
              setDocToDelete(doc);
              setIsDeleteModalOpen(true);
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
      <TableModal
        data={data}
        columns={columns}
        emptyMessage="No documents uploaded yet."
        getRowKey={(doc) => doc.caseDocumentId || doc.id}
        containerClassName="border rounded-xl bg-white shadow-sm overflow-hidden"
      />

      {/* Reusable Delete Confirmation Modal */}
      <CreateModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        modalTitle="Delete Document"
        triggerText=""
        customTrigger={<span className="hidden" />}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-900">{docToDelete?.name}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Document
            </Button>
          </div>
        </div>
      </CreateModal>
    </>
  );
}
