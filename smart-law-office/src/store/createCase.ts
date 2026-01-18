import { createCaseSchema } from "@/types/case.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";
import {
  adminCreateCase,
  getAllCases,
  getStaffCases,
  staffCreateCase
} from "@/app/api/cases.api";
import { getAdminCaseTypes } from "@/app/api/caseType.api";
import { useBillingStore } from "./setRateBill";
import { caseDocument } from "@/app/api/document.api";
import { useDocumentStore } from "./documentStore";

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

export interface Case {
  // ADD THESE FIELDS
  id: string;
  title?: string;
  staffEmail: string;
  clientEmail: string;
  clientName?: string;
  notes: string;
  documents: { name: string; url: string }[];
  caseTypeId: string;
  status: string;
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

interface CaseState {
  cases: Case[];
  caseTypes: CaseType[];
  isLoading: boolean;
  error: string | null;

  stats: {
    total: number;
    completed: number;
    pending: number;
    meetingHours: number;
  };
  // API Interactions
  fetchCases: () => Promise<void>;
  fetchCaseTypes: () => Promise<void>;
  calculateStats: (allCases: Case[]) => void;
  executeCreate: (values: createCaseSchema, role: string) => Promise<boolean>;
  uploadDocumentToCase: (
    caseId: string,
    name: string,
    file: string
  ) => Promise<boolean>;

  // Helper to reset error
  clearError: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  caseTypes: [],
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    meetingHours: 0
  },

  calculateStats: (allCases: Case[]) => {
    const total = allCases.length;
    // Ensure these strings match your backend response exactly (e.g., "COMPLETED" vs "Completed")
    const completed = allCases.filter((c) => c.status === "COMPLETED").length;
    const pending = allCases.filter(
      (c) => c.status === "PENDING" || c.status === "IN_PROGRESS"
    ).length;

    set({
      stats: {
        total,
        completed,
        pending,
        meetingHours: 335 // Placeholder for now
      }
    });
  },

  // fetch cases base on role
  fetchCases: async () => {
    set({ isLoading: true, error: null });

    const user = useAuthStore.getState().user;
    const role = user?.role;

    console.log("Current user:", user);
    console.log("User role:", role);

    // 🚩 BYPASS LOGIC: If Staff, don't even try the API yet
    if (role === "STAFF") {
      console.warn(
        "Staff role detected: Bypassing unauthorized API and loading mock data."
      );
      const mockStaffCases: Case[] = [
        {
          id: "staff-mock-1",
          staffEmail: user?.email || "staff@firm.com",
          clientEmail: "mock-client@example.com",
          notes: "This is a mock case for Staff view development.",
          documents: [],
          caseTypeId: "mock-id",
          status: "Discovery"
        }
      ];
      set({ cases: mockStaffCases, isLoading: false });
      return; // Exit early so we don't hit the 401
    }

    // 🟢 ADMIN LOGIC: Hit the real endpoint
    try {
      console.log("Calling getAllCases()....");
      const response = await getAllCases();
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      const rawData = response.data || [];
      console.log("Raw data length:", rawData.length);
      console.log("Raw data:", rawData);

      const normalizedCases: Case[] = rawData.map((c: any) => ({
        id: c.directCaseId || c.caseId || c.id,
        staffEmail: c.staffEmail || c.staff?.email,
        clientEmail:
          c.clientEmail || c.client?.email || c.clientName || c.client?.name,
        notes: c.note || c.notes || "",
        documents: Array.isArray(c.documents)
          ? c.documents
          : c.document
            ? [{ name: "Case Document", url: c.document }]
            : [],
        caseTypeId: c.caseTypeId,
        status: c.status || "PENDING"
      }));

      console.log("Normalized cases:", normalizedCases);
      set({ cases: normalizedCases, isLoading: false });
      get().calculateStats(normalizedCases);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to load Admin cases",
        isLoading: false
      });
    }

    //   try {
    //     const user = useAuthStore.getState().user;
    //     const role = user?.role;

    //     // determine which API to call based on role
    //     let response;
    //     if (role === "ADMIN") {
    //       response = await getAllCases();
    //       console.log("Get All Admin Cases:", getAllCases);
    //     } else {
    //       response = await getStaffCases();
    //       console.log("Get all staff assigned caases:", getStaffCases);
    //     }

    //     const rawData = response.data;
    //     const normalizedCases: Case[] = rawData.map((c: any) => ({
    //       id: c.directCaseId || c.caseId || c.id,
    //       staffEmail: c.staffEmail || c.staff?.email,
    //       clientEmail:
    //         c.clientEmail || c.client?.email || c.clientName || c.client?.name,
    //       notes: c.note || c.notes || "",
    //       documents: Array.isArray(c.documents)
    //         ? c.documents
    //         : c.document
    //         ? [{ name: "Case Document", url: c.document }]
    //         : [],
    //       caseTypeId: c.caseTypeId,
    //       status: c.status || "PENDING"
    //     }));
    //     set({ cases: normalizedCases, isLoading: false });
    //   } catch (error: any) {
    //     set({
    //       error: error.response?.data?.message || "Failed to load cases",
    //       isLoading: false
    //     });
    //   }
  },

  // Role Creation
  executeCreate: async (values, role) => {
    set({ isLoading: true, error: null });

    try {
      const basePayload = {
        ...values,
        document: values.document,
        lastAdjournedAt: values.lastAdjournedDate || null,
        nextAdjournedAt: values.nextAdjournedDate || null
      };

      const response =
        role === "ADMIN"
          ? await adminCreateCase(basePayload)
          : await staffCreateCase(basePayload);

      // update local state immediately
      const newCase = response.data;

      if (newCase) {
        // FIX: Define updatedCases so calculateStats can use the fresh data
        const updatedCases = [newCase, ...get().cases];

        set({
          cases: updatedCases,
          isLoading: false
        });

        // Trigger the real-time update
        get().calculateStats(updatedCases);
      } else {
        await get().fetchCases();
      }

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Action failed",
        isLoading: false
      });

      return false;
    }
  },

  fetchCaseTypes: async () => {
    // This triggers the billing store to fetch case types
    await useBillingStore.getState().fetchBillingInitialData();
  },

  uploadDocumentToCase: async (caseId, name, file) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        caseId,
        name,
        document: file // This should be your Base64 string or File object
      };

      const response = await caseDocument(payload);

      // Get the new document from response
      const newDoc = response.data?.data || response.data;

      // Update the specific case in the store
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: [
                  ...(c.documents || []),
                  {
                    name: newDoc.name || name,
                    url: newDoc.url || newDoc.document || file,
                    date: new Date().toISOString()
                  }
                ]
              }
            : c
        ),
        isLoading: false
      }));

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Document upload failed",
        isLoading: false
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
