import {
  adminCreateCase,
  createCase,
  deleteCase,
  getAllCases,
  getCaseById,
  getCases
} from "@/app/api/cases.api";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  getAdminCaseTypesById,
  getAdminCaseTypes
} from "@/app/api/caseType.api";
import { createCaseSchema } from "@/types/case.schema";
import { id } from "date-fns/locale";

export interface CaseType {
  caseTypeId: string;
  firmId: string;
  feeScheduleId: string;
  name: string;
  fee: number;
  feeSchedule: {
    name: string;
    feeScheduleId: string;
    rateMin?: number;
  };
  firm: {
    name: string;
    firmId: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Backend response structure for Case
// export interface Case {
//   id: string;
//   userId: string;
//   consultId: string;
//   title: string;
//   caseTypeId: string;
//   caseCode?: string;
//   createdAt: string;
//   updatedAt: string;
// }
export interface Case {
  id: string;
  clientName: string;
  status: string;
  caseTypeId: string;
  notes?: string;
  documents: { name: string; url: string }[];
  caseType?: {
    feeSchedule?: {
      name: string;
    };
  };
}

export interface CreateCasePayload {
  title: string;
  caseTypeId: string;
  consultId: string;
  status: string;
  date: string;
  lastAdjournedDate?: string;
  nextAdjournedDate?: string;
  notes?: string;
  file?: string;
  //
  staffEmail: string;
  clientEmail: string;
}

export interface AdminCreateCasePayload {
  clientEmail: string;
  caseTypeId: string;
}

interface BackendCasePayload {
  userId: string;
  consultId: string;
  title: string;
  caseTypeId: string;
  status: string;
  date_executed: string;
  notes: string;
  document: string;
  //
  staffEmail: string;
  clientEmail: string;
}

interface CaseState {
  cases: Case[];
  caseTypes: CaseType[];
  isLoading: boolean;
  error: string | null;

  // API Interactions
  fetchCases: () => Promise<void>;
  fetchCaseTypes: () => Promise<void>;
  executeCreate: (values: createCaseSchema, role: string) => Promise<boolean>;

  // Helper to reset error
  clearError: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  caseTypes: [],
  isLoading: false,
  error: null,

  executeCreate: async (values, role) => {
    set({ isLoading: true, error: null });

    try {
      const backendPayload = {
        clientEmail: values.clientEmail,
        caseTypeId: values.caseTypeId,
        staffEmail:
          role === "ADMIN"
            ? values.staffEmail
            : useAuthStore.getState().user?.email || "",
        note: values.notes,
        document: values.file, // Backend likely expects 'document'
        lastAdjournedAt: values.lastAdjournedDate || null,
        nextAdjournedAt: values.nextAdjournedDate || null,
        status: values.status || "Discovery"
      };
      let response;
      //  admin
      if (role === "ADMIN") {
        response = await adminCreateCase(backendPayload);
      } else {
        response = await createCase({
          ...backendPayload,
          title: values.title || `Case: ${values.clientEmail}`,
          status: values.status,
          date: values.date || new Date().toISOString().split("T")[0]
        });
      }
      const rawNewCase = response.data;
      const normalizedNewCase: Case = {
        id: rawNewCase.id || rawNewCase.caseId,
        clientName: rawNewCase.clientEmail?.split("@")[0] || "New Client",
        caseTypeId: rawNewCase.caseTypeId,
        status: rawNewCase.status || "Discovery",
        notes: rawNewCase.note || rawNewCase.notes || "",
        documents: rawNewCase.document
          ? [{ name: "Uploaded Doc", url: rawNewCase.document }]
          : [],
        caseType: {
          feeSchedule: {
            // Try to find the name from our existing caseTypes list in the store
            name:
              get().caseTypes.find(
                (t) => t.caseTypeId === rawNewCase.caseTypeId
              )?.feeSchedule?.name || "Standard Case"
          }
        }
      };
      set((state) => ({
        cases: [normalizedNewCase, ...state.cases],
        isLoading: false
      }));
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Acion failed",
        isLoading: false
      });
      return false;
    }
  },

  //
  fetchCases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllCases();

      const rawData = response.data;
      // NORMALIZE THE DATA: Ensure every case has an 'id'
      const normalizedCases: Case[] = rawData.map((c: any) => ({
        // Use whatever ID field the backend provides
        id: c.id || c.caseId || c.caseCode || "UNKNOWN",

        // If clientName is empty, fallback to clientEmail or user.firstName
        clientName:
          c.clientName ||
          c.client?.name ||
          c.clientEmail?.split("@")[0] ||
          "Client",

        status: c.status || "Discovery",
        notes: c.notes || c.note || "",

        // Ensure documents is always an array
        documents: Array.isArray(c.documents)
          ? c.documents
          : c.document
          ? [{ name: "Document", url: c.document }]
          : []
      }));

      set({ cases: normalizedCases, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load cases", isLoading: false });
    }
  },

  fetchCaseTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAdminCaseTypes();
      console.log("fetch case types:", response);
      // set({ caseTypes: response.data, isLoading: false });

      const data = response.data;

      set({
        caseTypes: Array.isArray(data) ? data : [],
        isLoading: false
      });
    } catch (error) {
      set({ error: "Failed to load case types", isLoading: false });
    }
  },

  //
  clearError: () => set({ error: null })
}));
