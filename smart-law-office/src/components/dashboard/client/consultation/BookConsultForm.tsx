"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currentDate, currentTime } from "@/utils/time-date";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  consultationFormSchema,
  ConsultationFormValues
} from "@/types/Consultation.schema";
import useConsultationStore from "@/store/consultationStore";

// Custom Components
import { CustomFormField } from "@/components/shared/CustomFormField";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "date-fns";

// Mock Data for pre-fill
const MOCK_CLIENT_NAME = "Christine Adeola";
const MOCK_EMAIL = "christineadeola@gmail.com";
const MOCK_FEE = 30000; // Naira (₦)

interface BookConsultationFormProps {
  onClose?: () => void;
}

export function BookConsultationForm({ onClose }: BookConsultationFormProps) {
  const { setFormData, setStep } = useConsultationStore();

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      clientName: MOCK_CLIENT_NAME,
      email: MOCK_EMAIL,
      consultationFee: MOCK_FEE,
      date: new Date(),
      time: "10:00",
      notes: "Initial consultation notes for the client."
    },
    mode: "onChange"
  });

  function onSubmit(values: ConsultationFormValues) {
    setFormData(values);
    setStep("summary");
    // onClose?.();
  }

  const handleCancel = () => {
    form.reset();
    onClose?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* Client Name - Using CustomFormField */}
        <CustomFormField
          control={form.control}
          name="clientName"
          label="Client Name"
          placeholder="Enter Client Name"
          type="text"
        />

        {/* Email - Using CustomFormField */}
        <CustomFormField
          control={form.control}
          name="email"
          label="Email Address"
          placeholder="E.g. christineadeola@gmail.com"
          type="email"
          autoComplete="email"
        />

        {/* Consultation Fee - Using CustomFormField */}
        <CustomFormField
          control={form.control}
          name="consultationFee"
          label="Consultation fee"
          placeholder="30,000"
          type="number"
          readOnly
          className="bg-gray-50 border-gray-300"
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal py-3 h-auto",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>dd/mm/yy</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2026-12-31")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time - Using CustomFormField */}
          <CustomFormField
            control={form.control}
            name="time"
            label="Time"
            placeholder="--:-- PM"
            type="time"
          />
        </div>

        {/* Notes - Using CustomFormField with textarea */}
        <CustomFormField
          control={form.control}
          name="notes"
          label="Notes"
          placeholder="E.g. contract review inquiry, initial case discussion..."
          type="textarea"
          rows={4}
        />

        {/* Footer Display */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6f42c1] hover:bg-[#5a369e]">
            Proceed to Pay
          </Button>
        </div>
      </form>
    </Form>
  );
}
