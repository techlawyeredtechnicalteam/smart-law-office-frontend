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
import { Loader2, Plus } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { useAuthStore } from "@/store/authStore";
import { useBillingStore } from "@/store/setRateBill";
import { useAssignStore } from "@/store/assignCaseStore";

interface CreateCaseFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CreateCaseForm = ({ onSuccess, onClose }: CreateCaseFormProps) => {
  const { executeCreate, isLoading: isCreating } = useCaseStore();
  const { rates, fetchBillingInitialData } = useBillingStore();
  const {
    fetchUnassigned,
    counsels,
    clients,
    isLoading: isFetchingData
  } = useAssignStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  React.useEffect(() => {
    fetchBillingInitialData();
    fetchUnassigned();
  }, []);

  const caseTypeOptions = React.useMemo(() => {
    // Use optional chaining or fallback to empty array
    return (rates || [])
      .filter((r) => r.serviceType === "Case")
      .map((rate: any) => ({
        label: `${rate.subServiceType} (₦${rate.caseRate?.toLocaleString()})`,
        value: String((rate as any).caseTypeId || (rate as any).caseTypeId)
      }));
  }, [rates]);

  // Map staff Lawyers
  const staffOptions = React.useMemo(() => {
    return counsels.map((c, index) => ({
      label: `${c.name} (${c.email})`,
      value: c.email || `missing-email-${c.id || index}`
    }));
  }, [counsels]);

  // map clients
  const clientOptions = React.useMemo(
    () =>
      (clients || []).map((c) => ({
        label: `${c.firstName} ${c.lastName} (${c.email})`,
        value: c.email
      })),
    [clients]
  );

  const statusOptions = [
    { label: "Scheduled", value: "Scheduled" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" }
  ];

  const form = useForm<createCaseSchema>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      clientEmail: "",
      caseTypeId: "",
      staffEmail: !isAdmin ? user?.email || "" : "",
      lastAdjournedDate: "",
      nextAdjournedDate: "",
      notes: "",
      document: "",
      title: "",
      status: "Scheduled"
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
        {/* Shared Fields */}
        {/* <CustomSelectField
          control={form.control}
          name="clientEmail"
          label="Select Client"
          placeholder="Select a Client"
          options={clientOptions}
          disabled={isFetchingData}
        />

        <CustomSelectField
          control={form.control}
          name="caseTypeId"
          label="Case Type"
          placeholder="Select Case Type"
          options={caseTypeOptions}
          className="w-full"
        />

        <CustomSelectField
          control={form.control}
          name="status"
          label="Case Status"
          placeholder="Select status"
          options={statusOptions} // Use the status array here
          className="w-full"
        /> */}
        {/* CLIENT FIELD: Conditional based on Role */}
        {isAdmin ? (
          <CustomSelectField
            control={form.control}
            name="clientEmail"
            label="Select Client"
            placeholder="Select a Client"
            options={clientOptions}
            disabled={isFetchingData}
          />
        ) : (
          <CustomFormField
            control={form.control}
            name="clientEmail"
            label="Client Email"
            placeholder="enter.client@email.com"
            type="email"
          />
        )}

        <CustomSelectField
          control={form.control}
          name="caseTypeId"
          label="Case Type"
          placeholder="Select Case Type"
          options={caseTypeOptions}
          className="w-full"
        />

        {/* Admin Form - Includes staffEmail assignment */}
        {isAdmin && (
          <div className="space-y-4">
            <CustomSelectField
              control={form.control}
              name="staffEmail"
              label="Assign Counsel"
              placeholder="Select Counsel"
              options={staffOptions}
              disabled={isFetchingData}
            />
          </div>
        )}

        {/* Staff UI Hint: Show they are self-assigning */}
        {!isAdmin && (
          <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
            <p className="text-xs text-violet-700 flex items-center">
              <span className="font-semibold mr-1">Note:</span> This case will
              be automatically assigned to you.
            </p>
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
            fileData={form.watch("document") || null}
            onFileChange={(data) => form.setValue("document", data || "")}
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
            className="bg-violet-600 hover:bg-violet-700 px-8"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Case"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCaseForm;
