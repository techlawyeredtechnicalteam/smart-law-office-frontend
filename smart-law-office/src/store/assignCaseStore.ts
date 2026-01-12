import { create } from "zustand";
import { CaseType } from "./createCase";
import { Lawyer } from "@/types/user";
import { getCounsel } from "@/app/api/manageCounse.api";
import { assignCase } from "@/app/api/assignCase.api";
import { getAdminCaseTypes } from "@/app/api/caseType.api";
import { getAllCases, getCases } from "@/app/api/cases.api";

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
  caseId: string;
  clientName: string;
  caseType: string;
  dateTime: string;
  counselName: string;
  counselSpecialty: string;
  assignedAt: string;
  status: "Active" | "Inactive";
}

interface AssignState {
  unassignedCases: UnassignedCaseForUI[];
  counsels: Lawyer[];
  assignedCases: AssignedCase[];
  isAssigning: boolean;
  isLoading: boolean;
  error: string | null;

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

  fetchData: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      // const [unassignedCasesRes, usersRes] = await Promise.all([
      //   getAllCases(),
      //   getCounsel()
      const [bookedCasesRes, usersRes] = await Promise.all([
        // Use an endpoint that returns cases booked by clients
        // If you don't have one, we can filter existing consultations
        getAllCases(),
        getCounsel()
      ]);

      // const transformedCases: UnassignedCaseForUI[] =
      //   unassignedCasesRes.data.map((ct: any, index: number) => ({
      //     id: ct.caseTypeId || ct.id || `case-${Date.now()}-${index}`,
      //     clientName: "Pending Assignment",
      //     caseType: ct.feeSchedule?.name || ct.name || "General Case",
      //     date: new Date().toLocaleDateString(),
      //     time: new Date().toLocaleTimeString(),
      //     status: "Pending Lawyer agreement"
      //   }));
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

      // FIX: Convert object with numeric keys to array
      let allUsers: any[] = [];

      if (usersRes.data) {
        // Check if it's an object with numeric keys
        if (
          typeof usersRes.data === "object" &&
          !Array.isArray(usersRes.data)
        ) {
          allUsers = Object.values(usersRes.data);
        } else if (Array.isArray(usersRes.data)) {
          allUsers = usersRes.data;
        }
      } else if (Array.isArray(usersRes)) {
        allUsers = usersRes;
      } else if (typeof usersRes === "object") {
        allUsers = Object.values(usersRes);
      }

      // Filter for STAFF and transform to Lawyer format
      const lawyers: Lawyer[] = allUsers
        .filter((u: any) => u.role === "STAFF")
        .map((u: any) => ({
          id: u.userId,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
          casesCount: 0, // You can update this if you have case count data
          firstName: u.firstName,
          lastName: u.lastName,
          userId: u.userId
        }));

      console.log("Transformed lawyers:", lawyers);

      // set({
      //   unassignedCases: transformedCases,
      //   counsels: lawyers,
      //   isLoading: false
      // });
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

      await assignCase(payload);

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

      return true;
    } catch (err) {
      console.error("Failed to assign case:", err);
      set({
        error: "Failed to assign case. Please try again.",
        isAssigning: false
      });
      return false;
    }
  }
}));
