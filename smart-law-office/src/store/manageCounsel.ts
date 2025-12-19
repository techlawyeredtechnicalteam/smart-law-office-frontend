import { create, StateCreator } from "zustand";
// import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  addCounsel,
  CounselPayload,
  deleteCounsel,
  fetchCounsel,
  updateCounsel
} from "@/app/api/signup.api";

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

  openAddModal: () => set({ isAddModalOpen: true }),
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

      // Map API response to Counsel interface
      const mappedCounselData = counselData.map((counsel: any) => ({
        id: counsel.id,
        fullName:
          counsel.fullName ||
          `${counsel.firstName || ""} ${counsel.lastName || ""}`.trim(),
        scn: counsel.scn,
        email: counsel.email,
        callToBarFile: counsel.callToBarFile || counsel.barCertificate,
        status: counsel.status || "Inactive",
        assignedCases: counsel.assignedCases || "0",
        role: counsel.role || "COUNSEL"
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

  addCounsel: async (payload: CounselPayload) => {
    set({ isSubmitting: true });
    try {
      await addCounsel(payload);
      await get().fetchCounsels();
      toast.success("Counsel added successfully");
    } catch (error) {
      console.error("Failed to add counsel:", error);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateCounsel: async (id, updatedFields) => {
    set({ isSubmitting: true });
    try {
      await updateCounsel(String(id), updatedFields);

      set((state) => ({
        counsels: state.counsel.map((c) =>
          c.id === id ? { ...c, ...updatedFields } : c
        ),
        isEditModalOpen: false,
        selectedCounsel: null
      }));
      toast.success("Counsel details have been saved.");
    } catch (error) {
      toast.error("Failed to update counsel.");
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteCounsel: async (id) => {
    set({ isSubmitting: true });
    try {
      await deleteCounsel(String(id));

      set((state) => ({
        counsels: state.counsel.filter((c) => c.id !== id),
        isDeleteModalOpen: false,
        selectedCounsel: null
      }));
      toast.success("Counsel removed successfully.");
    } catch (error) {
      toast.error("Failed to delete counsel.");
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  }
});

export const UseCounselStore = create<ManageCounselStore>()(store);
