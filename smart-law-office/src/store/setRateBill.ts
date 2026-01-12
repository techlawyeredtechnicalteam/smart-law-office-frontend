import { create, StateCreator } from "zustand";
import { toast } from "sonner";
import {
  getAdminCaseTypes,
  getAllCases,
  getAdminCaseTypesById
} from "@/app/api/caseType.api";
import {
  getFeeSchedule,
  saveConsultationFee,
  saveCaseRate
} from "@/app/api/setRateBills.api";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ServiceType {
  id: string;
  name: string;
  subServiceTypes: SubServiceType[];
}

export interface SubServiceType {
  id: string;
  name: string;
  lproRateRange: string;
  feeScheduleId: string;
  rateMin: number;
  rateMax: number;
  description: string;
}

export interface ConsultationRate {
  serviceType: "Consultation";
  duration: string;
  rate: number;
}

export interface CaseRate {
  serviceType: "Case";
  subServiceType: string;
  caseRate: number;
}

export type RateEntry = ConsultationRate | CaseRate;

export interface BillingStore {
  // State
  serviceTypes: ServiceType[];
  feeSchedules: any[];
  rates: RateEntry[];
  isLoading: boolean;
  isSetRateModalOpen: boolean;
  isSetRateCaseModalOpen: boolean;

  // Actions
  fetchBillingInitialData: () => Promise<void>;
  openSetRateModal: () => void;
  closeSetRateModal: () => void;
  openSetRateCaseModal: () => void;
  closeSetRateCaseModal: () => void;
  addConsultationRate: (rate: ConsultationRate) => void;
  addCaseRate: (rate: CaseRate) => void;
  saveRate: (payload: any) => Promise<boolean>;
  resetFlow: () => void;
}

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      serviceTypes: [],
      feeSchedules: [],
      rates: [],
      isLoading: false,
      isSetRateModalOpen: false,
      isSetRateCaseModalOpen: false,

      openSetRateModal: () =>
        set({ isSetRateModalOpen: true, isSetRateCaseModalOpen: false }),
      closeSetRateModal: () => set({ isSetRateModalOpen: false }),
      openSetRateCaseModal: () =>
        set({ isSetRateCaseModalOpen: true, isSetRateModalOpen: false }),
      closeSetRateCaseModal: () => set({ isSetRateCaseModalOpen: false }),

      resetFlow: () => {
        localStorage.removeItem("billing-storage");
        set({
          serviceTypes: [],
          feeSchedules: [],
          rates: [],
          isLoading: false,
          isSetRateModalOpen: false,
          isSetRateCaseModalOpen: false
        });
      },

      fetchBillingInitialData: async () => {
        set({ isLoading: true });
        try {
          const [caseTypesRes, feesRes] = await Promise.all([
            getAdminCaseTypes(),
            getFeeSchedule()
          ]);

          // Extract data from Axios response
          const feeScheduleData = feesRes?.data || [];
          const caseTypeData = caseTypesRes?.data || [];

          // console.log("Extracted feeScheduleData:", feeScheduleData);
          // console.log("Extracted caseTypeData:", caseTypeData);

          // TEMPORARY FALLBACK: Use mock data if backend database is empty
          if (feeScheduleData.length === 0) {
            console.warn(
              "⚠️ DATABASE EMPTY: No fee schedules found in backend"
            );
            console.warn("📋 Using temporary mock data for development");
            console.warn(
              "🔧 ACTION: Create fee schedules in your backend/database"
            );

            set({
              serviceTypes: caseTypeData,
              feeSchedules: [
                {
                  feeScheduleId: "mock-1",
                  name: "Corporate Litigation",
                  rateMin: 100000,
                  rateMax: 500000,
                  lproRateRange: "₦100,000 - ₦500,000",
                  description: "Mock data - replace with real fee schedules"
                },
                {
                  feeScheduleId: "mock-2",
                  name: "Family Law",
                  rateMin: 50000,
                  rateMax: 200000,
                  lproRateRange: "₦50,000 - ₦200,000",
                  description: "Mock data - replace with real fee schedules"
                },
                {
                  feeScheduleId: "mock-3",
                  name: "Real Estate Law",
                  rateMin: 150000,
                  rateMax: 600000,
                  lproRateRange: "₦150,000 - ₦600,000",
                  description: "Mock data - replace with real fee schedules"
                },
                {
                  feeScheduleId: "mock-4",
                  name: "Criminal Defense",
                  rateMin: 200000,
                  rateMax: 800000,
                  lproRateRange: "₦200,000 - ₦800,000",
                  description: "Mock data - replace with real fee schedules"
                }
              ],
              isLoading: false
            });
            return;
          }

          // Use real data from backend
          set({
            serviceTypes: caseTypeData,
            feeSchedules: feeScheduleData,
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to fetch billing data:", error);
          set({ isLoading: false, feeSchedules: [], serviceTypes: [] });
          toast.error("Failed to sync billing data");
        }
      },

      // saveRate: async (payload: any) => {
      //   set({ isLoading: true });
      //   try {
      //     if (payload.serviceType === "Consultation") {
      //       // Extract numeric duration (e.g., "30 mins" -> 30)
      //       const numericDuration = Number(
      //         String(payload.duration).replace(/\D/g, "")
      //       );

      //       await saveConsultationFee({
      //         duration: numericDuration,
      //         fee: Number(payload.rate) // Backend wants 'fee'
      //       });
      //       get().addConsultationRate(payload);
      //     } else {
      //       // CASE RATE FIX:
      //       // The backend expects 'fee' and usually the ID of the case type
      //       await saveCaseRate({
      //         caseTypeId: payload.feeScheduleId, // Ensure this matches your backend's expected key
      //         fee: Number(payload.caseRate) // Backend wants 'fee'
      //       });
      //       get().addCaseRate(payload);
      //     }

      //     toast.success("Rate saved successfully!");
      //     return true;
      //   } catch (error: any) {
      //     console.error("Save Error:", error);
      //     const messages = error.response?.data?.message;
      //     const errorMessage = Array.isArray(messages)
      //       ? messages[0]
      //       : "Check backend requirements";
      //     toast.error(errorMessage);
      //     return false;
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },

      saveRate: async (payload: any) => {
        set({ isLoading: true });
        try {
          if (payload.serviceType === "Consultation") {
            const numericDuration = Number(
              String(payload.duration).replace(/\D/g, "")
            );
            await saveConsultationFee({
              duration: numericDuration,
              fee: Number(payload.rate)
            });
            get().addConsultationRate(payload);
            // } else {
            //   // CASE RATE FIX BASED ON YOUR ERROR:
            //   await saveCaseRate({
            //     // The backend specifically asked for "feeScheduleId"
            //     feeScheduleId: String(payload.feeScheduleId),
            //     // The backend previously asked for "fee"
            //     fee: Number(payload.caseRate)
            //   });
            //   get().addCaseRate(payload);
            // }
          } else {
            // Save to API
            await saveCaseRate({
              feeScheduleId: payload.feeScheduleId,
              fee: Number(payload.caseRate)
            });

            // Save to Local State (Rates Table)
            // MUST include subServiceType for the table render!
            get().addCaseRate({
              serviceType: "Case",
              subServiceType: payload.subServiceType, // Ensure this exists in the payload!
              caseRate: Number(payload.caseRate)
            });
          }
          toast.success("Rate saved successfully!");
          return true;
        } catch (error: any) {
          const messages = error.response?.data?.message;
          toast.error(
            Array.isArray(messages) ? messages[0] : "Check console for details"
          );
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      addConsultationRate: (newRate) =>
        set((state) => ({ rates: [...state.rates, newRate] })),
      addCaseRate: (newRate) =>
        set((state) => ({ rates: [...state.rates, newRate] }))
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
