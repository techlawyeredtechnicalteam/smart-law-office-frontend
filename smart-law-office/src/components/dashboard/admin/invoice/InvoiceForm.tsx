"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InvoiceFormValues, invoiceFormSchema } from "@/types/Invoice.schema";
import { useInvoiceStore } from "@/store/invoiceStore";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { currentDate, currentTime } from "@/utils/time-date";
import { CustomSelectField } from "@/components/shared/CustomSelectField";

export function CreateInvoiceForm() {
  const { setNewInvoiceData, setStep, newInvoiceData } = useInvoiceStore();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceId: "2025-0012",
      clientName: "",
      service: "Consultation",
      duration: "30 minutes",
      consultationFee: 30000,
      date: "dd/mm/yy",
      time: "--:--",
      notes: ""
    }
  });

  const handlePreview = (values: InvoiceFormValues) => {
    setNewInvoiceData(values);
    setStep("details");
  };
  
  const feeWatch = form.watch("consultationFee");

  const serviceOptions: Array<InvoiceFormValues["service"]> = [
    "Consultation",
    "Case",
    "Document Review"
  ];
  const durationOptions: Array<InvoiceFormValues["duration"]> = [
    "30 minutes",
    "1 hour",
    "Custom"
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold mb-6">Create Invoice</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-6">
          {/* Invoice ID (Read-only) */}
          <CustomFormField
            control={form.control}
            name="invoiceId"
            label="Invoice ID"
            placeholder="2025-0012"
            readOnly
            className="bg-purple-50 border-purple-300"
          />

          {/* Client Name */}
          <CustomFormField
            control={form.control}
            name="clientName"
            label="Client Name"
            placeholder="Type something here..."
          />
          
          {/* Consultation Fee */}
          <CustomFormField
            control={form.control}
            name="consultationFee"
            label="Consultation Fee"
            placeholder="30,000"
            type="number"
          />

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={form.control}
              name="date"
              label="Date"
              placeholder="dd/mm/yy"
            />
            <CustomFormField
              control={form.control}
              name="time"
              label="Time"
              placeholder="--:--"
              type="time"
            />
          </div>

          {/* Notes */}
          <CustomFormField
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="E.g. contract review inquiry, initial case discussion..."
            type="textarea"
            rows={4}
          />

          {/* Date/Time stamp at bottom left (Replication only) */}
          <div className="flex justify-between text-sm text-gray-500 pt-4">
            <span>{currentDate}</span>
            <span>{currentTime}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("dashboard")}
            >
              Save as Draft
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Preview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
