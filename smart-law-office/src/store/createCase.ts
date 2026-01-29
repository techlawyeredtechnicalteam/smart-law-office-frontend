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

    // Filter cases the user is allowed to see
    const visibleCases =
      user?.role === "ADMIN"
        ? allCases
        : allCases.filter((c) => c.staffEmail === user?.email);

    const total = visibleCases.length;

    // Added .toUpperCase() to handle backend consistency
    const completed = visibleCases.filter(
      (c) => c.status?.toUpperCase() === "COMPLETED"
    ).length;

    const pending = visibleCases.filter(
      (c) =>
        c.status?.toUpperCase() === "PENDING" ||
        c.status?.toUpperCase() === "IN_PROGRESS" ||
        c.status?.toUpperCase() === "DEFAULT"
    ).length;

    set({
      stats: { total, completed, pending, meetingHours: 0 }
    });
  },

  // fetchCases: async () => {
  //   set({ isLoading: true, error: null });
  //   const user = useAuthStore.getState().user;

  //   try {
  //     // 1. Fetch Billing Data FIRST if it's not already there
  //     let feeSchedules = useBillingStore.getState().feeSchedules;
  //     if (!feeSchedules || feeSchedules.length === 0) {
  //       await useBillingStore.getState().fetchBillingInitialData();
  //       feeSchedules = useBillingStore.getState().feeSchedules; // Refresh reference
  //     }

  //     const response =
  //       user?.role === "ADMIN" ? await getAllCases() : await getStaffCases();
  //     const rawData = response.data || [];

  //     const normalizedCases: Case[] = rawData.map((c: any) => {
  //       // 2. Perform Lookup
  //       const matchedCaseType = feeSchedules.find(
  //         (ft: any) => ft.caseTypeId === c.caseTypeId || ft.id === c.caseTypeId
  //       );

  //       // Use .name as per your requirement
  //       const caseTypeDisplay =
  //         matchedCaseType?.feeSchedule?.description || "General Legal Matter";

  //       return {
  //         id: c.directCaseId,
  //         caseCode: c.caseCode,
  //         staffEmail: c.staff?.email || "Unassigned",
  //         clientEmail: c.client?.email || "",
  //         clientName: c.client
  //           ? `${c.client.firstName} ${c.client.lastName}`.trim()
  //           : "Walk-in Client",
  //         caseType: caseTypeDisplay,
  //         status: c.status || "default",
  //         createdAt: c.createdAt,
  //         notes: c.directCaseNotes?.[0]?.note || "No notes added",
  //         documents: (c.directCaseDocuments || []).map((d: any) => ({
  //           name: d.path.split("/").pop() || "Document",
  //           url: d.path
  //         })),
  //         caseTypeId: c.caseTypeId
  //       };
  //     });

  //     set({ cases: normalizedCases, isLoading: false });
  //     get().calculateStats(normalizedCases);
  //   } catch (error: any) {
  //     set({ error: "Failed to load cases", isLoading: false });
  //   }
  // },

  // fetchCases: async () => {
  //   set({ isLoading: true, error: null });
  //   const user = useAuthStore.getState().user;

  //   try {
  //     // 1. Get the billing store state
  //     const billingStore = useBillingStore.getState();

  //     // Ensure billing data is loaded
  //     if (billingStore.rates.length === 0) {
  //       await billingStore.fetchBillingInitialData();
  //     }

  //     // We use the 'rates' array because that's what CaseForm uses to save IDs
  //     const allRates = useBillingStore.getState().rates;

  //     const response =
  //       user?.role === "ADMIN" ? await getAllCases() : await getStaffCases();
  //     const rawData = response.data || [];

  //     const normalizedCases: Case[] = rawData.map((c: any) => {
  //       // Find the rate in the rates array
  //       const matchedRate = allRates.find(
  //         (r: any) => r.caseTypeId === c.caseTypeId || r.id === c.caseTypeId
  //       );

  //       // TYPE GUARD: Check if it's a CaseRate to satisfy TypeScript
  //       let caseTypeDisplay = "General Legal Matter";

  //       if (matchedRate && matchedRate.serviceType === "Case") {
  //         // Now TS knows matchedRate has subServiceType
  //         caseTypeDisplay = matchedRate.subServiceType;
  //       }

  //       return {
  //         id: c.directCaseId,
  //         caseCode: c.caseCode,
  //         staffEmail: c.staff?.email || "Unassigned",
  //         clientEmail: c.client?.email || "",
  //         clientName: c.client
  //           ? `${c.client.firstName} ${c.client.lastName}`.trim()
  //           : "Walk-in Client",
  //         caseType: caseTypeDisplay,
  //         status: c.status,
  //         createdAt: c.createdAt,
  //         notes: c.directCaseNotes?.[0]?.description || "No notes added",
  //         documents: (c.directCaseDocuments || []).map((d: any) => ({
  //           name: d.path.split("/").pop() || "Document",
  //           url: d.path
  //         })),
  //         caseTypeId: c.caseTypeId
  //       };
  //     });

  //     set({ cases: normalizedCases, isLoading: false });
  //     get().calculateStats(normalizedCases);
  //   } catch (error: any) {
  //     set({ error: "Failed to load cases", isLoading: false });
  //   }
  // },
  fetchCases: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;

    try {
      const billingStore = useBillingStore.getState();
      if (billingStore.rates.length === 0) {
        await billingStore.fetchBillingInitialData();
      }
      const allRates = billingStore.rates;

      const response =
        user?.role === "ADMIN" ? await getAllCases() : await getStaffCases();
      const rawData = response.data?.data || response.data || []; // Handle nested data property

      const normalizedCases: Case[] = rawData.map((c: any) => {
        // 1. Find the rate in the rates array
        const matchedRate = allRates.find(
          (r: any) =>
            (r as any).caseTypeId === c.caseTypeId || r.id === c.caseTypeId
        );

        let caseTypeDisplay = "General Legal Matter";

        // 2. USE TYPE GUARDING
        // Check if matchedRate exists and is specifically a "Case" serviceType
        if (matchedRate && matchedRate.serviceType === "Case") {
          // TypeScript now knows matchedRate has subServiceType
          caseTypeDisplay = matchedRate.subServiceType;
        }

        return {
          id: c.directCaseId || c.id,
          caseCode: c.caseCode,
          staffEmail: c.staff?.email || "Unassigned",
          clientEmail: c.client?.email || "",
          clientName: c.client
            ? `${c.client.firstName} ${c.client.lastName}`.trim()
            : "Walk-in Client",
          caseType: caseTypeDisplay, // Now correctly typed and assigned
          status: c.status,
          createdAt: c.createdAt,
          notes: c.directCaseNotes?.[0]?.description || "No notes added",
          documents: (c.directCaseDocuments || []).map((d: any) => ({
            name: d.path.split("/").pop() || "Document",
            url: d.path
          })),
          caseTypeId: c.caseTypeId
        };
      });

      set({ cases: normalizedCases, isLoading: false });
      get().calculateStats(normalizedCases);
    } catch (error: any) {
      console.error("Fetch Cases Error:", error);
      set({ error: "Failed to load cases", isLoading: false });
    }
  },

  // Role Creation
  executeCreate: async (values, role) => {
    set({ isLoading: true, error: null });

    try {
      let response;

      // if (role === "ADMIN") {
      //   response = await adminCreateCase(values);
      // } else {
      //   const staffPayload = {
      //     clientEmail: values.clientEmail,
      //     caseTypeId: values.caseTypeId,
      //     note: values.notes,
      //     document: values.document,
      //     lastAdjournedAt: values.lastAdjournedDate || null,
      //     nextAdjournedAt: values.nextAdjournedDate || null,
      //     status: values.status
      //   };
      //   response = await staffCreateCase(staffPayload);
      // }
      if (role === "ADMIN") {
        // FIX: Admin payload was missing notes and status!
        const adminPayload = {
          clientEmail: values.clientEmail,
          caseTypeId: values.caseTypeId,
          staffEmail: values.staffEmail,
          note: values.notes, // Pass the note here
          status: values.status,
          lastAdjournedAt: values.lastAdjournedDate || null,
          nextAdjournedAt: values.nextAdjournedDate || null
        };
        response = await adminCreateCase(adminPayload);
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

      if (response.data) {
        // LEAD TIP: Instead of just pushing the raw object,
        // re-run fetchCases to ensure the new case gets normalized
        // (mapped with feeSchedule name and client details)
        await get().fetchCases();
        set({ isLoading: false });
        return true;
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
