"use client";

import React, { useMemo, useState } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useBillingStore } from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Image as ImageIcon,
  Download
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
// import { invoiceConsultation, invoiceCase } from "@/app/api/invoice.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toPng } from "html-to-image";
// @ts-ignore
import { saveAs } from "file-saver";
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
  WidthType,
  BorderStyle,
  VerticalAlign
} from "docx";
import { getProfile } from "@/app/api/profile.api";

export function InvoiceDetailsSummary() {
  const { newInvoiceData, setStep, downloadAsDocx } = useInvoiceStore();
  const { rates } = useBillingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const invoice = useMemo(() => {
    if (!newInvoiceData) return null;
    return newInvoiceData;
  }, [newInvoiceData]);

  if (!invoice) return null;

  const shareToWhatsApp = () => {
    const text = `Hello, here is your invoice for ${newInvoiceData?.service}. Total Amount: ₦${newInvoiceData?.consultationFee?.toLocaleString()}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setStep("form")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Invoice Details</h1>
        </div>
        {/* <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-purple-600"
            onClick={() => setShowShareModal(true)}
          >
            Share Invoice
          </Button>       
          <Button
            onClick={downloadAsImage}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="mr-2 h-4 w-4" /> Download Invoice
          </Button>
        </div> */}
      </div>

      {/* Added ID here for html2canvas to target */}
      <div
        id="invoice-printable-card"
        className="bg-white rounded-xl border p-8 space-y-8 shadow-sm"
        style={{ backgroundColor: "#ffffff" }}
      >
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

        <div className="flex justify-end gap-4 pt-4 no-print">
          {/* <Button
            variant="secondary"
            className="px-8"
            onClick={() => setStep("form")}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-600 px-10"
            onClick={downloadAsImage}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Create"
            )}
          </Button> */}
          <Button
            variant="ghost"
            className="text-purple-600"
            onClick={shareToWhatsApp}
          >
            Share Invoice
          </Button>
          <Button
            onClick={downloadAsDocx}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="mr-2 h-4 w-4" /> Download Invoice
          </Button>
        </div>
      </div>

      {/* Share Modal */}
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
              onClick={downloadAsDocx}
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
