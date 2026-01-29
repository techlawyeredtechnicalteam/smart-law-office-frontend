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

  fetchCases: async () => {
    set({ isLoading: true, error: null });

    const user = useAuthStore.getState().user;
    const role = user?.role;

    try {
      const response =
        role === "ADMIN" ? await getAllCases() : await getStaffCases();
      const rawData = response.data || [];

      const feeSchedules = useBillingStore.getState().feeSchedules;

      const normalizedCases: Case[] = rawData.map((c: any, index: number) => {
        // 1. Generate the Case ID format: #2026-00XX
        // We use the index or the last 2 digits of the directCaseId for the XX
        const suffix = String(index + 1).padStart(2, "0");
        const caseDisplayId = `#2026-00${suffix}`;

        // 2. Resolve Case Type from Fee Schedules
        const matchedSchedule = feeSchedules.find(
          (fs) => fs.feeScheduleId === c.caseTypeId
        );
        const caseTypeDisplay = matchedSchedule?.caseTypeId || "General Case";

        // 3. Resolve Client Name & Email (from nested 'client' object)
        const clientName = c.client
          ? `${c.client.firstName} ${c.client.lastName}`.trim()
          : "Unknown Client";
        const clientEmail = c.client?.email || "";

        // 4. Resolve Staff Name & Email (from nested 'staff' object)
        const staffName = c.staff
          ? `${c.staff.firstName} ${c.staff.lastName}`.trim()
          : "Unassigned";
        const staffEmail = c.staff?.email || "Unassigned";

        return {
          // Keeping the real UUID for API calls
          id: c.directCaseId || c.caseId || c.id,
          // Using your custom format for display
          caseCode: caseDisplayId,
          staffEmail: staffEmail,
          staffName: staffName,
          clientEmail: clientEmail,
          clientName: clientName,
          caseType: caseTypeDisplay,
          status: c.status || "Default",
          createdAt: c.createdAt,
          notes: c.note || "",
          documents: Array.isArray(c.documents) ? c.documents : []
        };
      });

      set({ cases: normalizedCases, isLoading: false });
      get().calculateStats(normalizedCases);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to load cases",
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
