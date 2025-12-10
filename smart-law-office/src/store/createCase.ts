import { createCase, getCaseById, getCases } from "@/app/api/cases.api";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface CaseDocument {
  id: string;
  name: string; // payment receipt for example
  size: string; // something KN
  url: string; // Path to download
}

export interface Case {
  id: string;

  // Fields from the Create Case Form
  clientName: string; // Name
  caseType: string; // Type of Case
  date: string; // Date or ISO
  time: string; // Time
  lastAdjournedDate?: string; //optional
  nextAdjournedDate?: string; // optional
  status: "Scheduled" | "Pending" | "Completed" | "Active"; //

  // Complex Fields
  documents: CaseDocument[]; // Array to hold the uploaded files
  notes: string; // "Notes The text area"
  // text: string;
  createdAt: string; // Timestamp
}

// what will send to the api to create Case (id is usually omitted )
export type CreateCasePayload = Omit<Case, "id" | "createdAt" | "documents"> & {
  // send the file IDs
  documents?: string[];
};

interface CaseState {
  cases: Case[];
  isLoading: boolean;
  error: string | null;

  // API Interactions
  fetchCases: () => Promise<void>;
  createCase: (payload: CreateCasePayload) => Promise<boolean>;
  deleteCase: (caseId: string) => Promise<void>;

  // Helper to reset error
  clearError: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

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
  createCase: async (payload) => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Create a mock case object
      const mockCase: Case = {
        id: `case-${Date.now()}`, // Generate unique ID
        ...payload,
        documents: [], // Empty for now, or mock some documents
        createdAt: new Date().toISOString(),
        lastAdjournedDate: payload.lastAdjournedDate,
        nextAdjournedDate: payload.nextAdjournedDate
      };

      // Add new case to the top of the list
      set((state) => ({
        cases: [mockCase, ...state.cases],
        isLoading: false
      }));

      return true; // success
    } catch (error) {
      set({ error: "Failed to create case", isLoading: false });
      return false;
    }
    // try {
    //   // API Call
    //   const response = await createCase(payload);

    //   //Add new case to the top of the list
    //   set((state) => ({
    //     cases: [response.data, ...state.cases],
    //     isLoading: false
    //   }));

    //   return true; // success signal to close the modal
    // } catch (error) {
    //   const msg =
    //     error instanceof AxiosError
    //       ? error.response?.data?.message
    //       : "Failed to create case";
    //   set({ error: msg, isLoading: false });
    //   return false;
    // }
  },

  //3. Delete Case
  deleteCase: async (caseId) => {
    //remove immediately for spedd
    const previousCases = get().cases;
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== caseId)
    }));

    try {
      await getCaseById(caseId);
    } catch (error) {
      set({ cases: previousCases, error: "Failed to delete case" });
    }
  }
}));
