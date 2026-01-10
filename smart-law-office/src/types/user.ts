export enum UserRole {
  ADMIN = "ADMIN", // Likely the role logging in (You)
  LAWYER = "LAWYER", // The counsel role
  CLIENT = "CLIENT",
  STAFF = "STAFF"
}

export interface Lawyer {
  // The unique user ID
  id: string;
  // The staffEmail used in the assignment payload
  email: string;
  // Full name for display
  name: string;
  // The role, which must be 'LAWYER' for assignment
  role: UserRole;

  // Custom properties derived or assumed for the UI display:
  // (These might need mapping if the API doesn't provide them directly)
  specialty: string; // e.g., "Real Estate" - Must be mapped from their profile data
  casesCount: number; // Number of cases currently handled
  status: "Active" | "Inactive" | "On Leave"; // Lawyer's availability status
  avatar: string; // Initials for fallback
}
