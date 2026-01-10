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

export interface ManageCounselStore {
  // State
  counsel: Counsel[];
  isSubmitting: boolean;
  callToBarFile: string | null;
  isLoading: boolean;

  // Modal State
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedCounsel: Counsel | null;

  // New Modal State
  isUpgradeModalOpen: boolean;

  // New Modal Actions
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;

  notifications: Notification[];
  lastAddedCounsel: Counsel | null;

  setLastAddedCounsel: (counsel: Counsel | null) => void;

  // New Action
  addNotification: (notification: Notification) => void;

  // Actions
  setCounsels: (data: Counsel[]) => void;
  setIsSubmitting: (status: boolean) => void;
  setFile: (file: string | null) => void;
  // Modal Control
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (counsel: Counsel) => void;
  closeEditModal: () => void;
  openDeleteModal: (counsel: Counsel) => void;
  closeDeleteModal: () => void;

  // API Operations (Placeholders for component use)
  addCounsel: (payload: CounselPayload) => Promise<void>;
  updateCounsel: (
    id: number,
    updatedFields: Partial<CounselPayload>
  ) => Promise<void>;
  deleteCounsel: (id: number) => Promise<void>;
  fetchCounsels: () => Promise<void>;
}

const store: StateCreator<ManageCounselStore> = (set, get) => ({
  counsel: [],
  isSubmitting: false,
  callToBarFile: null,
  isLoading: false,

  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedCounsel: null,

  setFile: (file: string | null) => set({ callToBarFile: file }),

  setCounsels: (data) => set({ counsel: data }),
  setIsSubmitting: (status) => set({ isSubmitting: status }),

  isUpgradeModalOpen: false, // New State

  // New Modal Control
  openUpgradeModal: () => set({ isUpgradeModalOpen: true }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false }),

  // Refactor openAddModal to check subscription
  openAddModal: () => {
    // Placeholder for subscription check
    const hasActiveSubscription = true; // Simulate no active subscription

    if (hasActiveSubscription) {
      set({ isAddModalOpen: true });
    } else {
      set({ isUpgradeModalOpen: true });
    }
  },

  closeAddModal: () => set({ isAddModalOpen: false }),
  openEditModal: (counsel) =>
    set({ isEditModalOpen: true, selectedCounsel: counsel }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedCounsel: null }),
  openDeleteModal: (counsel) =>
    set({ isDeleteModalOpen: true, selectedCounsel: counsel }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedCounsel: null }),

  // --- API/Data Logic (Placeholder for full integration) ---
  fetchCounsels: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchCounsel();
      console.log("Fetch counsel response:", response);

      // Handle different response structures
      let counselData = [];
      if (response.data) {
        counselData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
      } else if (response.data !== undefined) {
        counselData = response.data || [];
      }

      const staffOnly = counselData.filter(
        (user: any) => user.role === "STAFF"
      );

      // Map API response to Counsel interface
      const mappedCounselData = staffOnly.map((counsel: any) => ({
        id: counsel.id,
        fullName:
          counsel.fullName ||
          `${counsel.firstName || ""} ${counsel.lastName || ""}`.trim(),
        scn: counsel.scn,
        email: counsel.email,
        callToBarFile: counsel.callToBarFile || counsel.barCertificate,
        status: counsel.status || "Inactive",
        assignedCases: counsel.assignedCases || "0",
        role: "STAFF" as const
      }));

      console.log("Mapped counsel data:", mappedCounselData);
      set({ counsel: mappedCounselData });
    } catch (error) {
      console.error("Failed to fetch counsels:", error);
      toast.error("Failed to load counsels");
    } finally {
      set({ isLoading: false });
    }
  },

  notifications: [],
  lastAddedCounsel: null,

  setLastAddedCounsel: (counsel: Counsel | null) =>
    set({ lastAddedCounsel: counsel }),

  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),

  addCounsel: async (payload: CounselPayload) => {
    set({ isSubmitting: true });
    try {
      const response = await addCounsel(payload);

      const newCounsel: Counsel = response.data;

      await get().fetchCounsels();

      // SUCCESS ACTIONS
      toast.success("Counsel Added!", {
        description: "You have successfully added a new counsel to your team."
      });

      // 1. Set the last added counsel for the banner
      set({ lastAddedCounsel: newCounsel });

      // 2. Add to header notifications
      get().addNotification({
        type: "success",
        message: "Counsel Added",
        details: `${newCounsel.fullName} was successfully added to your team.`
      });
    } catch (error) {
      console.error("Failed to add counsel:", error);
      toast.error("Failed to add counsel. Please try again.");
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateCounsel: async (id, updatedFields) => {
    set({ isSubmitting: true });
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
      console.error("Update counsel error:", error);
      toast.error("Failed to update counsel.");
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteCounsel: async (id) => {
    set({ isSubmitting: true });
    try {
      const response = await deleteCounsel(String(id));
      console.log("Delete counsel response:", response);

      // Refetch the data to get the updated state from server
      await get().fetchCounsels();

      set({ isDeleteModalOpen: false, selectedCounsel: null });
      toast.success("Counsel removed successfully.");
    } catch (error) {
      console.error("Delete counsel error:", error);
      toast.error("Failed to delete counsel.");
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  }
});

export const useCounselStore = create<ManageCounselStore>()(store);
