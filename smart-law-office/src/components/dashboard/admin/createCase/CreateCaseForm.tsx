"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCaseStore } from "@/store/createCase";
import { createCaseSchema } from "@/types/case.schema";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import * as React from "react";
import { Plus } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { useAuthStore } from "@/store/authStore";
import { useBillingStore } from "@/store/setRateBill";

interface CreateCaseFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CreateCaseForm = ({ onSuccess, onClose }: CreateCaseFormProps) => {
  const { executeCreate, error, fetchCaseTypes, caseTypes, isLoading } =
    useCaseStore();
  const { feeSchedules, fetchBillingInitialData } = useBillingStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    // Ensure we have the latest rates/schedules
    fetchBillingInitialData();
  }, [fetchBillingInitialData]);

  React.useEffect(() => {
    fetchCaseTypes();
  }, [fetchCaseTypes]);

  const caseTypeOptions = React.useMemo(() => {
    return feeSchedules.flatMap((item: any) =>
      (item.caseTypes || []).map((ct: any) => ({
        label: `${item.name} (₦${item.rateMin.toLocaleString()})`,
        value: ct.caseTypeId // This is the ID the backend needs to create a case
      }))
    );
  }, [feeSchedules]);

  const statusOptions = [
    { label: "Discovery", value: "Discovery" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" }
  ];

  // Check if user is admin or staff
  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";

  const form = useForm<createCaseSchema>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      clientEmail: "",
      caseTypeId: "",
      staffEmail: "",
      lastAdjournedDate: "",
      nextAdjournedDate: "",
      notes: "",
      file: "",
      // Keep legacy fields for schema compatibility but won't be used
      title: "",
      date: "",
      time: "",
      consultId: "",
      status: "Discovery"
    }
  });

  const onSubmit = async (values: createCaseSchema) => {
    const success = await executeCreate(values, user?.role || "USER");

    if (success) {
      onSuccess();
      onClose();
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )} */}

        {/* Shared Fields */}
        <CustomFormField
          control={form.control}
          name="clientEmail"
          label="Client Email"
          placeholder="client@example.com"
        />

        <CustomSelectField
          // key={caseTypeOptions.length}
          control={form.control}
          name="caseTypeId"
          label="Case Type"
          placeholder={isLoading ? "Loading..." : "Select type"}
          options={caseTypeOptions}
          className="w-full"
          onChange={(val: string) => {
            console.log("Selected ID:", val);
            form.setValue("caseTypeId", val);
          }}
        />

        <CustomSelectField
          control={form.control}
          name="status"
          label="Case Status"
          placeholder="Select status"
          options={statusOptions} // Use the status array here
          className="w-full"
        />

        {/* Admin Form - Includes staffEmail assignment */}
        {isAdmin && (
          <div className="space-y-4">
            <CustomFormField
              control={form.control}
              name="staffEmail"
              label="Assign Staff Email"
              placeholder="staff@firm.com"
            />
          </div>
        )}

        {/* Shared Date Fields */}
        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="lastAdjournedDate"
            label="Last Adjourned Date"
            type="date"
            placeholder="Pick a date"
          />

          <CustomFormField
            control={form.control}
            name="nextAdjournedDate"
            label="Next Adjourned Date"
            type="date"
            placeholder="Pick a date"
          />
        </div>

        {/* Document Section - Available for both roles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Document</label>
            <Plus className="h-4 w-4 cursor-pointer text-gray-500" />
          </div>
          <FileUpload
            id="case-doc-upload"
            label=""
            fileData={form.watch("file") || null}
            onFileChange={(data) => form.setValue("file", data || "")}
            maxSize={10}
            accept=".pdf,.docx,.jpg"
          />
        </div>

        {/* Notes Section - Available for both roles */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Notes</label>
          <textarea
            {...form.register("notes")}
            className="w-full min-h-[100px] p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            placeholder="Enter consultation notes"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 rounded-md text-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 px-8 rounded-md"
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
