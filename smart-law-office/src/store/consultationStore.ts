import { create } from "zustand";
import {
  ConsultationFormValues,
  Consultation
} from "@/types/Consultation.schema";

interface ConsultationState {
  formData: Partial<ConsultationFormValues> | null;
  isBookingOpen: boolean;
  step: "form" | "summary" | "payment" | "success";

  // state for the dashboard list
  consultations: any[];

  // actions
  setFormData: (data: ConsultationFormValues) => void;
  resetBooking: () => void;
  openBooking: () => void;
  closeBooking: () => void;
  setStep: (step: ConsultationState["step"]) => void;
  setConsultations: (consults: Consultation[]) => void;
  addConsultation: (consult: Consultation) => void;
}

const useConsultationStore = create<ConsultationState>((set) => ({
  formData: null,
  isBookingOpen: false,
  step: "form",
  consultations: [], // Will be populated by the dashboard component

  setFormData: (data) => set({ formData: data }),
  openBooking: () => set({ isBookingOpen: true, step: "form" }),
  resetBooking: () =>
    set({ formData: null, isBookingOpen: false, step: "form" }),
  closeBooking: () => set({ isBookingOpen: false }),
  setStep: (step) => set({ step }),
  setConsultations: (consults) => set({ consultations: consults }),
  addConsultation: (newConsult) =>
    set((state) => ({
      consultations: [...state.consultations, newConsult]
    }))
}));

export default useConsultationStore;
