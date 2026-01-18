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
}

// Helper to trasnform API data to counsel interface
const mapToCounsel = (data: any): Counsel => ({
  id: data.userId || data.id,
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  fullName:
    data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
  scn: data.scn,
  email: data.email,
  callToBarFile: data.callToBarFile || data.barCertificate,
  status: data.status || "Inactive",
  assignedCases: String(data.assignedCases || "0"),
  role: "STAFF"
});

export interface ManageCounselStore {
  // State
  counsel: Counsel[];
  isLoading: boolean;
  callToBarFile: string | null;
  notifications: Notification[];
  lastAddedCounsel: Counsel | null;

  // Modal State
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isUpgradeModalOpen: boolean;
  selectedCounsel: Counsel | null;

  // Actions
  setFile: (file: string | null) => void;
  addNotification: (notif: Omit<Notification, "timestamp">) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (counsel: Counsel) => void;
  closeEditModal: () => void;
  openDeleteModal: (counsel: Counsel) => void;
  closeDeleteModal: () => void;
  closeUpgradeModal: () => void;
  fetchCounsels: () => Promise<void>;
  addCounsel: (payload: CounselPayload) => Promise<void>;
  updateCounsel: (
    id: number,
    updatedFields: Partial<CounselPayload>
  ) => Promise<void>;
  setLastAddedCounsel: (counsel: Counsel | null) => void;

  deleteCounsel: (id: number) => Promise<void>;
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
        details: `${newCounsel.fullName} was successfully added to your team.`
      });
    } catch (error) {
      toast.error("Failed to add counsel. Please try again.");
    } finally {
      set({ isLoading: false });
    }
  },

  updateCounsel: async (id, updatedFields) => {
    set({ isLoading: true });
    try {
      await updateCounsel(String(id));
      await get().fetchCounsels();

      set({ isEditModalOpen: false, selectedCounsel: null });

      // Custom Success Toast
      toast("Update Successful", {
        description: "The Counsel's details have been saved.",
        // icon: <CheckCircle className="h-4 w-4 text-white" />,
        // className: "bg-white text-black border-l-4 border-green-500",
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
          counselToRemove?.fullName || "A Staff member"
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
