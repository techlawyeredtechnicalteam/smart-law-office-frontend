import { create } from "zustand";
import {
  ConsultationFormValues,
  Consultation
} from "@/types/Consultation.schema";
import { useCaseStore } from "./createCase";
import { getAllConsult } from "@/app/api/bookConsult.api";

interface ConsultationState {
  formData: Partial<ConsultationFormValues> | null;
  isBookingOpen: boolean;
  step: "form" | "summary" | "payment" | "success";
  consultations: Consultation[];
  lastCreatedConsultCode: string | null; // NEW: Store the last created consult code

  fetchConsultations: () => Promise<void>;
  // promoteToCase: (consultId: string) => Promise<boolean | null>;
  setFormData: (data: ConsultationFormValues) => void;
  resetBooking: () => void;
  openBooking: () => void;
  closeBooking: () => void;
  setStep: (step: ConsultationState["step"]) => void;
  setConsultations: (consults: Consultation[]) => void;
  addConsultation: (consult: Consultation) => void;
  setLastCreatedConsultCode: (code: string) => void; // NEW: Action to set consult code
}

const useConsultationStore = create<ConsultationState>((set, get) => ({
  formData: null,
  isBookingOpen: false,
  step: "form",
  consultations: [],
  lastCreatedConsultCode: null,

  setFormData: (data) => set({ formData: data }),
  openBooking: () => set({ isBookingOpen: true, step: "form" }),
  resetBooking: () =>
    set({
      formData: null,
      isBookingOpen: false,
      step: "form",
      lastCreatedConsultCode: null
    }),
  closeBooking: () => set({ isBookingOpen: false }),
  setStep: (step) => set({ step }),
  setConsultations: (consults) => set({ consultations: consults }),
  addConsultation: (newConsult) =>
    set((state) => ({
      consultations: [...state.consultations, newConsult]
    })),
  setLastCreatedConsultCode: (code) => set({ lastCreatedConsultCode: code }),

  fetchConsultations: async () => {
    const response = await getAllConsult();
    set({ consultations: response.data });
    console.log("Fetching Consultations...");
  }

  // promoteToCase: async (consultId) => {
  //   const consult = get().consultations.find((c) => c.id === consultId);
  //   if (!consult) return null;

  //   try {
  //     // 1. Call your API to convert
  //     // const response = await convertConsultToCaseApi(consultId);

  //     // 2. Create the case in the CaseStore
  //     const caseStore = useCaseStore.getState();
  //     const success = await caseStore.executeCreate(
  //       {
  //         title: `${consult.clientName} - ${consult.caseType}`,
  //         caseTypeId: consult.caseTypeId,
  //         // consultId: consultId,
  //         status: "IN_PROGRESS",
  //         date: new Date().toISOString(),
  //         notes: consult.notes || "",
  //         clientEmail: consult.clientEmail || "",
  //         staffEmail: "",
  //         lastAdjournedDate: "",
  //         nextAdjournedDate: "",
  //         document: ""
  //       } as any,
  //       "ADMIN"
  //     );

  //     // if (success) {
  //     //   // Remove from local consultations list or mark as 'Converted'
  //     //   set((state) => ({
  //     //     consultations: state.consultations.filter((c) => c.id !== consultId)
  //     //   }));
  //     //   return "new-case-id"; // Return ID for navigation
  //     // }
  //     return success;
  //   } catch (error) {
  //     return null;
  //   }
  // }
}));

export default useConsultationStore;
