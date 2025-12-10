"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/shared/ui/select";
import { Textarea } from "@/components/shared/ui/textarea";
import { CalendarIcon, ClockIcon, Trash2 } from "lucide-react";

import { useCaseStore, CreateCasePayload } from "@/store/createCase";
import { createCaseSchema } from "@/lib/case.schema";

// Props definition to handle closing and success state
interface CreateCaseFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

// Mock Case Types for the dropdown
const caseTypes = [
  "Real Estate",
  "Family Law",
  "Property Law",
  "Criminal Defense"
];

const CreateCaseForm = ({ onSuccess, onClose }: CreateCaseFormProps) => {
  const createCase = useCaseStore((state) => state.createCase);
  const isLoading = useCaseStore((state) => state.isLoading);

  // 1. Initialize the form with Zod validation
  const form = useForm<createCaseSchema>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      clientName: "",
      caseType: "",
      date: "09/11/2025", // Mocking the filled state from createcase4.png
      time: "11:00 PM",
      status: "Scheduled",
      lastAdjournedDate: "30/11/2025",
      nextAdjournedDate: "11/11/2025",
      notes: "Case ID - 2025-0012 is due in three days. Kindly treat as urgent."
    }
  });

  // 2. Handle form submission
  async function onSubmit(values: createCaseSchema) {
    // Convert form values to the API payload type
    const payload: CreateCasePayload = {
      clientName: values.clientName,
      caseType: values.caseType,
      date: values.date,
      time: values.time,
      status: values.status,
      lastAdjournedDate: values.lastAdjournedDate || undefined,
      nextAdjournedDate: values.nextAdjournedDate || undefined,
      notes: values.notes
    };

    const newCase = await createCase(payload);

    // 3. If the case was created successfully, trigger success and close
    if (newCase) {
      onSuccess(); // Shows the success modal (createcase5.png)
      onClose(); // Closes the current form dialog
      form.reset();
    }
    // Error state is handled by the store
  }

  // NOTE: Document upload logic (for "Payment_receipt.pdf") is complex and omitted for brevity.
  // It would typically involve an `onChange` handler, uploading the file to a server endpoint,
  // and getting back a temporary URL/ID before submitting the main case form.

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Client Name */}
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type of Case */}
          <FormField
            control={form.control}
            name="caseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Case</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {caseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <div className="relative">
                  <Input placeholder="dd/mm/yy" className="pr-10" {...field} />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <div className="relative">
                  <Input
                    placeholder="HH:MM PM/AM"
                    className="pr-10"
                    {...field}
                  />
                  <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Adjourned Date */}
          <FormField
            control={form.control}
            name="lastAdjournedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last adjourned date</FormLabel>
                <div className="relative">
                  <Input placeholder="dd/mm/yy" className="pr-10" {...field} />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Next Adjourned Date */}
          <FormField
            control={form.control}
            name="nextAdjournedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next adjourned date</FormLabel>
                <div className="relative">
                  <Input placeholder="dd/mm/yy" className="pr-10" {...field} />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status Dropdown */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Section (Static UI replication) */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <FormLabel>Document</FormLabel>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-sm text-gray-500 hover:text-gray-700"
            >
              +
            </Button>
          </div>

          {/* Replicate the uploaded file display (createcase4.png) */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-purple-600">
                {/* Placeholder for Document Icon */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v4h5v12zM9 13h6v2H9v-2zM9 17h6v2H9v-2z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium">Payment_receipt.pdf</p>
                <p className="text-xs text-gray-500">128 KB</p>
              </div>
            </div>
            <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter consultation notes"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date/Time Stamp at bottom of form (Static replication) */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Monday, 9th November 2025</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4" />
            <span>10:00 AM</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Case"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCaseForm;
