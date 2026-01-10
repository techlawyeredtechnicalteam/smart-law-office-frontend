"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Document {
  caseDocumentId: string;
  name: string;
  caseName: string;
  status: "Discovery" | "Contract" | "Pleading";
  date: string;
  time: string;
  fileData?: string;
}

interface CaseTypes {
  id: string;
  name: string;
}

interface DocumentStore {
  documents: Document[];
  caseTypes: CaseTypes[];
  viewMode: "list" | "view";
  selectedDoc: Document | null;
  isAddModalOpen: boolean;
  isSuccessModalOpen: boolean;

  // actions
  setDocuments: (docs: Document[]) => void;
  setCaseTypes: (types: CaseTypes[]) => void;
  addDocument: (doc: Document) => void;
  deleteDocumentStore: (caseDocumentId: string) => void;
  setSelectedDoc: (doc: Document | null) => void;
  setViewMode: (mode: "list" | "view") => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
  setIsSuccessModalOpen: (isOpen: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      documents: [],
      caseTypes: [],
      viewMode: "list",
      selectedDoc: null,
      isAddModalOpen: false,
      isSuccessModalOpen: false,

      setCaseTypes: (caseTypes) => set({ caseTypes }),

      setDocuments: (documents) => set({ documents }),
      addDocument: (doc) =>
        set((state) => ({ documents: [doc, ...state.documents] })),

      deleteDocumentStore: (caseDocumentId) =>
        set((state) => ({
          documents: state.documents.filter(
            (doc) => doc.caseDocumentId !== caseDocumentId
          )
        })),

      setSelectedDoc: (selectedDoc) => set({ selectedDoc }),
      setViewMode: (viewMode) => set({ viewMode }),
      setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),
      setIsSuccessModalOpen: (isSuccessModalOpen) => set({ isSuccessModalOpen })
    }),
    {
      name: "document-storage", // Unique name for localStorage
      storage: createJSONStorage(() => localStorage) // Defaults to localStorage
    }
  )
);
