"use client";

import { AddDocumentModal } from "@/components/dashboard/staff/document/AddDocumentModal";
import { CreateDocumentModal } from "@/components/dashboard/staff/document/CreateDocumentModal";
import { DocumentTable } from "@/components/dashboard/staff/document/DocumentTable";
import DocumentView from "@/components/dashboard/staff/document/DocumentView";
import { SuccessModal } from "@/components/dashboard/staff/document/SuccessModal";
import { Button } from "@/components/ui/button";
import { useCaseStore } from "@/store/createCase";
import { useDocumentStore } from "@/store/documentStore";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const DocumentPage = () => {
  const { cases } = useCaseStore();
  const {
    documents,
    viewMode,
    setIsAddModalOpen,
    isAddModalOpen,
    isSuccessModalOpen
  } = useDocumentStore();

  const allDocuments = React.useMemo(() => {
    return cases.flatMap((c) =>
      (c.documents || []).map((doc) => ({
        caseDocumentId: doc.name || doc.url,
        name: doc.name,
        caseName: c.clientName,
        status: "Discovery",
        fileData: doc.url
      }))
    );
  }, [cases]);

  if (viewMode === "view") return <DocumentView />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Documents</h1>
        <CreateDocumentModal />
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
          <div className="p-4 bg-purple-50 rounded-full mb-4">
            <Plus className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold">Documents</h2>
          <p className="text-muted-foreground mb-6">
            No documents found. Start by adding case-related files for easy
            access and secure sharing.
          </p>
          <CreateDocumentModal />
        </div>
      ) : (
        <DocumentTable data={allDocuments} />
      )}

      {isAddModalOpen && <AddDocumentModal />}

      {isSuccessModalOpen && <SuccessModal />}
    </div>
  );
};

export default DocumentPage;
