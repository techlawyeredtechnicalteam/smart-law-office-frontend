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
import { getCaseFormCaseTypes } from "@/app/api/setRateBills.api";

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
  [x: string]: any;
  caseCode: any;
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

  // calculateStats: (allCases: Case[]) => {
  //   const total = allCases.length;
  //   // Ensure these strings match your backend response exactly (e.g., "COMPLETED" vs "Completed")
  //   const completed = allCases.filter((c) => c.status === "COMPLETED").length;
  //   const pending = allCases.filter(
  //     (c) => c.status === "PENDING" || c.status === "IN_PROGRESS"
  //   ).length;

  //   set({
  //     stats: {
  //       total,
  //       completed,
  //       pending,
  //       meetingHours: 335 // Placeholder for now
  //     }
  //   });
  // },
  calculateStats: (allCases: Case[]) => {
    const user = useAuthStore.getState().user;

    // LEAD TIP: Filter the list based on the user BEFORE calculating stats
    const visibleCases =
      user?.role === "ADMIN"
        ? allCases
        : allCases.filter((c) => c.staffEmail === user?.email);

    const total = visibleCases.length;
    const completed = visibleCases.filter(
      (c) => c.status === "COMPLETED"
    ).length;
    const pending = visibleCases.filter(
      (c) => c.status === "PENDING" || c.status === "IN_PROGRESS"
    ).length;

    set({
      stats: { total, completed, pending, meetingHours: 0 }
    });
  },

  // fetch cases base on role
  fetchCases: async () => {
    set({ isLoading: true, error: null });

    const user = useAuthStore.getState().user;
    const role = user?.role;

    try {
      const response =
        role === "ADMIN" ? await getAllCases() : await getStaffCases();

      let rawData = response.data || [];

      if (user?.role === "STAFF") {
        rawData = rawData.filter(
          (c: any) =>
            c.staffEmail === user.email || c.staff?.email === user.email
        );
      }

      // Get the actual fee schedules from the billing store for cross-referencing
      const feeSchedules = useBillingStore.getState().feeSchedules;

      const normalizedCases: Case[] = rawData.map((c: any) => {
        const matchedSchedule = feeSchedules.find(
          (fs) => fs.feeScheduleId === c.caseTypeId
        );

        const caseTypeDisplay =
          matchedSchedule?.name ||
          c.feeSchedule?.name ||
          c.title ||
          "General Case";

        // 2. Resolve Client Name
        // Backend usually returns 'client' object for Admin. We check all possibilities.
        const clientDisplayName =
          c.client?.name ||
          c.client?.fullName ||
          c.clientName ||
          c.clientEmail ||
          "New Client";

        return {
          id: c.directCaseId || c.caseId || c.id,
          caseCode: c.caseCode || (c.id ? c.id.slice(-8).toUpperCase() : "---"),
          staffEmail: c.staffEmail || c.staff?.email || "Unassigned",
          clientEmail: c.clientEmail || c.client?.email,
          clientName: clientDisplayName,
          caseType: caseTypeDisplay,
          notes: c.note || c.notes || "",
          status: c.status || "PENDING",
          documents: Array.isArray(c.documents)
            ? c.documents
            : c.document
              ? [{ name: "Case Document", url: c.document }]
              : [],
          createdAt: c.createdAt
        };
      });

      set({ cases: normalizedCases, isLoading: false });
      get().calculateStats(normalizedCases);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to load Admin cases",
        isLoading: false
      });
    }
  },

  // Role Creation
  executeCreate: async (values, role) => {
    set({ isLoading: true, error: null });

    try {
      let response;

      if (role === "ADMIN") {
        response = await adminCreateCase(values);
      } else {
        const staffPayload = {
          clientEmail: values.clientEmail,
          caseTypeId: values.caseTypeId,
          note: values.notes,
          document: values.document,
          lastAdjournedAt: values.lastAdjournedDate || null,
          nextAdjournedAt: values.nextAdjournedDate || null,
          status: values.status
        };
        response = await staffCreateCase(staffPayload);
      }

      // update local state immediately
      const newCase = response.data;

      if (newCase) {
        const updatedCases = [newCase, ...get().cases];
        set({
          cases: updatedCases,
          isLoading: false
        });
        // Trigger the real-time update
        get().calculateStats(updatedCases);
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
