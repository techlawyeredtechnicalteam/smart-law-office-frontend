"use client";

import React, { useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { invoiceFormSchema, InvoiceFormValues } from "@/types/Invoice.schema";
import { useInvoiceStore } from "@/store/invoiceStore";
import {
  CaseRate,
  ConsultationRate,
  useBillingStore
} from "@/store/setRateBill";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { toast } from "sonner";
import { invoiceConsultation, invoiceCase } from "@/app/api/invoice.api";

export function CreateInvoiceForm() {
  const { setStep, setNewInvoiceData } = useInvoiceStore();
  const { rates, fetchBillingInitialData } = useBillingStore();

  React.useEffect(() => {
    fetchBillingInitialData();
  }, []);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      service: "Consultation",
      subServiceId: "",
      duration: "30 minutes",
      consultationFee: 0,
      staffEmail: "",
      notes: ""
    }
  });

  // Watchers to trigger updates
  const selectedService = useWatch({ control: form.control, name: "service" });
  const selectedSubServiceId = useWatch({
    control: form.control,
    name: "subServiceId"
  });

  // Reset Sub-Service and Fee when main Service changes
  useEffect(() => {
    form.setValue("subServiceId", "");
    form.setValue("consultationFee", 0);
    form.setValue("staffEmail", "");
  }, [selectedService, form]);

  // Auto-fill price when a Sub-Service (Consultation Type) is selected
  useEffect(() => {
    if (selectedSubServiceId && rates.length > 0) {
      const selectedRate = rates.find(
        (r) => String(r.id) === String(selectedSubServiceId)
      );

      if (selectedRate) {
        // Safe type-checking to grab the correct amount
        const price =
          selectedRate.serviceType === "Consultation"
            ? (selectedRate as ConsultationRate).rate
            : (selectedRate as CaseRate).caseRate;

        form.setValue("consultationFee", Number(price || 0));
      }
    }
  }, [selectedSubServiceId, rates, form]);

  const subServiceOptions = useMemo(() => {
    return rates
      .filter((r) => r.serviceType === selectedService)
      .map((r) => ({
        label:
          r.serviceType === "Consultation"
            ? r.consultType
            : (r as CaseRate).subServiceType,
        value: String(r.id)
      }));
  }, [selectedService, rates]);

  const handlePreview = (values: InvoiceFormValues) => {
    setNewInvoiceData(values);
    setStep("details");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-6">Create Invoice</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-4">
          <CustomSelectField
            control={form.control}
            name="service"
            label="Select Service"
            placeholder="Select Service"
            options={[
              { label: "Consultation", value: "Consultation" },
              { label: "Case", value: "Case" }
            ]}
          />

          <CustomSelectField
            control={form.control}
            name="subServiceId"
            label={
              selectedService === "Consultation"
                ? "Consultation Type"
                : "Case Type"
            }
            placeholder="Select Type"
            options={subServiceOptions}
          />

          <CustomFormField
            control={form.control}
            name="consultationFee"
            placeholder="₦0.00"
            label="Amount (₦)"
            type="number"
            readOnly
            className="bg-gray-100 border-gray-200 font-bold text-violet-700 cursor-not-allowed"
          />

          <CustomFormField
            control={form.control}
            name="clientName"
            label={
              selectedService === "Case"
                ? "Client Email"
                : "Client Email / Name"
            }
            placeholder="client@email.com"
          />

          {/* Only show Staff Email when Case is selected */}
          {selectedService === "Case" && (
            <CustomFormField
              control={form.control}
              name="staffEmail"
              label="Staff Email"
              placeholder="staff@firm.com"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={form.control}
              placeholder="Date"
              name="date"
              label="Date"
              type="date"
            />
            <CustomFormField
              control={form.control}
              placeholder="Time"
              name="time"
              label="Time"
              type="time"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              {...form.register("notes")}
              className="w-full min-h-25 p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              placeholder="Add specific details for this invoice..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600">
              Preview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// "use client";

// import React from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { InvoiceFormValues, invoiceFormSchema } from "@/types/Invoice.schema";
// import { useInvoiceStore } from "@/store/invoiceStore";
// import { CustomFormField } from "@/components/shared/CustomFormField";
// import { currentDate, currentTime } from "@/utils/time-date";
// import { CustomSelectField } from "@/components/shared/CustomSelectField";

// export function CreateInvoiceForm() {
//   const { setNewInvoiceData, setStep, newInvoiceData } = useInvoiceStore();

//   const form = useForm<InvoiceFormValues>({
//     resolver: zodResolver(invoiceFormSchema),
//     defaultValues: {
//       invoiceId: "2025-0012",
//       clientName: "",
//       service: "Consultation",
//       duration: "30 minutes",
//       consultationFee: 30000,
//       date: "dd/mm/yy",
//       time: "--:--",
//       notes: ""
//     }
//   });

//   const handlePreview = (values: InvoiceFormValues) => {
//     setNewInvoiceData(values);
//     setStep("details");
//   };

//   const feeWatch = form.watch("consultationFee");

//   const serviceOptions: Array<InvoiceFormValues["service"]> = [
//     "Consultation",
//     "Case",
//     "Document Review"
//   ];
//   const durationOptions: Array<InvoiceFormValues["duration"]> = [
//     "30 minutes",
//     "1 hour",
//     "Custom"
//   ];

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
//       <h2 className="text-xl font-bold mb-6">Create Invoice</h2>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-6">
//           {/* Invoice ID (Read-only) */}
//           <CustomFormField
//             control={form.control}
//             name="invoiceId"
//             label="Invoice ID"
//             placeholder="2025-0012"
//             readOnly
//             className="bg-purple-50 border-purple-300"
//           />

//           {/* Client Name */}
//           <CustomFormField
//             control={form.control}
//             name="clientName"
//             label="Client Name"
//             placeholder="Type something here..."
//           />

//           {/* Consultation Fee */}
//           <CustomFormField
//             control={form.control}
//             name="consultationFee"
//             label="Consultation Fee"
//             placeholder="30,000"
//             type="number"
//           />

//           {/* Date and Time */}
//           <div className="grid grid-cols-2 gap-4">
//             <CustomFormField
//               control={form.control}
//               name="date"
//               label="Date"
//               placeholder="dd/mm/yy"
//             />
//             <CustomFormField
//               control={form.control}
//               name="time"
//               label="Time"
//               placeholder="--:--"
//               type="time"
//             />
//           </div>

//           {/* Notes */}
//           <CustomFormField
//             control={form.control}
//             name="notes"
//             label="Notes"
//             placeholder="E.g. contract review inquiry, initial case discussion..."
//             type="textarea"
//             rows={4}
//           />

//           {/* Date/Time stamp at bottom left (Replication only) */}
//           <div className="flex justify-between text-sm text-gray-500 pt-4">
//             <span>{currentDate}</span>
//             <span>{currentTime}</span>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setStep("dashboard")}
//             >
//               Save as Draft
//             </Button>
//             <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
//               Preview
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
