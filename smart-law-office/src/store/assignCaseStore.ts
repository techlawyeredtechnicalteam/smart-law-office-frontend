import { create } from "zustand";
import { useCaseStore } from "./createCase";
import { Lawyer } from "@/types/user";
import { getCounsel } from "@/app/api/manageCounse.api";
import { assignCase } from "@/app/api/assignCase.api";
import { getAllConsult } from "@/app/api/bookConsult.api";
import { useAuthStore, User } from "./authStore";

export interface UnassignedCaseForUI {
  id: string;
  consultCode: string;
  clientName: string;
  caseType: string;
  date: string;
  time: string;
  status: string;
  notes: string;
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
  assignedCases: any[];
  isAssigning: boolean;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  assignCase: (
    consultCode: string,
    counselEmail: string,
    caseId: string,
    caseDetails: UnassignedCaseForUI,
    counselDetails: Lawyer
  ) => Promise<boolean>;
}

export const useAssignStore = create<AssignState>()((set, get) => ({
  unassignedCases: [],
  counsels: [],
  clients: [],
  assignedCases: [],
  isAssigning: false,
  isLoading: false,

  fetchData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === "ADMIN";

    try {
      const [consultRes, usersRes] = await Promise.all([
        isAdmin ? getAllConsult() : Promise.resolve({ data: [] }),
        getCounsel()
      ]);

      // 1. Normalize raw data - handles [data.data] or [data] or [direct array]
      const rawUsers = usersRes.data?.data || usersRes.data || usersRes || [];
      const allUsers = Array.isArray(rawUsers) ? rawUsers : [];

      const lawyerList: Lawyer[] = allUsers
        .filter((u: any) => {
          const role = u.role?.toUpperCase();
          const name = (u.fullName || u.firstName || "").toLowerCase();
          // Exclusion logic: must be STAFF and not a "Firm" account name
          return role === "STAFF" && !name.includes("firm");
        })
        .map((u: any) => {
          // Determine the literal role value
          const roleValue = u.role?.toUpperCase();
          const finalRole = (roleValue === "ADMIN" ? "ADMIN" : "STAFF") as
            | "STAFF"
            | "ADMIN";

          // Use a unified count field from the API
          const count = Number(u.assignedCases || u.casesCount || 0);

          const finalStatus = (count >= 5 ? "Busy" : "Active") as
            | "Active"
            | "Inactive"
            | "Busy";

          return {
            id: String(u.userId || u.id),
            userId: String(u.userId || u.id),
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            name:
              u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email,
            role: finalRole,
            specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
            scn: u.scn || "",
            casesCount: count,
            status: finalStatus,
            callToBarFile: u.callToBarFile || null
          };
        });

      // 3. Map Clients - Case-insensitive role check     
      const clients = allUsers.filter(
        (u: any) => (u.role || u.userRole || u.type)?.toUpperCase() === "CLIENT"
      );

      const transformFromAPI = (item: any) => ({
        id: item.consultId,
        consultCode: item.consultCode,       
        clientName: item.client
          ? `${item.client.firstName} ${item.client.lastName || ""} ${item.client.name} ${item.client.fullName}`.trim()
          : "Unknown Client",
        caseType: "Consultation",
        notes: item.consultNotes?.description || "No notes",
        date: item.consultAt
          ? new Date(item.consultAt).toLocaleDateString()
          : "N/A",
        time: item.consultAt
          ? new Date(item.consultAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          : ""
      });

      set({
        unassignedCases: (consultRes.data || []).map(transformFromAPI),
        counsels: lawyerList,
        clients: clients,
        isLoading: false
      });
    } catch (err) {
      console.error("Store Fetch Error:", err);
      set({ isLoading: false });
    }
  },

  assignCase: async (consultCode, staffEmail) => {
    set({ isAssigning: true });
    try {    
      await assignCase({ consultCode, staffEmail });

      await useCaseStore.getState().fetchCases();

      set((state) => ({
        unassignedCases: state.unassignedCases.filter(
          (c) => c.consultCode !== consultCode
        ),
        isAssigning: false
      }));
      return true;
    } catch (err) {
      set({ isAssigning: false });
      return false;
    }
  }
}));
