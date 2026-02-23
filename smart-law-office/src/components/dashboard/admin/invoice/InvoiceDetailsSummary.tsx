"use client";

import React, { useMemo, useState } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useBillingStore } from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { invoiceConsultation, invoiceCase } from "@/app/api/invoice.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export function InvoiceDetailsSummary() {
  const { newInvoiceData, setStep } = useInvoiceStore();
  const { rates } = useBillingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const invoice = useMemo(() => {
    if (!newInvoiceData) return null;
    return newInvoiceData;
  }, [newInvoiceData]);

  if (!invoice) return null;

  const handleCreateInvoice = async () => {
    if (!invoice) return;
    setIsSubmitting(true);

    try {
      const selectedRate = rates.find(
        (r) => String(r.id) === String(invoice.subServiceId)
      );

      // Safety check: ensure the rate exists
      if (!selectedRate && invoice.service === "Consultation") {
        toast.error("Invalid Consultation Type selected.");
        return;
      }

      const ISO_DATE = new Date(
        `${invoice.date}T${invoice.time}`
      ).toISOString();

      if (invoice.service === "Consultation") {
        const consultRate = selectedRate as any;

        await invoiceConsultation({
          consultationFeeId: String(consultRate?.id ?? ""),
          clientEmail: invoice.clientName ?? "",
          consultType: consultRate?.consultType ?? "TENANCY",
          consultAt: ISO_DATE,
          note: invoice.notes ?? "Consultation Invoice",
          amount: Number(invoice.consultationFee)
        });
      } else {
        // Case logic remains the same
        const caseRate = selectedRate as any;
        await invoiceCase({
          caseTypeId: String(caseRate?.caseTypeId ?? ""),
          staffEmail: invoice.staffEmail ?? "",
          userEmail: invoice.clientName ?? "",
          caseAt: ISO_DATE,
          note: invoice.notes ?? "Case Invoice",
          amount: Number(invoice.consultationFee)
        });
      }

      toast.success("Invoice Created Successfully");
      setStep("success");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message?.[0] || "Failed to create invoice.";
      toast.error(errorMsg);
      console.error("Payload Error:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="invoice-card" className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Invoice Details</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-purple-600"
            onClick={() => setShowShareModal(true)}
          >
            Share Invoice
          </Button>
          <Button className="bg-purple-600">Download Invoice</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-8 space-y-8 shadow-sm">
        {/* Client Details Section */}
        <section>
          <h2 className="font-bold mb-4">Client Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice ID</span>
              <span>{invoice.invoiceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Client Name</span>
              <span>{invoice.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span>{invoice.service}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold border-t pt-6 mb-4">Invoice Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Consultation Fee</span>
              <span className="font-bold">
                ₦ {Number(invoice.consultationFee).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span>{invoice.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span>{invoice.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span>{invoice.time}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold border-t pt-6 mb-2">Notes</h2>
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 min-h-[80px]">
            {invoice.notes || "No notes added..."}
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="secondary"
            className="px-8"
            onClick={() => setStep("form")}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-600 px-10"
            onClick={handleCreateInvoice}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>

      {/* Share Modal  */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Share as
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 border-purple-100 bg-purple-50/50 text-purple-600 hover:bg-purple-50"
            >
              <FileText className="h-6 w-6" /> <span>PDF</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 border-purple-100 bg-purple-50/50 text-purple-600 hover:bg-purple-50"
            >
              <ImageIcon className="h-6 w-6" /> <span>Image</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
