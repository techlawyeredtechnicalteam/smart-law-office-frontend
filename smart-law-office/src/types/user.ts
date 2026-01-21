// @/types/user.ts
export interface Lawyer {
  id: string; // Unified ID
  userId: string;
  firstName: string;
  lastName: string;
  name: string; // Full name
  email: string;
  role: "STAFF" | "ADMIN" | "CLIENT";
  specialty: string;
  casesCount: number; // Single source of truth for workload
  scn?: string; // Supreme Court Number
  status: "Active" | "Inactive" | "Busy";
  callToBarFile?: string | null;
  fullName?: string;
  assignedCases?: string | number;
}
