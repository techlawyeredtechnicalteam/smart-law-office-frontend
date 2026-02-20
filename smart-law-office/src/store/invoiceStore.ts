import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getInvoices } from "@/app/api/invoice.api";
import { InvoiceDetails, InvoiceFormValues } from "@/types/Invoice.schema";

export type InvoiceStep =
  | "dashboard"
  | "form"
  | "details"
  | "success"
  | "history";

interface InvoiceState {
  step: InvoiceStep;
  invoiceHistory: InvoiceDetails[];
  isLoading: boolean;
  newInvoiceData: Partial<InvoiceFormValues> | null;
  activeInvoiceId: string | null;

  setStep: (step: InvoiceStep) => void;
  setNewInvoiceData: (data: Partial<InvoiceFormValues> | null) => void;
  setActiveInvoiceId: (id: string | null) => void;
  fetchInvoices: () => Promise<void>;
  resetNewInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      step: "dashboard",
      invoiceHistory: [],
      isLoading: false,
      newInvoiceData: null,
      activeInvoiceId: null,

      setStep: (step) => set({ step }),

      setNewInvoiceData: (data) =>
        set({
          newInvoiceData: data,
          activeInvoiceId: null // Clear active ID when setting new data to avoid conflicts
        }),

      setActiveInvoiceId: (id) =>
        set({
          activeInvoiceId: id,
          newInvoiceData: null // Clear new data when viewing history
        }),

      resetNewInvoice: () =>
        set({ newInvoiceData: null, activeInvoiceId: null }),

      fetchInvoices: async () => {
        set({ isLoading: true });
        try {
          const response = await getInvoices();
          const history = (response?.data || []).map((inv: any) => ({
            invoiceId: inv.invoiceNumber || inv.id?.slice(0, 8) || "N/A",
            clientName: inv.userEmail || inv.clientEmail || "Unknown Client",
            staffEmail: inv.staffEmail || "Unknown Staff",
            service: inv.consultationFeeId ? "Consultation" : "Case",
            consultationFee: inv.amount || 0,
            duration: inv.duration || "N/A",
            date: new Date(
              inv.consultAt || inv.caseAt || inv.createdAt
            ).toLocaleDateString(),
            time: new Date(
              inv.consultAt || inv.caseAt || inv.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            notes: inv.note || "",
            status: inv.status || "Pending",
            accountDetails:
              inv.bankAccountNumber || inv.accountNumber || "0123456789",
            bank: inv.bankName || "UBA"
          }));
          set({ invoiceHistory: history });
        } catch (error) {
          console.error("Failed to fetch invoices:", error);
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "invoice-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
