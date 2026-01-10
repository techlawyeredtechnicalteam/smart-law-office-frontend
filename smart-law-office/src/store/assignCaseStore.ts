// src/store/assignCaseStore.ts

import { create } from "zustand";
import api from "@/app/api/api";
import { CaseType } from "@/types/case.schema";
import { UserRole, Lawyer } from "@/types/user";

export interface UnassignedCaseForUI {
  id: string; // The consultCode for assignment
  clientName: string; // Fictional client name for display/filtering
  caseType: string; // The name of the case type
  date: string;
  time: string;
  status: string; // e.g., "Pending Lawyer agreement"
  // Assuming the API provides a contract document link or status
  contractDoc?: { name: string; url: string };
}

// Interface for the data needed to perform assignment
interface AssignCasePayload {
  consultCode: string;
  staffEmail: string; // The email of the lawyer
  caseTypeId: string;
}

// Simplified AssignedCase to match the `AssignCasePage.tsx` table
export interface AssignedCase {
  id: string;
  caseId: string;
  clientName: string;
  caseType: string;
  dateTime: string;
  counselName: string;
  counselSpecialty: string;
  assignedAt: string;
  status: "Active" | "Inactive";
}

// --- Store State & Actions ---

interface AssignState {
  unassignedCases: UnassignedCaseForUI[];
  counsels: Lawyer[];
  assignedCases: AssignedCase[]; // Keeping assigned cases in local state for the dashboard
  isAssigning: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchData: () => Promise<void>;
  assignCase: (
    consultCode: string,
    counselEmail: string,
    caseTypeId: string,
    caseDetails: UnassignedCaseForUI,
    counselDetails: Lawyer
  ) => Promise<boolean>;
}

export const useAssignStore = create<AssignState>((set, get) => ({
  unassignedCases: [],
  counsels: [],
  assignedCases: [],
  isAssigning: false,
  isLoading: false,
  error: null,

  // Async function to fetch all necessary data
  fetchData: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      // 1. Fetch Case Types (Acting as Unassigned Cases in this refactor)
      // We will assume the API for unassigned cases is what should be used,
      // but since it's not provided, we use case-types and mock the rest.
      const unassignedCasesRes = await api.get<CaseType[]>(
        "/api/v1/case-types"
      );

      // Transform CaseType[] to UnassignedCaseForUI[]
      const transformedCases: UnassignedCaseForUI[] =
        unassignedCasesRes.data.map((caseType) => ({
          id: caseType.id || "",
          clientName: "Pending Assignment", // Mock data - replace with actual client name from API
          caseType: caseType.name || "",
          date: new Date().toLocaleDateString(), // Mock data - replace with actual date
          time: new Date().toLocaleTimeString(), // Mock data - replace with actual time
          status: "Pending Lawyer agreement",
          // Add contractDoc if available in CaseType
          contractDoc: undefined
        }));

      // 2. Fetch Lawyers (Users)
      const counselsRes = await api.get<{ data: Lawyer[] }>("/api/v1/users");
      // Filter users to find lawyers (assuming UserRole is defined and 'LAWYER' is the role)
      const lawyers = counselsRes.data.data.filter(
        (user) => user.role === UserRole.LAWYER
      );

      set({
        unassignedCases: transformedCases,
        counsels: lawyers,
        isLoading: false
      });
    } catch (err) {
      console.error("Failed to fetch assignment data:", err);
      set({
        error: "Failed to load assignment data.",
        isLoading: false
      });
    }
  },

  // Action to assign a case
  assignCase: async (
    consultCode,
    counselEmail,
    caseTypeId,
    caseDetails,
    counselDetails
  ) => {
    set({ isAssigning: true, error: null });
    try {
      const payload: AssignCasePayload = {
        consultCode,
        staffEmail: counselEmail,
        caseTypeId
      };

      await api.post("/api/v1/cases/assign-case", payload);

      // On successful assignment, update local state:
      const newAssignment: AssignedCase = {
        id: Math.random().toString(36).substring(2, 9),
        caseId: caseDetails.id,
        clientName: caseDetails.clientName,
        caseType: caseDetails.caseType,
        dateTime: `${caseDetails.date} - ${caseDetails.time}`,
        counselName: counselDetails.name,
        counselSpecialty: counselDetails.specialty,
        assignedAt: new Date().toISOString(),
        status: "Active"
      };

      set((state) => ({
        assignedCases: [newAssignment, ...state.assignedCases],
        unassignedCases: state.unassignedCases.filter(
          (c) => c.id !== caseDetails.id
        ),
        isAssigning: false
      }));
      return true; // Success
    } catch (err) {
      console.error("Failed to assign case:", err);
      set({
        error: "Failed to assign case. Please try again.",
        isAssigning: false
      });
      return false; // Failure
    }
  }
}));
