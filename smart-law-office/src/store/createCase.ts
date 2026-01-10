import {
  createCase,
  deleteCase,
  getCaseById,
  getCases
} from "@/app/api/cases.api";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { getCaseTypes } from "@/app/api/caseType.api";

export interface CaseType {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

// Backend response structure for Case
export interface Case {
  id: string;
  userId: string;
  consultId: string;
  title: string;
  caseTypeId: string;
  caseCode?: string;
  createdAt: string;
  updatedAt: string;
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
  createCase: (payload: CreateCasePayload) => Promise<boolean>;
  deleteCase: (caseCode: string) => Promise<void>;

  // Helper to reset error
  clearError: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  caseTypes: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Fetching the list for the dropdown
  fetchCaseTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCaseTypes();
      set({ caseTypes: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load case types", isLoading: false });
    }
  },

  // 1.  Fetch Cases, Populates the dashboard
  fetchCases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCases();
      set({ cases: response.data, isLoading: false });
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Failed to fetch cases";
      set({ error: msg, isLoading: false });
    }
  },

  // 2. Create Case, Handle the form sub
  createCase: async (payload: CreateCasePayload) => {
    set({ isLoading: true, error: null });

    try {
      // get userId
      const user = useAuthStore.getState().user;

      if (!user?.id) {
        set({ error: "User not authenticated", isLoading: false });
        return false;
      }

      const backendPayload: BackendCasePayload = {
        userId: user.id,
        title: payload.title,
        caseTypeId: payload.caseTypeId,
        consultId: payload.consultId,
        // ADD THESE:
        status: payload.status,
        date_executed: payload.date,
        notes: payload.notes ?? "",
        document: payload.file ?? "",
        staffEmail: payload.staffEmail,
        clientEmail: payload.clientEmail
      };

      // API Call
      const response = await createCase(backendPayload);

      //Add new case to the top of the list
      set((state) => ({
        cases: [response.data, ...state.cases],
        isLoading: false
      }));

      return true;
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Failed to create case";
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  //3. Delete Case
  deleteCase: async (caseCode) => {
    const previousCases = get().cases;
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== caseCode)
    }));

    try {
      await deleteCase(caseCode);
    } catch (error) {
      set({ cases: previousCases, error: "Failed to delete case" });
    }
  }
}));
