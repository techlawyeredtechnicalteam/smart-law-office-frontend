import { create, StateCreator } from "zustand";
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
    specialty: u.specialty || (u.scn ? `SCN: ${u.scn}` : "General Practice"),
    scn: u.scn || "",
    casesCount,
    status: casesCount >= 5 ? "Busy" : "Active",
    callToBarFile: u.barCertificate || u.callToBarFile || null
  };
};

const MODAL_CLOSED = {
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedCounsel: null
} as const;

export interface ManageCounselStore {
  counsel: Lawyer[];
  isFetching: boolean;
  isLoading: boolean;
  callToBarFile: string | null;
  notifications: Notification[];
  lastAddedCounsel: Lawyer | null;

  // Modal state
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isUpgradeModalOpen: boolean;
  selectedCounsel: Lawyer | null;

  // Actions
  setFile: (file: string | null) => void;
  addNotification: (notif: Notification) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (counsel: Lawyer) => void;
  closeEditModal: () => void;
  openDeleteModal: (counsel: Lawyer) => void;
  closeDeleteModal: () => void;
  closeUpgradeModal: () => void;
  setLastAddedCounsel: (counsel: Lawyer | null) => void;
  fetchCounsels: () => Promise<void>;
  addCounsel: (payload: CounselPayload) => Promise<void>;
  updateCounsel: (
    id: string,
    updatedFields: Partial<CounselPayload>
  ) => Promise<void>;
  deleteCounsel: (id: string) => Promise<void>;
}

const store: StateCreator<ManageCounselStore> = (set, get) => ({
  counsel: [],
  notifications: [],
  lastAddedCounsel: null,
  isLoading: false,
  isFetching: false,
  callToBarFile: null,
  isUpgradeModalOpen: false,
  ...MODAL_CLOSED,

  setLastAddedCounsel: (counsel) => set({ lastAddedCounsel: counsel }),

  setFile: (file) => set({ callToBarFile: file }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [{ ...notif }, ...state.notifications].slice(0, 20)
    })),

  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false, callToBarFile: null }),
  openEditModal: (counsel) =>
    set({ isEditModalOpen: true, selectedCounsel: counsel }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedCounsel: null }),
  openDeleteModal: (counsel) =>
    set({ isDeleteModalOpen: true, selectedCounsel: counsel }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedCounsel: null }),
  closeUpgradeModal: () => set({ isUpgradeModalOpen: false }),

  fetchCounsels: async () => {
    if (get().isFetching) return;
    set({ isFetching: true });

    try {
      const response = await fetchCounsel();
      const rawData: any[] = response.data?.data || response.data || [];
      const counsel = rawData
        .filter((u) => u.role?.toUpperCase() === "STAFF")
        .map(mapToLawyer);

      set({ counsel });
    } catch {
      toast.error("Failed to load counsels");
    } finally {
      set({ isFetching: false });
    }
  },

  addCounsel: async (payload) => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const response = await addCounsel(payload);
      await get().fetchCounsels();
      set({ isAddModalOpen: false, lastAddedCounsel: response.data });
      toast.success("Counsel added successfully");
    } catch {
      toast.error("Payment successful, but failed to update list.");
    } finally {
      set({ isLoading: false });
    }
  },

  updateCounsel: async (id) => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      await updateCounsel(id);

      await Promise.all([
        get().fetchCounsels(),
        useAssignStore.getState().fetchUnassigned()
      ]);

      set({ isEditModalOpen: false, selectedCounsel: null });
      toast("Update successful", {
        description: "The counsel's details have been saved.",
        duration: 3000
      });
    } catch {
      toast.error("Failed to update counsel.");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCounsel: async (id) => {
    if (get().isLoading) return;

    const counselToRemove = get().counsel.find((c) => c.id === id);
    set({ isLoading: true });

    try {
      await deleteCounsel(String(id));
      await get().fetchCounsels();
      set({ isDeleteModalOpen: false, selectedCounsel: null });

      toast.success("Counsel removed successfully.");
      get().addNotification({
        type: "info",
        message: "Counsel Removed",
        details: `${counselToRemove?.name ?? "A staff member"} has been deactivated`
      });
    } catch {
      toast.error("Failed to delete counsel.");
    } finally {
      set({ isLoading: false });
    }
  }
});

export const useCounselStore = create<ManageCounselStore>()(store);
