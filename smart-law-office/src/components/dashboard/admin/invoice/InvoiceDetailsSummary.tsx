"use client";

import React from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Copy, FileText, ImageIcon, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { InvoiceDetails } from "@/types/Invoice.schema";

export function InvoiceDetailsSummary() {
  const { newInvoiceData, invoiceHistory, activeInvoiceId, setStep } =
    useInvoiceStore();

  const invoice = activeInvoiceId
    ? invoiceHistory.find((inv) => inv.invoiceId === activeInvoiceId)
    : (newInvoiceData as InvoiceDetails);

  const isHistoryView =
    !!activeInvoiceId &&
    (invoice?.status === "Successful" || invoice?.status === "Pending");
  const isPaid = invoice?.status === "Successful";

  if (!invoice) {
    return <div className="text-center p-10">Invoice data not found.</div>;
  }

  const handlePay = () => {
    setStep("payment");
  };

  const handleBack = () => {
    setStep(isHistoryView ? "dashboard" : "form");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-bold">
          ← {isHistoryView ? "Invoice History" : "Invoice Details"}
        </h1>
        <div className="flex space-x-2">
          {isHistoryView && (
            <>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Download History
              </Button>
            </>
          )}
          {!isHistoryView && (
            <>
              <Button variant="outline" className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" /> <span>Share Invoice</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Download Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="mt-8 space-y-8">
        {/* Client Details */}
        <h2 className="text-xl font-bold">Client Details</h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <p className="text-gray-500">Invoice ID</p>
          <p className="font-medium text-right">{invoice.invoiceId}</p>

          <p className="text-gray-500">Client Name</p>
          <p className="font-medium text-right">{invoice.clientName}</p>

          <p className="text-gray-500">Service</p>
          <p className="font-medium text-right">{invoice.service}</p>
        </div>

        <Separator />

        {/* Invoice Summary */}
        <h2 className="text-xl font-bold">Invoice Summary</h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <p className="text-gray-500">Account Details</p>
          <div className="flex justify-end items-center space-x-2">
            <p className="font-medium">{invoice.accountDetails || "N/A"}</p>
            <Copy className="h-4 w-4 cursor-pointer text-gray-500 hover:text-purple-600" />
          </div>

          <p className="text-gray-500">UBA</p>
          <p className="font-medium text-right">
            {invoice.bank || "Smart Law Office"}
          </p>

          {isHistoryView && (
            <>
              <p className="text-gray-500">Status</p>
              <div className="flex justify-end">
                <Badge
                  variant="secondary"
                  className={cn(
                    invoice.status === "Successful" &&
                      "bg-green-100 text-green-700 hover:bg-green-100",
                    invoice.status === "Pending" &&
                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  )}
                >
                  {invoice.status}
                </Badge>
              </div>
            </>
          )}

          <p className="text-gray-500">Consultation Fee</p>
          <p className="font-medium text-right">
            ₦{invoice.consultationFee.toLocaleString()}
          </p>

          <p className="text-gray-500">Duration</p>
          <p className="font-medium text-right">{invoice.duration}</p>

          <p className="text-gray-500">Date</p>
          <p className="font-medium text-right">{invoice.date}</p>

          <p className="text-gray-500">Time</p>
          <p className="font-medium text-right">{invoice.time}</p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h3 className="font-bold">Notes</h3>
          <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-700 min-h-20">
            {invoice.notes || "No notes provided."}
          </div>
        </div>

        {isHistoryView && (
          <div className="pt-4 space-y-4">
            <h3 className="font-bold">Share as</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-1 text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <FileText className="h-6 w-6" />
                <span>PDF</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-1 text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <ImageIcon className="h-6 w-6" />
                <span>Image</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
        {!isPaid && !isHistoryView && (
          <>
            <Button onClick={() => setStep("form")} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Pay
            </Button>
          </>
        )}
        {isPaid && isHistoryView && (
          <Button
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to History
          </Button>
        )}
      </div>
    </div>
  );
}
