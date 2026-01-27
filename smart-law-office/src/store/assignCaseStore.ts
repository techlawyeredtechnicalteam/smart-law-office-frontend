import { create } from "zustand";
import { useCaseStore } from "./createCase";
import { Lawyer } from "@/types/user";
import { getCounsel } from "@/app/api/manageCounse.api";
import { assignCase } from "@/app/api/assignCase.api";
import { getAllCases } from "@/app/api/cases.api";
import { User } from "./authStore";

export interface UnassignedCaseForUI {
  id: string;
  clientName: string;
  caseType: string;
  date: string;
  time: string;
  status: string;
  contractDoc?: { name: string; url: string };
}

interface AssignCasePayload {
  consultCode: string;
  staffEmail: string;
  caseTypeId: string;
}

export interface AssignedCase {
  id: string;
  caseCode: string;
  caseId: string;
  clientName: string;
  caseType: string;
  dateTime: string;
  counselName: string;
  staffEmail?: string;
  staffName?: string;
  counselSpecialty: string;
  assignedAt: string;
  status: "Active" | "Inactive";
}

interface AssignState {
  unassignedCases: UnassignedCaseForUI[];
  counsels: Lawyer[];
  clients: User[];
  assignedCases: AssignedCase[];
  isAssigning: boolean;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  // Helper to find local data by code
  getEnrichedData: (code: string) => AssignedCase | undefined;
  assignCase: (
    consultCode: string,
    counselEmail: string,
    caseTypeId: string,
    caseDetails: UnassignedCaseForUI,
    counselDetails: Lawyer
  ) => Promise<boolean>;
}

// interface AssignState {
//   unassignedCases: UnassignedCaseForUI[];
//   counsels: Lawyer[];
//   clients: User[];
//   assignedCases: AssignedCase[];
//   isAssigning: boolean;
//   isLoading: boolean;
//   error: string | null;

//   fetchData: () => Promise<void>;
//   assignCase: (
//     consultCode: string,
//     counselEmail: string,
//     caseTypeId: string,
//     caseDetails: UnassignedCaseForUI,
//     counselDetails: Lawyer
//   ) => Promise<boolean>;
// }

export const useAssignStore = create<AssignState>()((set, get) => ({
  unassignedCases: [],
  counsels: [],
  clients: [],
  assignedCases: [],
  isAssigning: false,
  isLoading: false,
  error: null,

  getEnrichedData: (code: string) => {
    return get().assignedCases.find((c) => c.caseId === code || c.id === code);
  },

  fetchData: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const [bookedCasesRes, usersRes] = await Promise.all([
        // Use an endpoint that returns cases booked by clients
        // If you don't have one, we can filter existing consultations
        getAllCases(),
        getCounsel()
      ]);

      const transformedCases: UnassignedCaseForUI[] = bookedCasesRes.data
        .filter((c: any) => c.client || c.clientName) // Only show if a client exists
        .map((ct: any) => ({
          id: ct.caseId || ct.id,
          clientName: ct.client?.name || ct.clientName || "Unknown Client",
          caseType: ct.caseType?.name || ct.feeSchedule?.name || "Legal Case",
          date: ct.createdAt
            ? new Date(ct.createdAt).toLocaleDateString()
            : "N/A",
          time: ct.createdAt
            ? new Date(ct.createdAt).toLocaleTimeString()
            : "N/A",
          status: ct.status || "Pending Assignment"
        }));

      // Normalize allUsers to an array
      const rawUsers = usersRes.data?.data || usersRes.data || usersRes || [];
      const allUsers = Array.isArray(rawUsers)
        ? rawUsers
        : Object.values(rawUsers);

      // Filter for STAFF and transform to Lawyer format
      const lawyers: Lawyer[] = allUsers
        .filter((u: any) => u.role === "STAFF")
        .map((u: any) => ({
          id: String(u.userId || u.id),
          userId: String(u.userId || u.id),
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.email,
          role: "STAFF",
          specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
          scn: u.scn || "",
          // Use the property name 'casesCount' everywhere
          casesCount: Number(u.assignedCases || u.casesCount) || 0,
          status:
            Number(u.assignedCases || u.casesCount) >= 5 ? "Busy" : "Active",
          callToBarFile: u.callToBarFile || null
        }));

      // Filter for Clients
      const clients: User[] = allUsers.filter((u: any) => u.role === "CLIENT");

      set({
        unassignedCases: transformedCases,
        counsels: lawyers,
        clients: allUsers.filter((u: any) => u.role === "CLIENT"),
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

  assignCase: async (
    consultCode,
    counselEmail,
    caseTypeId,
    caseDetails,
    counselDetails
  ) => {
    set({ isAssigning: true, error: null });

    try {
      const payload = {
        consultCode,
        staffEmail: counselEmail
      };

      await assignCase(payload);
      // after successful api call, update the main case store to see change immediately
      console.log("AssignCasePayload:", payload);

      const fetchMainCases = useCaseStore.getState().fetchCases;
      await fetchMainCases();

      const newAssignment: AssignedCase = {
        id: Math.random().toString(36).substring(2, 9),
        caseId: consultCode, // Use consultCode as the reference
        clientName: caseDetails.clientName,
        caseType: caseDetails.caseType,
        dateTime: `${caseDetails.date} - ${caseDetails.time}`,
        counselName: counselDetails.name,
        staffEmail: counselEmail,
        staffName: counselDetails.name,
        caseCode: caseDetails.id,
        counselSpecialty: counselDetails.specialty,
        assignedAt: new Date().toISOString(),
        status: "Active"
      };

      set((state) => ({
        assignedCases: [newAssignment, ...state.assignedCases],
        unassignedCases: state.unassignedCases.filter(
          (c) => c.id !== caseDetails.id
        ),

        counsels: state.counsels.map((l) =>
          l.email === counselEmail
            ? {
                ...l,
                casesCount: (l.casesCount || 0) + 1,
                status: l.casesCount + 1 >= 5 ? "Busy" : "Active"
              }
            : l
        ),

        isAssigning: false
      }));

      await useCaseStore.getState().fetchCases();
      return true;
    } catch (err) {
      console.error("Failed to assign case:", err);
      set({
        error: "Failed to assign case. Please try again.",
        isAssigning: false
      });
      return false;
    }
    {
      name: "assignment-persistence";
    }
  }
}));
