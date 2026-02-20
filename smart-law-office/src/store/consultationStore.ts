import { create } from "zustand";
import {
  ConsultationFormData,
  ConsultationStatus
} from "@/types/Consultation.schema";
import {
  bookConsultation,
  getAllConsult,
  getConsults
} from "@/app/api/bookConsult.api";

export interface Consultation {
  id: string;
  code: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  clientName?: string;
  consultationFeeId: string;
  consultAt: string;
  note: string;
  document?: string;
  status: ConsultationStatus;
  paymentReceipt: string;
  createdAt?: string;
  updatedAt?: string;
  transactions: ConsultTransaction[];
}

export interface ConsultTransaction {
  consultTransactionId: string;
  consultId: string;
  amount: string;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentReceipt: string;
  createdAt: string;
}

const transformConsultationFromAPI = (apiConsult: any): Consultation => {
  return {
    id: apiConsult.consultId,
    code: apiConsult.consultCode,
    clientName: apiConsult.client
      ? `${apiConsult.client.firstName} ${apiConsult.client.lastName || ""}`.trim()
      : undefined,
    consultationFeeId: apiConsult.consultationFeeId,
    consultAt: apiConsult.consultAt,
    note: apiConsult.consultNotes?.description?.trim() || "No notes provided",
    document: apiConsult.consultDocuments?.path || null,
    status: apiConsult.status,
    paymentReceipt: apiConsult.paymentReceipt || "",
    createdAt: apiConsult.createdAt,
    updatedAt: apiConsult.updatedAt,
    transactions: apiConsult.consultTransactions || []
  };
};

interface ConsultationState {
  formData: Partial<ConsultationFormData> | null;
  isBookingOpen: boolean;
  isLoading: boolean;
  step: "form" | "summary" | "payment" | "success";
  consultations: Consultation[];
  lastCreatedConsultCode: string | null;

  fetchConsultations: () => Promise<void>;
  fetchConsultationDirect: () => Promise<void>;
  setFormData: (data: Partial<ConsultationFormData>) => void;
  resetBooking: () => void;
  openBooking: () => void;
  closeBooking: () => void;
  setStep: (step: ConsultationState["step"]) => void;
  setConsultations: (consults: Consultation[]) => void;
  addConsultation: (consult: Consultation) => void;
  setLastCreatedConsultCode: (code: string) => void;
  submitConsultation: () => Promise<boolean>;
  // confirmPayment: (transactionId: string) => Promise<boolean>;
}

const useConsultationStore = create<ConsultationState>((set, get) => ({
  formData: null,
  isBookingOpen: false,
  isLoading: false,
  step: "form",
  consultations: [],
  lastCreatedConsultCode: null,

  // confirmPayment: async (transactionId: string) => {
  //   set({ isLoading: true });
  //   try {
  //     // Lead Note: Using fetchConsultationDirect ensures the local state
  //     // is a 1:1 match with the DB after the verification.
  //     await verifyConsultPayment(transactionId); // Your API call
  //     await get().fetchConsultationDirect();
  //     return true;
  //   } catch (error) {
  //     console.error("Verification failed", error);
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

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

  setStep: (step: "form" | "summary" | "payment" | "success") => {
    set((state) => ({
      ...state,
      step: step,
      isBookingOpen: true
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
    // Used by Clients
    try {
      const response = await getConsults();
      const transformedData = response.data.map(transformConsultationFromAPI);
      set({ consultations: transformedData });
    } catch (err) {
      console.error("Failed to fetch client consultations", err);
    }
  },

  fetchConsultationDirect: async () => {
    // Used by Admins
    try {
      const response = await getAllConsult();
      const transformedData = response.data.map(transformConsultationFromAPI);
      set({ consultations: transformedData });
    } catch (err) {
      console.error("Failed to fetch all consultations for admin", err);
    }
  },

  submitConsultation: async () => {
    const { formData, addConsultation, setLastCreatedConsultCode, setStep } =
      get();

    console.log("Submitting with Fee ID:", formData?.consultationFeeId);
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
        // Transform the API response before adding to state
        const transformedConsult = transformConsultationFromAPI(response.data);

        if (response.data?.consultCode) {
          setLastCreatedConsultCode(response.data.consultCode);
        }

        addConsultation(transformedConsult);
        set({ step: "success", isLoading: false });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Store: Failed to create consultation", err);
      set({ isLoading: false });
      throw err;
    }
  }
}));

export default useConsultationStore;
