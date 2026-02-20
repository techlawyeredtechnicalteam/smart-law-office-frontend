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
  assignedCases: AssignedCase[]; // was any[]
  isAssigning: boolean;
  isLoading: boolean;
  fetchUnassigned: () => Promise<void>;
  assignCase: (
    consultCode: string,
    counselEmail: string,
    caseId: string,
    caseDetails: UnassignedCaseForUI,
    counselDetails: Lawyer
  ) => Promise<boolean>;
}

const mapToLawyer = (u: any): Lawyer => {
  const casesCount = Number(u.assignedCases || u.casesCount || 0);

  return {
    id: String(u.userId || u.id),
    userId: String(u.userId || u.id),
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    email: u.email,
    role: "STAFF",
    specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
    scn: u.scn || "",
    casesCount,
    status: casesCount >= 5 ? "Busy" : "Active",
    callToBarFile: u.callToBarFile || null
  };
};
const resolveClientName = (client: any): string => {
  if (!client) return "Unknown Client";
  return (
    client.fullName ||
    `${client.firstName || ""} ${client.lastName || ""}`.trim() ||
    client.name ||
    "Unknown Client"
  );
};

const mapToUnassignedCase = (item: any): UnassignedCaseForUI => {
  const consultDate = item.consultAt ? new Date(item.consultAt) : null;

  return {
    id: item.consultId,
    consultCode: item.consultCode,
    clientName: resolveClientName(item.client),
    caseType: "Consultation",
    notes: item.consultNotes?.description || "No notes",
    status: item.status || "Pending",
    date: consultDate ? consultDate.toLocaleDateString() : "N/A",
    time: consultDate
      ? consultDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : ""
  };
};

export const useAssignStore = create<AssignState>()((set, get) => ({
  unassignedCases: [],
  counsels: [],
  clients: [],
  assignedCases: [],
  isAssigning: false,
  isLoading: false,

  fetchUnassigned: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    const isAdmin = useAuthStore.getState().user?.role === "ADMIN";

    try {
      const [consultRes, usersRes] = await Promise.all([
        isAdmin ? getAllConsult() : Promise.resolve({ data: [] }),
        getCounsel()
      ]);

      const rawUsers: any[] = usersRes.data?.data || usersRes.data || [];

      const counsels = rawUsers
        .filter((u) => {
          const role = u.role?.toUpperCase();
          const name = (u.fullName || u.firstName || "").toLowerCase();
          // Only STAFF who aren't the firm account itself
          return role === "STAFF" && !name.includes("firm");
        })
        .map(mapToLawyer);

      const clients = rawUsers.filter(
        (u) => (u.role || u.userRole || u.type)?.toUpperCase() === "CLIENT"
      );

      const unassignedCases = (consultRes.data || []).map(mapToUnassignedCase);

      set({ counsels, clients, unassignedCases, isLoading: false });
    } catch (err) {
      console.error("fetchUnassigned error:", err);
      set({ isLoading: false });
    }
  },

  assignCase: async (consultCode, staffEmail) => {
    set({ isAssigning: true });
    try {
      await assignCase({ consultCode, staffEmail });

      await useCaseStore.getState().fetchCases();

      set((state) => ({
        isAssigning: false,
        unassignedCases: state.unassignedCases.filter(
          (c) => c.consultCode !== consultCode
        )
      }));

      return true;
    } catch (err) {
      console.error("assignCase error:", err);
      set({ isAssigning: false });
      return false;
    }
  }
}));
