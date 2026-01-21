import { create, StateCreator } from "zustand";
// import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  addCounsel,
  CounselPayload,
  deleteCounsel,
  fetchCounsel,
  updateCounsel
} from "@/app/api/manageCounse.api";
import { Lawyer } from "@/types/user";
import { useAssignStore } from "./assignCaseStore";

export interface Notification {
  type: "success" | "info" | "error";
  message: string;
  details: string;
}

export interface Counsel {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  scn: string;
  email: string;
  callToBarFile: string | null;
  status: "Active" | "Inactive";
  assignedCases: string;
  role: "STAFF";
  caseCount?: number;
}

// Helper to trasnform API data to counsel interface
const mapToCounsel = (data: any): Lawyer => {
  // Force conversion to number to prevent "string vs number" overlap errors
  const count = Number(data.assignedCases || data.casesCount || 0);

  return {
    id: String(data.userId || data.id),
    userId: String(data.userId || data.id),
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    name:
      data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
    email: data.email,
    role: "STAFF",
    specialty:
      data.specialty || (data.scn ? `SCN: ${data.scn}` : "General Practice"),
    scn: data.scn || "",
    casesCount: count, // This is now a true number
    status: count >= 5 ? "Busy" : "Active", // Safe number comparison
    callToBarFile: data.callToBarFile || data.barCertificate || null
  };
};

export interface ManageCounselStore {
  // State
  counsel: Lawyer[];
  isLoading: boolean;
  callToBarFile: string | null;
  notifications: Notification[];
  lastAddedCounsel: Lawyer | null;

  // Modal State
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isUpgradeModalOpen: boolean;
  selectedCounsel: Lawyer | null;

  // Actions
  setFile: (file: string | null) => void;
  addNotification: (notif: Omit<Notification, "timestamp">) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (counsel: Lawyer) => void;
  closeEditModal: () => void;
  openDeleteModal: (counsel: Lawyer) => void;
  closeDeleteModal: () => void;
  closeUpgradeModal: () => void;
  fetchCounsels: () => Promise<void>;
  addCounsel: (payload: CounselPayload) => Promise<void>;
  updateCounsel: (
    id: string,
    updatedFields: Partial<CounselPayload>
  ) => Promise<void>;
  setLastAddedCounsel: (counsel: Lawyer | null) => void;

  deleteCounsel: (id: string) => Promise<void>;
}

const store: StateCreator<ManageCounselStore> = (set, get) => ({
  counsel: [],
  notifications: [],
  lastAddedCounsel: null,
  isLoading: false,
  callToBarFile: null,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedCounsel: null,
  isUpgradeModalOpen: false,

  setLastAddedCounsel: (counsel) => set({ lastAddedCounsel: counsel }),

  setFile: (file: string | null) => set({ callToBarFile: file }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        { ...notif, timestamp: new Date() },
        ...state.notifications
      ].slice(0, 20)
    })),

  // Modal Logic
  openAddModal: () => {
    const hasActiveSubscription = true;
    hasActiveSubscription
      ? set({ isAddModalOpen: true })
      : set({ isUpgradeModalOpen: true });
  },

  closeAddModal: () => set({ isAddModalOpen: false, callToBarFile: null }),

  openEditModal: (counsel) =>
    set({ isEditModalOpen: true, selectedCounsel: counsel }),

  closeEditModal: () => set({ isEditModalOpen: false, selectedCounsel: null }),

  openDeleteModal: (counsel) =>
    set({ isDeleteModalOpen: true, selectedCounsel: counsel }),

  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedCounsel: null }),

  closeUpgradeModal: () => set({ isUpgradeModalOpen: false }),

  // --- API/Data Logic
  fetchCounsels: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const response = await fetchCounsel();
      // Handle different response structures
      const rawData = response.data?.data || response.data || [];
      const staff = rawData.filter((u: any) => u.role === "STAFF");
      set({ counsel: staff.map(mapToCounsel) });
    } catch (error) {
      toast.error("Failed to load counsels");
    } finally {
      set({ isLoading: false });
    }
  },

  addCounsel: async (payload: CounselPayload) => {
    set({ isLoading: true });
    try {
      const response = await addCounsel(payload);

      const newCounsel = mapToCounsel(response.data?.data || response.data);

      await get().fetchCounsels();

      // 1. Set the last added counsel for the banner
      set({
        lastAddedCounsel: newCounsel,
        isAddModalOpen: false //
      });
      toast.success("Counsel Added!", {
        description: "You have successfully added a new counsel to your team."
      });

      // 2. Add to header notifications
      get().addNotification({
        type: "success",
        message: "Counsel Added",
        details: `${newCounsel.name} was successfully added to your team.`
      });
    } catch (error) {
      toast.error("Failed to add counsel. Please try again.");
    } finally {
      set({ isLoading: false });
    }
  },

  updateCounsel: async (id: string, updatedFields) => {
    set({ isLoading: true });
    try {
      await updateCounsel(id);
      await get().fetchCounsels();
      await useAssignStore.getState().fetchData();

      set({ isEditModalOpen: false, selectedCounsel: null });

      // Custom Success Toast
      toast("Update Successful", {
        description: "The Counsel's details have been saved.",
        duration: 3000
      });
    } catch (error) {
      toast.error("Failed to update counsel.");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCounsel: async (id) => {
    set({ isLoading: true });
    const counselToRemove = get().counsel.find((c) => c.id === id);

    try {
      await deleteCounsel(String(id));
      await get().fetchCounsels();
      set({ isDeleteModalOpen: false, selectedCounsel: null });

      toast.success("Counsel removed successfully.");
      get().addNotification({
        type: "info",
        message: "Counsel Removed",
        details: `${
          counselToRemove?.name || "A Staff member"
        } has been deactivated`
      });
    } catch (error) {
      toast.error("Failed to delete counsel.");
    } finally {
      set({ isLoading: false });
    }
  }
});

export const useCounselStore = create<ManageCounselStore>()(store);
