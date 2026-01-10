import { create } from "zustand";
import { InvoiceFormValues, InvoiceDetails } from "@/types/Invoice.schema";

export type InvoiceStep =
  | "dashboard"
  | "form"
  | "details"
  | "payment"
  | "success"
  | "history";

const MOCK_INVOICE_HISTORY: InvoiceDetails[] = [
  {
    invoiceId: "2025-0012",
    clientName: "Christine Adewale",
    service: "Case",
    consultationFee: 144000,
    duration: "1 hour",
    date: "2025-11-09",
    time: "10:00 AM",
    notes: "Initial filing fee",
    accountDetails: "3231324233",
    bank: "UBA",
    status: "Successful"
  },
  {
    invoiceId: "2025-0012",
    clientName: "Christine Adewale",
    service: "Consultation",
    consultationFee: 144000,
    duration: "30 minutes",
    date: "2025-11-09",
    time: "11:00 AM",
    notes: "Follow up discussion",
    accountDetails: "3231324233",
    bank: "UBA",
    status: "Successful"
  },
  {
    invoiceId: "2025-0012",
    clientName: "Jane Francis",
    service: "Case",
    consultationFee: 100000,
    duration: "1 hour",
    date: "2025-11-09",
    time: "12:00 PM",
    notes: "Contract review",
    accountDetails: "3231324233",
    bank: "UBA",
    status: "Pending"
  }
];

interface InvoiceState {
  step: InvoiceStep;
  invoiceHistory: InvoiceDetails[];
  newInvoiceData: Partial<InvoiceFormValues> | null;
  activeInvoiceId: string | null;

  setStep: (step: InvoiceStep) => void;
  setNewInvoiceData: (data: Partial<InvoiceFormValues>) => void;
  finalizeInvoice: () => void;
  setActiveInvoiceId: (id: string | null) => void;
}

const defaultInvoiceData: Partial<InvoiceFormValues> = {
  invoiceId: "2025-0012",
  clientName: "Cynthia Ofurie",
  service: "Consultation",
  duration: "30 minutes",
  consultationFee: 30000,
  date: "November 20, 2025",
  time: "10:00 AM",
  notes: "Contract review inquiry, initial case discussion..."
};

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  step: "dashboard",
  invoiceHistory: MOCK_INVOICE_HISTORY,
  newInvoiceData: defaultInvoiceData,
  activeInvoiceId: null,

  setStep: (step) => set({ step }),

  setNewInvoiceData: (data) =>
    set({ newInvoiceData: { ...get().newInvoiceData, ...data } }),

  finalizeInvoice: () => {
    // Logic to add the new invoice to history (simulated success)
    const newId = `2025-${Math.floor(Math.random() * 9000 + 1000)}`;
    const finalizedInvoice: InvoiceDetails = {
      ...(get().newInvoiceData as InvoiceFormValues),
      invoiceId: newId,
      accountDetails: "3231324233",
      bank: "UBA",
      status: "Successful"
    };

    set((state) => ({
      invoiceHistory: [finalizedInvoice, ...state.invoiceHistory],
      step: "details", // Go back to details view or dashboard
      newInvoiceData: null,
      activeInvoiceId: newId
    }));
  },

  setActiveInvoiceId: (id) => set({ activeInvoiceId: id })
}));
