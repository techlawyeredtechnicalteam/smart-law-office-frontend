"use client";

import React, { useMemo } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import {
  useBillingStore,
  ConsultationRate,
  CaseRate
} from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { invoiceConsultation, invoiceCase } from "@/app/api/invoice.api";

export function InvoiceDetailsSummary() {
  const { newInvoiceData, setStep } = useInvoiceStore();
  const { formData: firmProfile } = useFirmProfileStore();
  const { rates } = useBillingStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const invoice = useMemo(() => {
    if (!newInvoiceData) return null;

    return {
      invoiceId: newInvoiceData.invoiceId || "",
      clientName: newInvoiceData.clientName || "",
      staffEmail: newInvoiceData.staffEmail || "",
      service: newInvoiceData.service || "Consultation",
      subServiceId: newInvoiceData.subServiceId || "",
      consultationFee: newInvoiceData.consultationFee || 0,
      duration: newInvoiceData.duration || "",
      date: newInvoiceData.date || "",
      time: newInvoiceData.time || "",
      notes: newInvoiceData.notes || "",
      accountNumber: firmProfile.bankAccountNumber || "Not Set",
      bankName: firmProfile.bankName || "Not Set"
    };
  }, [newInvoiceData, firmProfile]);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <p className="text-gray-500 mb-4">No invoice data found to preview.</p>
        <Button onClick={() => setStep("form")}>Back to Form</Button>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
  };

  const handlePay = async () => {
    setIsSubmitting(true);
    try {
      const selectedRate = rates.find(
        (r) => String(r.id) === String(invoice.subServiceId)
      ) as any;

      if (!selectedRate) {
        toast.error(
          "Could not find the selected service rate. Please go back and reselect."
        );
        setIsSubmitting(false);
        return;
      }

      const ISO_DATE = new Date(
        `${invoice.date}T${invoice.time}`
      ).toISOString();

      if (invoice.service === "Consultation") {
        const payload = {
          consultationFeeId: String(selectedRate.id || ""),
          clientEmail: invoice.clientName,
          consultType: String(selectedRate.consultType || ""),
          consultAt: ISO_DATE,
          note: invoice.notes || "Consultation Invoice",
          amount: Number(selectedRate.rate || 0)
        };
        console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));
        await invoiceConsultation(payload);
      } else {
        const payload = {
          caseTypeId: String(selectedRate.caseTypeId || ""),
          staffEmail: invoice.staffEmail,
          userEmail: invoice.clientName,
          caseAt: ISO_DATE,
          note: invoice.notes || "Case Invoice",
          amount: Number(selectedRate.caseRate || 0)
        };
        await invoiceCase(payload);
      }

      toast.success("Invoice Generated Successfully");
      setStep("success");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Submission failed. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Review Invoice</h1>
      </div>

      <div className="space-y-6">
        {/* Section: Service Details */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Service Details
          </h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-gray-600">Service Type</span>
            <span className="font-medium text-right">{invoice.service}</span>

            <span className="text-gray-600">Client</span>
            <span className="font-medium text-right">{invoice.clientName}</span>

            {invoice.service === "Case" && (
              <>
                <span className="text-gray-600">Staff Email</span>
                <span className="font-medium text-right">
                  {invoice.staffEmail}
                </span>
              </>
            )}

            <span className="text-gray-600">Scheduled For</span>
            <span className="font-medium text-right">
              {invoice.date} at {invoice.time}
            </span>
          </div>
        </section>

        <Separator />

        {/* Section: Payment Details */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Payment Information
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bank Name</span>
              <span className="font-semibold">{invoice.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account Number</span>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => copyToClipboard(invoice.accountNumber)}
              >
                <span className="font-mono font-bold">
                  {invoice.accountNumber}
                </span>
                <Copy className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 p-2">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-black text-purple-700">
              ₦{invoice.consultationFee.toLocaleString()}
            </span>
          </div>
        </section>

        {/* Section: Notes */}
        {invoice.notes && (
          <section className="bg-amber-50/50 p-3 rounded border border-amber-100">
            <p className="text-xs font-bold text-amber-800 mb-1">Notes:</p>
            <p className="text-sm text-amber-900">{invoice.notes}</p>
          </section>
        )}

        {/* Action Button */}
        <Button
          onClick={handlePay}
          disabled={isSubmitting}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg font-bold mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₦${invoice.consultationFee.toLocaleString()}`
          )}
        </Button>
      </div>
    </div>
  );
}
