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

          // FIX: Axios returns the actual API response inside the .data property
          const rawData = response?.data || [];

          const history = rawData.map((inv: any) => {
            const isCase = inv.type === "CASE";
            const source = isCase ? inv.directCase : inv.consult;

            const client = source?.client;
            const clientName = client
              ? `${client.firstName} ${client.lastName}`
              : inv.userEmail || "Unknown Client";

            const dateVal = inv.createdAt || source?.createdAt;

            return {
              invoiceId: inv.invoiceId || "N/A",
              clientName: clientName,
              staffEmail: source?.staff?.email || "Unknown Staff",
              service: isCase ? "Case" : "Consultation",
              consultationFee: inv.consultationFee || 0,
              duration: inv.duration || "N/A",
              date: dateVal ? new Date(dateVal).toLocaleDateString() : "N/A",
              time: dateVal
                ? new Date(dateVal).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "N/A",
              notes: inv.note || "",
              status: inv.status === "DRAFT" ? "Pending" : "Successful",
              accountDetails: "0123456789",
              bank: "UBA"
            };
          });

          set({ invoiceHistory: history });
        } catch (error) {
          console.error("Failed to fetch invoices:", error);
          set({ invoiceHistory: [] }); // Fallback to empty on error
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
