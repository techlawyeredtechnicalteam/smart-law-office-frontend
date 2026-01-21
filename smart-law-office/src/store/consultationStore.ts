import { create } from "zustand";
import {
  ConsultationFormData,
  ConsultationStatus
} from "@/types/Consultation.schema";
import { bookConsultation, getAllConsult } from "@/app/api/bookConsult.api";

export interface Consultation {
  id: string;
  consultationFeeId: string;
  consultAt: string;
  note: string;
  document?: string;
  status: ConsultationStatus;
  paymentReceipt: string;
}

interface ConsultationState {
  formData: Partial<ConsultationFormData> | null;
  isBookingOpen: boolean;
  isLoading: boolean;
  step: "form" | "summary" | "payment" | "success";
  consultations: Consultation[];
  lastCreatedConsultCode: string | null; // NEW: Store the last created consult code

  fetchConsultations: () => Promise<void>;
  setFormData: (data: Partial<ConsultationFormData>) => void;
  resetBooking: () => void;
  openBooking: () => void;
  closeBooking: () => void;
  setStep: (step: ConsultationState["step"]) => void;
  setConsultations: (consults: Consultation[]) => void;
  addConsultation: (consult: Consultation) => void;
  setLastCreatedConsultCode: (code: string) => void;
  submitConsultation: () => Promise<boolean>;
}

const useConsultationStore = create<ConsultationState>((set, get) => ({
  formData: null,
  isBookingOpen: false,
  isLoading: false,
  step: "form",
  consultations: [],
  lastCreatedConsultCode: null,

  // FIX: Use functional updates to merge state properly
  setFormData: (data: Partial<ConsultationFormData>) => {
    set((state) => ({
      ...state,
      formData: { ...state.formData, ...data },
      isBookingOpen: true
    }));
    console.log("Store: Data Saved", get().formData);
  },

  openBooking: () => {
    set({ isBookingOpen: true, step: "form" });
  },

  resetBooking: () =>
    set({
      formData: null,
      isBookingOpen: false,
      step: "form",
      lastCreatedConsultCode: null
    }),

  closeBooking: () => set({ isBookingOpen: false }),

  // FIX: Ensure isBookingOpen stays TRUE when moving to summary/payment
  setStep: (step: "form" | "summary" | "payment" | "success") => {
    set((state) => ({
      ...state, // Preserve everything
      step: step,
      isBookingOpen: true // FORCE open
    }));
  },

  setConsultations: (consults) => set({ consultations: consults }),

  addConsultation: (newConsult) =>
    set((state) => ({
      ...state,
      consultations: [...state.consultations, newConsult]
    })),

  setLastCreatedConsultCode: (code) => set({ lastCreatedConsultCode: code }),

  fetchConsultations: async () => {
    try {
      const response = await getAllConsult();
      set({ consultations: response.data });
    } catch (err) {
      console.error("Failed to fetch consultations", err);
    }
  },

  submitConsultation: async () => {
    const { formData, addConsultation, setLastCreatedConsultCode, setStep } =
      get();

    if (!formData) return false;

    set({ isLoading: true });

    try {
      const payload = {
        consultationFeeId: formData.consultationFeeId,
        date: formData.date,
        time: formData.time,
        note: formData.note,
        document: formData.document,
        consultAt: formData.consultAt,
        paymentReceipt: formData.paymentReceipt
      };

      const response = await bookConsultation(payload);

      if (response.status === 201 || response.status === 200) {
        // Update local state with the new consultation
        if (response.data?.code) setLastCreatedConsultCode(response.data.code);
        addConsultation(response.data);

        // Success! Move the UI forward
        set({ step: "success", isLoading: false });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Store: Failed to create consultation", err);
      set({ isLoading: false });
      throw err; // Let the component handle the toast message
    }
  }
}));

export default useConsultationStore;
