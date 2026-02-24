import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getInvoices } from "@/app/api/invoice.api";
import { InvoiceDetails, InvoiceFormValues } from "@/types/Invoice.schema";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType
} from "docx";
// @ts-ignore
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { getProfile } from "@/app/api/profile.api";

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
  downloadAsDocx: () => Promise<void>;
  // handleCreateInvoice: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      step: "dashboard",
      invoiceHistory: [],
      isLoading: false,
      newInvoiceData: null,
      activeInvoiceId: null,

      setStep: (step) => set({ step }),

      setNewInvoiceData: (data) =>
        set({
          newInvoiceData: data,
          activeInvoiceId: null
        }),

      setActiveInvoiceId: (id) =>
        set({
          activeInvoiceId: id,
          newInvoiceData: null
        }),

      resetNewInvoice: () =>
        set({ newInvoiceData: null, activeInvoiceId: null }),

      // const handleCreateInvoice = async () => {
      //   if (!invoice) return;
      //   setIsSubmitting(true);

      //   try {
      //     /* // COMMENTED OUT PAYMENT LOGIC
      //     const selectedRate = rates.find(
      //       (r) => String(r.id) === String(invoice.subServiceId)
      //     );

      //     if (!selectedRate && invoice.service === "Consultation") {
      //       toast.error("Invalid Consultation Type selected.");
      //       setIsSubmitting(false);
      //       return;
      //     }

      //     const ISO_DATE = new Date(
      //       `${invoice.date}T${invoice.time}`
      //     ).toISOString();

      //     if (invoice.service === "Consultation") {
      //       const consultRate = selectedRate as any;
      //       await invoiceConsultation({
      //         consultationFeeId: String(consultRate?.id ?? ""),
      //         clientEmail: invoice.clientName ?? "",
      //         consultType: consultRate?.consultType ?? "TENANCY",
      //         consultAt: ISO_DATE,
      //         note: invoice.notes ?? "Consultation Invoice",
      //         amount: Number(invoice.consultationFee)
      //       });
      //     } else {
      //       const caseRate = selectedRate as any;
      //       await invoiceCase({
      //         caseTypeId: String(caseRate?.caseTypeId ?? ""),
      //         staffEmail: invoice.staffEmail ?? "",
      //         userEmail: invoice.clientName ?? "",
      //         caseAt: ISO_DATE,
      //         note: invoice.notes ?? "Case Invoice",
      //         amount: Number(invoice.consultationFee)
      //       });
      //     }
      //     */

      //     // Simulate network delay for UI feedback
      //     await new Promise((resolve) => setTimeout(resolve, 800));

      //     toast.success("Invoice Created Successfully");
      //     setStep("success");
      //   } catch (error: any) {
      //     const errorMsg =
      //       error.response?.data?.message?.[0] || "Failed to create invoice.";
      //     toast.error(errorMsg);
      //   } finally {
      //     setIsSubmitting(false);
      //   }
      // };

      downloadAsDocx: async () => {
        const invoice = get().newInvoiceData;
        if (!invoice) return;

        try {
          toast.loading("Invoice downloading...");

          const profileRes = await getProfile();
          const logoUrl = profileRes.data?.firm?.logo || profileRes.data?.logo;
          const firmName = profileRes.data?.firm?.name || "SMART LAW OFFICE";

          const docChildren: any[] = [];

          // 1. Add Logo if exists
          if (logoUrl) {
            try {
              const imgResponse = await fetch(logoUrl);
              if (imgResponse.ok) {
                const blobImage = await imgResponse.blob();
                const imageBuffer = await blobImage.arrayBuffer();

                const ext = logoUrl.split(".").pop()?.toLowerCase();
                const type =
                  ext === "jpg" || ext === "jpeg"
                    ? "jpg"
                    : ext === "gif"
                      ? "gif"
                      : "png";

                docChildren.push(
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        type,
                        data: new Uint8Array(imageBuffer),
                        transformation: { width: 80, height: 80 }
                      })
                    ]
                  })
                );
              }
            } catch (imgErr) {
              console.warn("Logo failed to load, skipping...", imgErr);
            }
          }

          // 2. Add Firm Branding
          docChildren.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: firmName.toUpperCase(),
                  bold: true,
                  size: 32,
                  color: "6D28D9"
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: firmName ? "Invoice from Smart Law Office" : "Invoice",
                  size: 20
                })
              ],
              spacing: { after: 400 }
            }),
            new Paragraph({
              text: "INVOICE SUMMARY",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 }
            })
          );

          // 3. Table Row Helper
          const createRow = (label: string, value: string) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(label)],
                  width: { size: 40, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: value, bold: true })]
                    })
                  ],
                  width: { size: 60, type: WidthType.PERCENTAGE }
                })
              ]
            });

          // 4. Client Details
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: "Client Details", bold: true })],
              spacing: { before: 200, after: 120 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                createRow("Invoice ID", invoice.invoiceId || "N/A"),
                createRow("Client Name", invoice.clientName || "N/A"),
                createRow("Service", invoice.service || "N/A")
              ]
            })
          );

          // 5. Financial Summary
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Financial Summary", bold: true })
              ],
              spacing: { before: 400, after: 120 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                createRow(
                  "Total Amount",
                  `NGN ${Number(invoice.consultationFee).toLocaleString()}`
                ),
                createRow("Duration", invoice.duration || "N/A"),
                createRow("Date", invoice.date || "N/A"),
                createRow("Time", invoice.time || "N/A")
              ]
            })
          );

          // 6. Notes
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: "Notes", bold: true })],
              spacing: { before: 400, after: 120 }
            }),
            new Paragraph({
              text: invoice.notes || "No notes added...",
              spacing: { after: 400 }
            })
          );

          // 7. Build & Save
          const doc = new Document({
            sections: [
              {
                properties: {
                  page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }
                  }
                },
                children: docChildren
              }
            ]
          });

          const blob = await Packer.toBlob(doc);
          saveAs(
            blob,
            `Invoice-${invoice.clientName?.replace(/\s+/g, "_") || "Draft"}.docx`
          );

          toast.dismiss();
          toast.success("Invoice downloaded");
        } catch (error) {
          console.error("Docx Error:", error);
          toast.dismiss();
          toast.error("Failed to generate Word document");
        }
      },

      fetchInvoices: async () => {
        set({ isLoading: true });
        try {
          const response = await getInvoices();

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
          set({ invoiceHistory: [] });
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
