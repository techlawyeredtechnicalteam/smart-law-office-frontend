"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultationFormSchema,
  ConsultationFormValues
} from "@/types/Consultation.schema";
import useConsultationStore from "@/store/consultationStore";
// Custom Components
import { CustomFormField } from "@/components/shared/CustomFormField";
// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useBillingStore } from "@/store/setRateBill";
import React, { useMemo } from "react";
import FileUpload from "@/components/shared/FileUpload";
import { CustomSelectField } from "@/components/shared/CustomSelectField";

interface BookConsultationFormProps {
  onClose?: () => void;
}

export function BookConsultationForm({ onClose }: BookConsultationFormProps) {
  const { setFormData, setStep } = useConsultationStore();
  const { rates, fetchConsultationFeesOnly, isLoading } = useBillingStore();

  // fetch billing data on mount
  React.useEffect(() => {
    if (rates.length === 0) {
      fetchConsultationFeesOnly();
    }
  }, [rates.length, fetchConsultationFeesOnly]);

  const consultationOptions = useMemo(() => {
    return rates
      .filter((r: any) => r.serviceType === "Consultation")
      .map((rate: any) => ({
        label: `${rate.consultType} (${rate.duration} mins) — ₦${rate.rate.toLocaleString()}`,
        value: rate.id || rate._id || rate.consultType
      }));
  }, [rates]);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      consultationFeeId: "",
      date: "",
      time: "",
      note: "",
      document: null
    },
    mode: "onChange"
  });

  function onSubmit(values: ConsultationFormValues) {
    if (!values.time || !values.date || !values.consultationFeeId) {
      return;
    }

    // const selectedRate = rates.find(
    //   (r: any) =>
    //     String(r.id || r._id || r.consultType) === values.consultationFeeId
    // );

    // FIX: More robust finding logic
    const selectedRate = rates.find((r: any) => {
      const idMatch = String(r.id || r._id) === values.consultationFeeId;
      const typeMatch = r.consultType === values.consultationFeeId;
      return idMatch || typeMatch;
    });

    if (!selectedRate) {
      return;
    }

    const [hours, minutes] = values.time.split(":");
    const consultDate = new Date(values.date);
    consultDate.setHours(parseInt(hours), parseInt(minutes));

    const anyRate = selectedRate as any;
    const finalPayload = {
      ...values,
      consultAt: consultDate.toISOString(),
      feeDetails: {
        id: anyRate.id || anyRate._id,
        consultType: anyRate.consultType,
        duration: anyRate.duration,
        rate: anyRate.rate
      }
    };

    setFormData(finalPayload);
    setStep("summary");
  }

  const handleCancel = () => {
    form.reset();
    onClose?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* Consultation FeeId */}
        <CustomSelectField
          control={form.control}
          name="consultationFeeId"
          label="ConsultationFeeId"
          placeholder={
            isLoading
              ? "Fetching available fees..."
              : consultationOptions.length === 0
                ? "No consultation fees"
                : "Select type"
          }
          options={consultationOptions}
          disabled={isLoading || consultationOptions.length === 0}
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="date"
            label="Date"
            type="date"
            placeholder="Pick a date"
          />

          <CustomFormField
            control={form.control}
            name="time"
            label="Choose Time"
            type="time"
            placeholder="Choose Time"
          />
        </div>

        <CustomFormField
          control={form.control}
          name="note"
          label="Reason for Consultation"
          placeholder="Briefly explain..."
          type="textarea"
          rows={3}
        />

        {/* Integrated FileUpload */}
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FileUpload
                id="consultation-doc"
                label="Supporting Document (Optional)"
                fileData={field.value || null}
                onFileChange={(data) => field.onChange(data)}
                maxSize={5}
                accept=".pdf,image/*"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {/* <Button type="submit" className="bg-[#6f42c1] hover:bg-[#5a369e]">
            Proceed to Pay
          </Button> */}
          <Button
            type="submit"
            className="bg-[#6f42c1] hover:bg-[#5a369e]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Processing..." : "Proceed to Pay"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
