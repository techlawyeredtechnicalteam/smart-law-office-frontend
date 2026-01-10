import { create, StateCreator } from "zustand";
import { toast } from "sonner";
import { getCaseTypesById } from "@/app/api/caseType.api";
import { getFeeSchedule } from "@/app/api/setRateBills.api";

export interface ServiceType {
  id: string;
  name: string;
  subServiceTypes: SubServiceType[];
}

export interface SubServiceType {
  id: string;
  name: string;
  lproRateRange: string;
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
  // fetchServiceTypes: () => Promise<void>;
  closeSetRateModal: () => void;
  openSetRateCaseModal: () => void;
  closeSetRateCaseModal: () => void;
  addConsultationRate: (rate: ConsultationRate) => void;
  addCaseRate: (rate: CaseRate) => void;
  saveRate: (payload: any) => Promise<boolean>;
}

const store: StateCreator<BillingStore> = (set, get) => ({
  serviceTypes: [],
  feeSchedules: [],
  rates: [],
  isLoading: false,
  isSetRateModalOpen: false,
  isSetRateCaseModalOpen: false,

  // Modal Actions
  openSetRateModal: () => set({ isSetRateModalOpen: true }),
  closeSetRateModal: () => set({ isSetRateModalOpen: false }),
  openSetRateCaseModal: () => set({ isSetRateCaseModalOpen: true }),
  closeSetRateCaseModal: () => set({ isSetRateCaseModalOpen: false }),

  // Data Actions

  fetchBillingInitialData: async () => {
    set({ isLoading: true });

    try {
      const [caseTypesRes, feesRes] = await Promise.all([
        getCaseTypesById(),
        getFeeSchedule()
      ]);

      set({
        serviceTypes: caseTypesRes?.data || [],
        feeSchedules: feesRes?.data || [],
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error("Failed to sync billing data from the server");
      console.error("Billing Fetch Error:", error);
    }
  },

  saveRate: async (payload: any) => {
    set({ isLoading: true });

    try {
      // no POST endpint yet. Manually update the rates list
      if (payload.serviceType === "Consultation") {
        get().addConsultationRate(payload);
      } else {
        get().addCaseRate(payload);
      }
      return true;
    } catch (error) {
      toast.error("Could not save rate");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  addConsultationRate: (newRate) => {
    set((state) => ({ rates: [...state.rates, newRate] }));
    toast.success("Consultation Rate added to view!");
  },

  addCaseRate: (newRate) => {
    set((state) => ({ rates: [...state.rates, newRate] }));
    toast.success("Case Rate added to view!");
  }
});

export const useBillingStore = create<BillingStore>()(store);
