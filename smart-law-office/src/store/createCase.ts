import { createCaseSchema } from "@/types/case.schema";
import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  adminCreateCase,
  deleteCase,
  getAllCases,
  getStaffCases,
  staffCreateCase,
  updateCase
} from "@/app/api/cases.api";
import { useBillingStore } from "./setRateBill";
import { caseDocument } from "@/app/api/document.api";
import { toast } from "sonner";

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
  id: string;
  title?: string;
  staffEmail: string;
  clientEmail: string;
  clientName: string;
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
  getAssignedCases: () => Case[];
  executeCreate: (values: createCaseSchema, role: string) => Promise<boolean>;
  executeUpdate: (id: string, values: any) => Promise<boolean>;
  executeDelete: (caseCode: string) => Promise<boolean>;
  uploadDocumentToCase: (
    caseId: string,
    name: string,
    file: string
  ) => Promise<boolean>;

  clearError: () => void;
}

// splitName function
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : ""
  };
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

    // 2. Aggregate statuses
    const getStatusCount = (statuses: string[]) =>
      allCases.filter((c) => statuses.includes(c.status?.toUpperCase() || ""))
        .length;

    const completed = getStatusCount(["COMPLETED", "CLOSED", "RESOLVED"]);

    const pending = getStatusCount([
      "PENDING",
      "IN_PROGRESS",
      "IN-PROGRESS",
      "DEFAULT",
      "OPEN"
    ]);

    // 3. Optional: Calculate total hours or other metrics if available in your Case object
    // const meetingHours = allCases.reduce((acc, c) => acc + (c.totalHours || 0), 0);

    set({
      stats: {
        total,
        completed,
        pending,
        meetingHours: 0
      }
    });
  },

  getAssignedCases: () => {
    const user = useAuthStore.getState().user;
    const allCases = get().cases;

    if (user?.role === "ADMIN") {
      return allCases; // Admins see everything
    }

    // Staff only see cases where their email matches
    return allCases.filter(
      (c) => c.staffEmail.toLowerCase() === user?.email?.toLowerCase()
    );
  },

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
      const rawData = response.data?.data || response.data || [];

      const normalizedCases: Case[] = rawData.map((c: any) => {
        // 1. Find the rate in the rates array
        const matchedRate = allRates.find(
          (r: any) =>
            (r as any).caseTypeId === c.caseTypeId || r.id === c.caseTypeId
        );

        let caseTypeDisplay = "General Legal Matter";

        // Check if matchedRate exists and is specifically a "Case" serviceType
        if (matchedRate && matchedRate.serviceType === "Case") {
          // TypeScript now knows matchedRate has subServiceType
          caseTypeDisplay = matchedRate.subServiceType;
        }

        // Improved ClientName to take the FulName
        let clientDisplayName = "Walk-in Client";
        if (c.client) {
          const combined =
            `${c.client.firstName || ""} ${c.client.lastName || ""}`.trim();
          clientDisplayName = combined || c.client.email || "Unnamed Client";
        } else if (c.clientName) {
          clientDisplayName = c.clientName;
        }

        return {
          id: c.id || c.directCaseId || c.caseId || c._id,
          caseCode: c.caseCode,
          staffEmail: (c.staff?.email || c.staffEmail || "").toLowerCase(),
          clientEmail: c.client?.email || "",
          clientName: clientDisplayName,
          caseType: caseTypeDisplay,
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

  executeCreate: async (values, role) => {
    set({ isLoading: true, error: null });
    try {
      const { firstName, lastName } = splitName(values.clientName);

      const commonData = {
        clientEmail: values.clientEmail,
        clientName: values.clientName,
        firstName,
        lastName,
        caseTypeId: values.caseTypeId,
        note: values.notes,
        status: values.status,
        lastAdjournedAt: values.lastAdjournedDate || null,
        nextAdjournedAt: values.nextAdjournedDate || null
      };

      const response =
        role === "ADMIN"
          ? await adminCreateCase({
              ...commonData,
              staffEmail: values.staffEmail
            })
          : await staffCreateCase({ ...commonData, document: values.document,documentName:values.documentName });

      // Only refresh and return true if response is successful
      if (response.status === 200 || response.status === 201) {
        await get().fetchCases();
        toast.success("Case created successfully");
        set({ isLoading: false });
        return true;
      }

      throw new Error("Unexpected response from server");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create case";
      toast.error(msg);
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  executeUpdate: async (id, values) => {
    set({ isLoading: true });
    try {
      const payload = {
        staffEmail: values.staffEmail,
        clientEmail: values.clientEmail,
        clientName: values.clientName,
        note: values.notes,
        document: values.document,
        caseTypeId: values.caseTypeId,
        lastAdjournedAt: values.lastAdjournedDate,
        nextAdjournedAt: values.nextAdjournedDate,
        status: values.status,
        documentName:values.documentName
      };
      await updateCase(id, payload);
      await get().fetchCases();
      toast.success("Case updated successfully");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update case");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  executeDelete: async (caseCode) => {
    set({ isLoading: true });
    try {
      await deleteCase(caseCode);
      await get().fetchCases();
      toast.success("Case deleted successfully");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete case");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCaseTypes: async () => {
    await useBillingStore.getState().fetchBillingInitialData();
  },

  uploadDocumentToCase: async (caseId, name, file) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        caseId,
        document: file
      };
      const response = await caseDocument(payload);

      const newDoc = response.data?.data || response.data;

      console.log("Document upload response:", newDoc);

      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: [
                  ...(c.documents || []),
                  {
                    name: name || newDoc.name,
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
