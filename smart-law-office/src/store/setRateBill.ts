import { create } from "zustand";
import { toast } from "sonner";
import {
  getFeeSchedule,
  saveConsultationFee,
  saveCaseRate
} from "@/app/api/setRateBills.api";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ConsultationRate {
  serviceType: "Consultation";
  duration: string | number;
  rate: number;
}

export interface CaseRate {
  serviceType: "Case";
  subServiceType: string;
  caseRate: number;
  feeScheduleId?: string;
}

// Combine them into the RateEntry type
export type RateEntry = ConsultationRate | CaseRate;

export interface BillingStore {
  feeSchedules: any[];
  rates: RateEntry[];
  isLoading: boolean;
  isSetRateModalOpen: boolean;
  isSetRateCaseModalOpen: boolean;
  fetchBillingInitialData: () => Promise<void>;
  openSetRateModal: () => void;
  closeSetRateModal: () => void;
  openSetRateCaseModal: () => void;
  closeSetRateCaseModal: () => void;
  saveRate: (payload: any) => Promise<boolean>;
  resetFlow: () => void;
}

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      // --- State ---
      feeSchedules: [],
      rates: [],
      isLoading: false,
      isSetRateModalOpen: false,
      isSetRateCaseModalOpen: false,

      // --- Modal Actions ---
      openSetRateModal: () =>
        set({ isSetRateModalOpen: true, isSetRateCaseModalOpen: false }),
      closeSetRateModal: () => set({ isSetRateModalOpen: false }),
      openSetRateCaseModal: () =>
        set({ isSetRateCaseModalOpen: true, isSetRateModalOpen: false }),
      closeSetRateCaseModal: () => set({ isSetRateCaseModalOpen: false }),

      // --- Logic Actions ---
      resetFlow: () => {
        localStorage.removeItem("billing-storage");
        set({
          feeSchedules: [],
          rates: [],
          isLoading: false,
          isSetRateModalOpen: false,
          isSetRateCaseModalOpen: false
        });
      },

      fetchBillingInitialData: async () => {
        // if (get().feeSchedules.length > 0) return;
        set({ isLoading: true });
        try {
          const response = await getFeeSchedule();
          console.log("Get fees:", response?.data);
          set({ feeSchedules: response?.data || [], isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          toast.error("Failed to sync billing data");
        } finally {
          set({ isLoading: false });
        }
      },

      saveRate: async (payload: any) => {
        set({ isLoading: true });
        try {
          if (payload.serviceType === "Consultation") {
            const numericDuration =
              typeof payload.duration === "number"
                ? payload.duration
                : Number(String(payload.duration).replace(/\D/g, "")) || 0;

            await saveConsultationFee({
              duration: numericDuration,
              fee: Number(payload.rate)
            });
          } else {
            await saveCaseRate({
              feeScheduleId: payload.feeScheduleId,
              fee: Number(payload.caseRate)
            });
          }

          set((state) => ({ rates: [...state.rates, payload] }));
          toast.success("Rate saved successfully!");
          return true;
        } catch (error: any) {
          const messages = error.response?.data?.message;
          toast.error(
            Array.isArray(messages) ? messages[0] : "Check backend requirements"
          );
          return false;
        } finally {
          set({ isLoading: false });
        }
      } // Removed trailing comma/syntax errors here
    }),
    {
      name: "billing-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rates: state.rates,
        feeSchedules: state.feeSchedules
      })
    }
  )
);
