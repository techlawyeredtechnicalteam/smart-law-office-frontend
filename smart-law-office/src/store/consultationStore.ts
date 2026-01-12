import { create } from "zustand";
import {
  ConsultationFormValues,
  Consultation
} from "@/types/Consultation.schema";

interface ConsultationState {
  formData: Partial<ConsultationFormValues> | null;
  isBookingOpen: boolean;
  step: "form" | "summary" | "payment" | "success";
  consultations: Consultation[];
  lastCreatedConsultCode: string | null; // NEW: Store the last created consult code

  setFormData: (data: ConsultationFormValues) => void;
  resetBooking: () => void;
  openBooking: () => void;
  closeBooking: () => void;
  setStep: (step: ConsultationState["step"]) => void;
  setConsultations: (consults: Consultation[]) => void;
  addConsultation: (consult: Consultation) => void;
  setLastCreatedConsultCode: (code: string) => void; // NEW: Action to set consult code
}

const useConsultationStore = create<ConsultationState>((set) => ({
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
  setLastCreatedConsultCode: (code) => set({ lastCreatedConsultCode: code })
}));

export default useConsultationStore;
