// import { create } from "zustand";
// import { useCaseStore } from "./createCase";
// import { Lawyer } from "@/types/user";
// import { getCounsel } from "@/app/api/manageCounse.api";
// import { assignCase } from "@/app/api/assignCase.api";
// import { getAllCases, getAllCasesDirect } from "@/app/api/cases.api";
// import { User } from "./authStore";
// import { getAllConsult } from "@/app/api/bookConsult.api";

// export interface UnassignedCaseForUI {
//   id: string;
//   clientName: string;
//   caseType: string;
//   date: string;
//   time: string;
//   status: string;
//   contractDoc?: { name: string; url: string };
// }

// interface AssignCasePayload {
//   consultCode: string;
//   staffEmail: string;
//   caseTypeId: string;
// }

// export interface AssignedCase {
//   id: string;
//   caseCode: string;
//   caseId: string;
//   clientName: string;
//   caseType: string;
//   dateTime: string;
//   counselName: string;
//   staffEmail?: string;
//   staffName?: string;
//   counselSpecialty: string;
//   assignedAt: string;
//   status: "Active" | "Inactive";
// }

// interface AssignState {
//   unassignedCases: UnassignedCaseForUI[];
//   counsels: Lawyer[];
//   clients: User[];
//   assignedCases: AssignedCase[];
//   isAssigning: boolean;
//   isLoading: boolean;
//   error: string | null;
//   fetchData: () => Promise<void>;
//   // Helper to find local data by code
//   getEnrichedData: (code: string) => AssignedCase | undefined;
//   assignCase: (
//     consultCode: string,
//     counselEmail: string,
//     caseTypeId: string,
//     caseDetails: UnassignedCaseForUI,
//     counselDetails: Lawyer
//   ) => Promise<boolean>;
// }

// // interface AssignState {
// //   unassignedCases: UnassignedCaseForUI[];
// //   counsels: Lawyer[];
// //   clients: User[];
// //   assignedCases: AssignedCase[];
// //   isAssigning: boolean;
// //   isLoading: boolean;
// //   error: string | null;

// //   fetchData: () => Promise<void>;
// //   assignCase: (
// //     consultCode: string,
// //     counselEmail: string,
// //     caseTypeId: string,
// //     caseDetails: UnassignedCaseForUI,
// //     counselDetails: Lawyer
// //   ) => Promise<boolean>;
// // }

// export const useAssignStore = create<AssignState>()((set, get) => ({
//   unassignedCases: [],
//   counsels: [],
//   clients: [],
//   assignedCases: [],
//   isAssigning: false,
//   isLoading: false,
//   error: null,

//   getEnrichedData: (code: string) => {
//     return get().assignedCases.find((c) => c.caseId === code || c.id === code);
//   },

//   fetchData: async () => {
//     if (get().isLoading) return;

//     set({ isLoading: true, error: null });

//     try {
//       const [bookedCasesRes, usersRes] = await Promise.all([
//         // Use an endpoint that returns cases booked by clients
//         // If you don't have one, we can filter existing consultations
//         getAllConsult(),
//         getCounsel()
//       ]);

//       // const transformedCases: UnassignedCaseForUI[] = bookedCasesRes.data
//       //   .filter((c: any) => c.client || c.clientName) // Only show if a client exists
//       //   .map((ct: any) => ({
//       //     id: ct.caseId || ct.id,
//       //     clientName: ct.client?.name || ct.clientName || "Unknown Client",
//       //     caseType:
//       //       ct.caseType?.name || ct.feeSchedule?.caseTypeId || "Legal Case",
//       //     date: ct.createdAt
//       //       ? new Date(ct.createdAt).toLocaleDateString()
//       //       : "N/A",
//       //     time: ct.createdAt
//       //       ? new Date(ct.createdAt).toLocaleTimeString()
//       //       : "N/A",
//       //     status: ct.status || "Pending Assignment"
//       //   }));
//       const transformedCases: UnassignedCaseForUI[] = bookedCasesRes.data.map(
//         (ct: any) => {
//           // 1. Correct Name Construction
//           const clientFirstName = ct.client?.firstName || "";
//           const clientLastName = ct.client?.lastName || "";
//           const fullName =
//             `${clientFirstName} ${clientLastName}`.trim() ||
//             ct.clientName ||
//             "Unknown Client";

//           return {
//             // 2. Map directCaseId instead of caseId if using getAllCasesDirect
//             id: ct.directCaseId || ct.caseId || ct.id,
//             clientName: fullName,
//             caseType: ct.caseType?.name || ct.feeSchedule?.name || "Legal Case",
//             date: ct.createdAt
//               ? new Date(ct.createdAt).toLocaleDateString()
//               : "N/A",
//             time: ct.createdAt
//               ? new Date(ct.createdAt).toLocaleTimeString()
//               : "N/A",
//             status: ct.status || "Pending Assignment"
//           };
//         }
//       );

//       // Normalize allUsers to an array
//       const rawUsers = usersRes.data?.data || usersRes.data || usersRes || [];
//       const allUsers = Array.isArray(rawUsers)
//         ? rawUsers
//         : Object.values(rawUsers);

//       // Filter for STAFF and transform to Lawyer format
//       const lawyers: Lawyer[] = allUsers
//         .filter((u: any) => u.role === "STAFF")
//         .map((u: any) => ({
//           id: String(u.userId || u.id),
//           userId: String(u.userId || u.id),
//           firstName: u.firstName || "",
//           lastName: u.lastName || "",
//           name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
//           email: u.email,
//           role: "STAFF",
//           specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
//           scn: u.scn || "",
//           // Use the property name 'casesCount' everywhere
//           casesCount: Number(u.assignedCases || u.casesCount) || 0,
//           status:
//             Number(u.assignedCases || u.casesCount) >= 5 ? "Busy" : "Active",
//           callToBarFile: u.callToBarFile || null
//         }));

//       set({
//         unassignedCases: transformedCases,
//         counsels: lawyers,
//         clients: allUsers.filter((u: any) => u.role === "CLIENT"),
//         isLoading: false
//       });
//     } catch (err) {
//       console.error("Failed to fetch assignment data:", err);
//       set({
//         error: "Failed to load assignment data.",
//         isLoading: false
//       });
//     }
//   },

//   assignCase: async (
//     consultCode,
//     counselEmail,
//     caseTypeId,
//     caseDetails,
//     counselDetails
//   ) => {
//     set({ isAssigning: true, error: null });

//     try {
//       const payload = {
//         consultCode,
//         staffEmail: counselEmail
//       };

//       console.log("Payload:", payload);

//       await assignCase(payload);
//       // after successful api call, update the main case store to see change immediately
//       console.log("AssignCasePayload:", payload);

//       const fetchMainCases = useCaseStore.getState().fetchCases;
//       await fetchMainCases();

//       const newAssignment: AssignedCase = {
//         id: caseDetails.id || `temp-${Math.random()}`,
//         caseId: consultCode, // Use consultCode as the reference
//         clientName: caseDetails.clientName,
//         caseType: caseDetails.caseType,
//         dateTime: `${caseDetails.date} - ${caseDetails.time}`,
//         counselName: counselDetails.name,
//         staffEmail: counselEmail,
//         staffName: counselDetails.name,
//         caseCode: caseDetails.id,
//         counselSpecialty: counselDetails.specialty,
//         assignedAt: new Date().toISOString(),
//         status: "Active"
//       };

//       set((state) => ({
//         assignedCases: [newAssignment, ...state.assignedCases],
//         unassignedCases: state.unassignedCases.filter(
//           (c) => c.id !== caseDetails.id
//         ),

//         counsels: state.counsels.map((l) =>
//           l.email === counselEmail
//             ? {
//                 ...l,
//                 casesCount: (l.casesCount || 0) + 1,
//                 status: l.casesCount + 1 >= 5 ? "Busy" : "Active"
//               }
//             : l
//         ),

//         isAssigning: false
//       }));

//       await useCaseStore.getState().fetchCases();
//       return true;
//     } catch (err) {
//       console.error("Failed to assign case:", err);
//       set({
//         error: "Failed to assign case. Please try again.",
//         isAssigning: false
//       });
//       return false;
//     }
//     {
//       name: "assignment-persistence";
//     }
//   }
// }));

import { create } from "zustand";
import { useCaseStore } from "./createCase";
import { Lawyer } from "@/types/user";
import { getCounsel } from "@/app/api/manageCounse.api";
import { assignCase } from "@/app/api/assignCase.api";
import { getAllConsult } from "@/app/api/bookConsult.api";
import { User } from "./authStore";

export interface UnassignedCaseForUI {
  id: string; // Maps to consultId
  consultCode: string; // Required for the assignment API
  clientName: string;
  caseType: string;
  date: string;
  time: string;
  status: string;
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
      const lawyerList: Lawyer[] = allUsers
        .filter((u: any) => ["STAFF", "ADMIN"].includes(u.role?.toUpperCase()))
        .map((u: any) => {
          // Determine the literal role value
          const roleValue = u.role?.toUpperCase();
          const finalRole = (roleValue === "ADMIN" ? "ADMIN" : "STAFF") as
            | "STAFF"
            | "ADMIN";

          // Determine the status value based on workload
          const count = Number(u.assignedCases || u.casesCount) || 0;
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
            role: finalRole, // Casted to the specific literal type
            specialty: u.scn ? `SCN: ${u.scn}` : "General Practice",
            scn: u.scn || "",
            casesCount: count,
            status: finalStatus, // Casted to the specific literal type
            callToBarFile: u.callToBarFile || null
          };
        });

      // 3. Map Clients - Case-insensitive role check
      // This is what populates your clientOptions dropdown
      const clients = allUsers.filter(
        (u: any) => (u.role || u.userRole || u.type)?.toUpperCase() === "CLIENT"
      );

      // 4. Map Unassigned Cases
      const transformedCases: UnassignedCaseForUI[] = (
        consultRes.data || []
      ).map((ct: any) => {
        const firstName =
          ct.client?.firstName || ct.clientProfile?.firstName || "";
        const lastName =
          ct.client?.lastName || ct.clientProfile?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();

        return {
          id: ct.consultId || ct.id,
          consultCode: ct.consultCode,
          clientName:
            fullName ||
            (ct.clientId
              ? `Client (${ct.clientId.slice(0, 5)})`
              : "Unknown Client"),
          caseType: ct.caseType?.name || ct.feeSchedule?.name || "Legal Case",
          date: ct.createdAt
            ? new Date(ct.createdAt).toLocaleDateString()
            : "N/A",
          time: ct.createdAt
            ? new Date(ct.createdAt).toLocaleTimeString()
            : "N/A",
          status: ct.status || "Pending Assignment"
        };
      });

      set({
        unassignedCases: transformedCases,
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
