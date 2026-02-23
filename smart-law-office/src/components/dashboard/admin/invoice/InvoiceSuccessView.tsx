"use client";

import React from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/store/invoiceStore";
import { CheckCircle2, Share2, Download, Home } from "lucide-react";
import { toast } from "sonner";

export function InvoiceSuccessView() {
  const { newInvoiceData, setStep, resetNewInvoice } = useInvoiceStore();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadAsImage = async () => {
    // IMPORTANT: Ensure "invoice-card" exists in the DOM
    const element = document.getElementById("invoiceId");

    if (!element) {
      toast.error(
        "Invoice card not found. Please try printing from the preview page."
      );
      return;
    }

    setIsDownloading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        // scale: 2 improves resolution for high-quality images
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        link.href = data;
        link.download = `invoice-${newInvoiceData?.invoiceId || "download"}.png`;
        link.click();
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Generating invoice image...",
      success: "Downloaded successfully!",
      error: "Failed to generate image."
    });

    setIsDownloading(false);
  };

  const shareToWhatsApp = () => {
    const text = `Hello, here is your invoice for ${newInvoiceData?.service}. Total Amount: ₦${newInvoiceData?.consultationFee?.toLocaleString()}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl border shadow-sm max-w-lg mx-auto mt-10">
      <div className="bg-green-50 p-4 rounded-full mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Invoice Generated!
      </h1>
      <p className="text-gray-500 mb-8">
        Invoice{" "}
        <span className="font-mono font-bold text-gray-700">
          #{newInvoiceData?.invoiceId}
        </span>{" "}
        has been created successfully for {newInvoiceData?.clientName}.
      </p>

      <div className="grid grid-cols-1 w-full gap-3">
        <Button
          onClick={downloadAsImage}
          className="bg-purple-600 hover:bg-purple-700 h-12 text-lg"
        >
          <Download className="mr-2 h-5 w-5" /> Download Invoice
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={shareToWhatsApp}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Share2 className="mr-2 h-4 w-4" /> WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetNewInvoice();
              setStep("dashboard");
            }}
          >
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
