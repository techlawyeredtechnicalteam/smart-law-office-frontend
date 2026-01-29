import { create } from "zustand";
import { useCaseStore } from "./createCase";
import { Lawyer } from "@/types/user";
import { getCounsel } from "@/app/api/manageCounse.api";
import { assignCase } from "@/app/api/assignCase.api";
import { getAllConsult } from "@/app/api/bookConsult.api";
import { User } from "./authStore";
import { useBillingStore } from "./setRateBill";

export interface UnassignedCaseForUI {
  id: string; // Maps to consultId
  consultCode: string; // Required for the assignment API
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
  assignedCases: any[]; // Simplified for cleanup
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

  // fetchData: async () => {
  //   if (get().isLoading) return;
  //   set({ isLoading: true });
  //   try {
  //     const [consultRes, usersRes] = await Promise.all([
  //       getAllConsult(),
  //       getCounsel()
  //     ]);

  //     // const transformedCases: UnassignedCaseForUI[] = consultRes.data.map(
  //     //   (ct: any) => ({
  //     //     id: ct.consultId,
  //     //     consultCode: ct.consultCode,
  //     //     clientName: ct.client
  //     //       ? `${ct.client.firstName} ${ct.client.lastName}`.trim()
  //     //       : ct.clientName || "Unknown",
  //     //     caseType: ct.caseType?.name || ct.feeSchedule?.name || "Legal Case",
  //     //     date: ct.createdAt
  //     //       ? new Date(ct.createdAt).toLocaleDateString()
  //     //       : "N/A",
  //     //     time: ct.createdAt
  //     //       ? new Date(ct.createdAt).toLocaleTimeString()
  //     //       : "N/A",
  //     //     status: ct.status
  //     //   })
  //     // );

  //     const transformedCases: UnassignedCaseForUI[] = consultRes.data.map(
  //       (ct: any) => {
  //         // 1. Correct Name Extraction
  //         // Check for ct.client (joined object) OR ct.clientProfile
  //         const firstName =
  //           ct.client?.firstName || ct.clientProfile?.firstName || "";
  //         const lastName =
  //           ct.client?.lastName || ct.clientProfile?.lastName || "";

  //         const fullName = `${firstName} ${lastName}`.trim();

  //         return {
  //           // Use consultId as the unique ID for the UI list
  //           id: ct.consultId || ct.id,
  //           consultCode: ct.consultCode,
  //           // If fullName is empty, use a snippet of the clientId or "Walk-in Client"
  //           clientName:
  //             fullName ||
  //             (ct.clientId
  //               ? `Client (${ct.clientId.slice(0, 5)})`
  //               : "Unknown Client"),
  //           caseType: ct.caseType?.name || ct.feeSchedule?.name || "Legal Case",
  //           date: ct.createdAt
  //             ? new Date(ct.createdAt).toLocaleDateString()
  //             : "N/A",
  //           time: ct.createdAt
  //             ? new Date(ct.createdAt).toLocaleTimeString()
  //             : "N/A",
  //           status: ct.status || "Pending Assignment"
  //         };
  //       }
  //     );
  //     const rawUsers = usersRes.data?.data || usersRes.data || [];
  //     const lawyers = rawUsers
  //       .filter((u: any) => u.role === "STAFF")
  //       .map((u: any) => ({
  //         id: String(u.userId || u.id),
  //         name: u.fullName || `${u.firstName} ${u.lastName}`.trim(),
  //         email: u.email,
  //         specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
  //         casesCount: Number(u.assignedCases) || 0
  //       }));

  //     const clients = rawUsers.filter((u: any) => u.role === "CLIENT");

  //     set({
  //       unassignedCases: transformedCases,
  //       counsels: lawyers,
  //       clients: clients,
  //       isLoading: false
  //     });
  //   } catch (err) {
  //     set({ isLoading: false });
  //   }
  // },

  fetchData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const [consultRes, usersRes] = await Promise.all([
        getAllConsult(),
        getCounsel()
      ]);

      // 1. Normalize raw data - handles [data.data] or [data] or [direct array]
      const rawUsers = usersRes.data?.data || usersRes.data || usersRes || [];
      const allUsers = Array.isArray(rawUsers) ? rawUsers : [];

      // 2. Map Lawyers (Staff) - Case-insensitive role check
      // const lawyerList: Lawyer[] = allUsers
      //   .filter((u: any) => ["STAFF", "ADMIN"].includes(u.role?.toUpperCase()))
      //   .map((u: any) => {
      //     // Determine the literal role value
      //     const roleValue = u.role?.toUpperCase();
      //     const finalRole = (roleValue === "ADMIN" ? "ADMIN" : "STAFF") as
      //       | "STAFF"
      //       | "ADMIN";

      //     // Determine the status value based on workload
      //     const count = Number(u.assignedCases || u.casesCount) || 0;
      //     const finalStatus = (count >= 5 ? "Busy" : "Active") as
      //       | "Active"
      //       | "Inactive"
      //       | "Busy";

      //     return {
      //       id: String(u.userId || u.id),
      //       userId: String(u.userId || u.id),
      //       firstName: u.firstName || "",
      //       lastName: u.lastName || "",
      //       name:
      //         u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      //       email: u.email,
      //       role: finalRole, // Casted to the specific literal type
      //       specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
      //       scn: u.scn || "",
      //       casesCount: count,
      //       status: finalStatus, // Casted to the specific literal type
      //       callToBarFile: u.callToBarFile || null
      //     };
      //   });

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
            casesCount: count, // This ensures the UI gets the right number
            status: finalStatus,
            callToBarFile: u.callToBarFile || null
          };
        });

      // 3. Map Clients - Case-insensitive role check
      // This is what populates your clientOptions dropdown
      const clients = allUsers.filter(
        (u: any) => (u.role || u.userRole || u.type)?.toUpperCase() === "CLIENT"
      );

      const transformFromAPI = (item: any) => ({
        id: item.consultId,
        consultCode: item.consultCode,
        // EXTRACT NESTED NAME:
        clientName: item.client
          ? `${item.client.firstName} ${item.client.lastName || ""} ${item.client.name} ${item.client.fullName}`.trim()
          : "Unknown Client",
        caseType: "Consultation", // Default category
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
        clients: clients, // Set the filtered clients here
        isLoading: false
      });
    } catch (err) {
      console.error("Store Fetch Error:", err);
      set({ isLoading: false });
    }
  },
  assignCase: async (
    consultCode,
    staffEmail,
    caseId,
    caseDetails,
    counselDetails
  ) => {
    set({ isAssigning: true });
    try {
      // THE FIX: We send the consultCode string as required by your 400 error trace
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
