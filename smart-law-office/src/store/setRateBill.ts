import { create } from "zustand";
import { toast } from "sonner";
import {
  getFeeSchedule,
  saveConsultationFee,
  saveCaseRate,
  getConsultationFee,
  getCaseFormCaseTypes
} from "@/app/api/setRateBills.api";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ConsultationRate {
  id?: string;
  serviceType: "Consultation";
  consultType: string;
  duration: string | number;
  rate: number;
}

export interface CaseRate {
  id?: string;
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
  isSaving: boolean;
  isSetRateModalOpen: boolean;
  isSetRateCaseModalOpen: boolean;

  //
  getConsultationRates: () => ConsultationRate[];
  getCaseRates: () => CaseRate[];

  //
  fetchBillingInitialData: () => Promise<void>;
  fetchConsultationFeesOnly: () => Promise<void>;
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
      isSaving: false,
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

      getConsultationRates: () => {
        return get().rates.filter(
          (rate): rate is ConsultationRate =>
            rate.serviceType === "Consultation"
        );
      },

      getCaseRates: () => {
        return get().rates.filter(
          (rate): rate is CaseRate => rate.serviceType === "Case"
        );
      },

      fetchConsultationFeesOnly: async () => {
        set({ isLoading: true });
        try {
          const consultRes = await getConsultationFee();
          console.log("Fetch Consultation:", consultRes);

          const consultationHistory: ConsultationRate[] = (
            consultRes?.data || []
          ).map((item: any) => ({
            id: item.consultationFeeId || item.id,
            serviceType: "Consultation",
            consultType: item.consultType,
            duration: item.duration || 0,
            rate: item.fee || 0
          }));

          set({
            rates: consultationHistory,
            isLoading: false
          });
        } catch (error) {
          console.error("Client fetch error:", error);
          // Silent fail or minimal toast so as not to disrupt the booking flow
        } finally {
          set({ isLoading: false });
        }
      },

      fetchBillingInitialData: async () => {
        // if (get().isLoading) return;

        set({ isLoading: true });
        try {
          const schedulesRes = await getFeeSchedule();
          const [consultRes, caseTypesRes] = await Promise.all([
            getConsultationFee(),
            getCaseFormCaseTypes()
          ]);

          console.log("Schedules Raw:", schedulesRes?.data);

          const rawSchedules = schedulesRes?.data || [];

          // Format Consultation history
          const consultationHistory: ConsultationRate[] = (
            consultRes?.data || []
          ).map((item: any) => ({
            id: item.id,
            serviceType: "Consultation",
            consultType: item.consultType,
            duration: item.duration || 0,
            rate: item.fee || 0
          }));
          const caseRateHistory = (caseTypesRes?.data || []).map(
            (item: any) => ({
              serviceType: "Case",
              subServiceType:
                item.name || item.feeSchedule?.name || "Standard Case",
              caseRate: item.fee || 0,
              caseTypeId: item.caseTypeId || item.id,
              feeScheduleId: item.feeScheduleId || item.id
            })
          );

          set({
            feeSchedules: rawSchedules,
            rates: [...consultationHistory, ...caseRateHistory],
            isLoading: false
          });
        } catch (error) {
          toast.error("Failed to sync billing data");
        } finally {
          set({ isLoading: false });
        }
      },

      saveRate: async (payload: any) => {
        set({ isSaving: true });
        try {
          if (payload.serviceType === "Consultation") {
            const numericDuration =
              typeof payload.duration === "number"
                ? payload.duration
                : Number(String(payload.duration).replace(/\D/g, "")) || 0;

            await saveConsultationFee({
              consultType: payload.consultType,
              duration: numericDuration,
              fee: Number(payload.rate)
            });
          } else {
            await saveCaseRate({
              feeScheduleId: payload.feeScheduleId,
              fee: Number(payload.caseRate)
            });
          }

          // Refresh the data from the source of truth after saving
          toast.success("Rate saved successfully!");

          await get().fetchBillingInitialData();

          return true;
        } catch (error: any) {
          toast.error("Failed to save rate");
          return false;
        } finally {
          set({ isSaving: false });
        }
      }

      // resetFlow: () => {
      //   // Clear storage on logout so we don't leak stale rates
      //   localStorage.removeItem("billing-storage");
      //   set({ feeSchedules: [], rates: [], isLoading: false });
      // }
    }),
    {
      name: "billing-storage",
      storage: createJSONStorage(() => localStorage)
      // partialize: (state) => ({
      //   rates: state.rates,
      //   feeSchedules: state.feeSchedules
      // })
      // partialize: (state) => ({})
    }
  )
);
