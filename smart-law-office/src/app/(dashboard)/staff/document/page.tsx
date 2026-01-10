"use client";

import { AddDocumentModal } from "@/components/dashboard/staff/document/AddDocumentModal";
import { CreateDocumentModal } from "@/components/dashboard/staff/document/CreateDocumentModal";
import { DocumentTable } from "@/components/dashboard/staff/document/DocumentTable";
import DocumentView from "@/components/dashboard/staff/document/DocumentView";
import { SuccessModal } from "@/components/dashboard/staff/document/SuccessModal";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/store/documentStore";
import { Plus } from "lucide-react";
import { useState } from "react";

const DocumentPage = () => {
  const { documents, viewMode, setIsAddModalOpen } = useDocumentStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  if (viewMode === "view") return <DocumentView />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600"
        >
          Upload document
        </Button>
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
          <CreateDocumentModal
            isSuccessOpen={isSuccessModalOpen}
            setSuccessOpen={setIsSuccessModalOpen}
          />
        </div>
      ) : (
        <DocumentTable data={documents} />
      )}
      {/* <AddDocumentModal /> */}
      <SuccessModal />{" "}
    </div>
  );
};

export default DocumentPage;
