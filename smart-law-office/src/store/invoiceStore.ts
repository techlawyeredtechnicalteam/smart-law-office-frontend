import { create } from "zustand";
import { getInvoices } from "@/app/api/invoice.api";
import { InvoiceDetails, InvoiceFormValues } from "@/types/Invoice.schema";

export type InvoiceStep =
  | "dashboard"
  | "form"
  | "details"
  | "history"
  | "success";

interface InvoiceState {
  step: InvoiceStep;
  invoiceHistory: InvoiceDetails[];
  isLoading: boolean;
  newInvoiceData: Partial<InvoiceFormValues> | null;
  activeInvoiceId: string | null;

  setStep: (step: InvoiceStep) => void;
  setNewInvoiceData: (data: Partial<InvoiceFormValues>) => void;
  setActiveInvoiceId: (id: string | null) => void;

  fetchInvoices: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  step: "dashboard",
  invoiceHistory: [],
  isLoading: false,
  newInvoiceData: null,
  activeInvoiceId: null,

  setStep: (step) => set({ step }),
  setNewInvoiceData: (data) => set({ newInvoiceData: data }),
  setActiveInvoiceId: (id) => set({ activeInvoiceId: id }),

  fetchInvoices: async () => {
    set({ isLoading: true });
    try {
      const response = await getInvoices();
      // Map API response to the InvoiceDetails interface
      const history = (response?.data || []).map((inv: any) => ({
        invoiceId: inv.invoiceNumber || inv.id?.slice(0, 8) || "N/A",
        clientName: inv.userEmail || inv.clientEmail || "Unknown Client",
        service: inv.consultationFeeId ? "Consultation" : "Case",
        consultationFee: inv.amount || 0,
        duration: inv.duration || "N/A",
        date: new Date(
          inv.consultAt || inv.caseAt || inv.createdAt
        ).toLocaleDateString(),
        time: new Date(
          inv.consultAt || inv.caseAt || inv.createdAt
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        notes: inv.note || "",
        status: inv.status || "Pending",
        accountDetails: inv.accountNumber || "",
        bank: inv.bankName || ""
      }));
      set({ invoiceHistory: history });
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      set({ isLoading: false });
    }
  }
}));

// import { create } from "zustand";
// import { InvoiceFormValues, InvoiceDetails } from "@/types/Invoice.schema";

// export type InvoiceStep =
//   | "dashboard"
//   | "form"
//   | "details"
//   | "payment"
//   | "success"
//   | "history";

// const MOCK_INVOICE_HISTORY: InvoiceDetails[] = [
//   {
//     invoiceId: "2025-0012",
//     clientName: "Christine Adewale",
//     service: "Case",
//     consultationFee: 144000,
//     duration: "1 hour",
//     date: "2025-11-09",
//     time: "10:00 AM",
//     notes: "Initial filing fee",
//     accountDetails: "3231324233",
//     bank: "UBA",
//     status: "Successful"
//   },
//   {
//     invoiceId: "2025-0012",
//     clientName: "Christine Adewale",
//     service: "Consultation",
//     consultationFee: 144000,
//     duration: "30 minutes",
//     date: "2025-11-09",
//     time: "11:00 AM",
//     notes: "Follow up discussion",
//     accountDetails: "3231324233",
//     bank: "UBA",
//     status: "Successful"
//   },
//   {
//     invoiceId: "2025-0012",
//     clientName: "Jane Francis",
//     service: "Case",
//     consultationFee: 100000,
//     duration: "1 hour",
//     date: "2025-11-09",
//     time: "12:00 PM",
//     notes: "Contract review",
//     accountDetails: "3231324233",
//     bank: "UBA",
//     status: "Pending"
//   }
// ];

// interface InvoiceState {
//   step: InvoiceStep;
//   invoiceHistory: InvoiceDetails[];
//   newInvoiceData: Partial<InvoiceFormValues> | null;
//   activeInvoiceId: string | null;

//   setStep: (step: InvoiceStep) => void;
//   setNewInvoiceData: (data: Partial<InvoiceFormValues>) => void;
//   finalizeInvoice: () => void;
//   setActiveInvoiceId: (id: string | null) => void;
// }

// const defaultInvoiceData: Partial<InvoiceFormValues> = {
//   invoiceId: "2025-0012",
//   clientName: "Cynthia Ofurie",
//   service: "Consultation",
//   duration: "30 minutes",
//   consultationFee: 30000,
//   date: "November 20, 2025",
//   time: "10:00 AM",
//   notes: "Contract review inquiry, initial case discussion..."
// };

// export const useInvoiceStore = create<InvoiceState>((set, get) => ({
//   step: "dashboard",
//   invoiceHistory: MOCK_INVOICE_HISTORY,
//   newInvoiceData: defaultInvoiceData,
//   activeInvoiceId: null,

//   setStep: (step) => set({ step }),

//   setNewInvoiceData: (data) =>
//     set({ newInvoiceData: { ...get().newInvoiceData, ...data } }),

//   finalizeInvoice: () => {
//     // Logic to add the new invoice to history (simulated success)
//     const newId = `2025-${Math.floor(Math.random() * 9000 + 1000)}`;
//     const finalizedInvoice: InvoiceDetails = {
//       ...(get().newInvoiceData as InvoiceFormValues),
//       invoiceId: newId,
//       accountDetails: "3231324233",
//       bank: "UBA",
//       status: "Successful"
//     };

//     set((state) => ({
//       invoiceHistory: [finalizedInvoice, ...state.invoiceHistory],
//       step: "details",
//       newInvoiceData: null,
//       activeInvoiceId: newId
//     }));
//   },

//   setActiveInvoiceId: (id) => set({ activeInvoiceId: id })
// }));
