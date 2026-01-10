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

interface CreateCaseFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CreateCaseForm = ({ onSuccess, onClose }: CreateCaseFormProps) => {
  const { createCase, isLoading, error, fetchCaseTypes, caseTypes } =
    useCaseStore();
  const { user } = useAuthStore();

  // const createCase = useCaseStore((state) => state.createCase);
  // const isLoading = useCaseStore((state) => state.isLoading);
  // const error = useCaseStore((state) => state.error);
  // const { fetchCaseTypes, caseTypes } = useCaseStore();

  React.useEffect(() => {
    fetchCaseTypes();
  }, [fetchCaseTypes]);

  const caseTypeOptions = caseTypes.map((type) => ({
    label: type.name,
    value: type.id
  }));

  const form = useForm<createCaseSchema>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: "",
      caseTypeId: "",
      consultId: "",
      date: "",
      time: "",
      lastAdjournedDate: "",
      nextAdjournedDate: "",
      status: "Discovery",
      notes: "",
      file: "",
      clientEmail: "",
      staffEmail: user?.email
    }
  });

  async function onSubmit(values: createCaseSchema) {
    console.log("Submitting to store:", values);
    const success = await createCase({
      ...values,
      title: values.title,
      consultId: "default-id",
      clientEmail: values.clientEmail,
      staffEmail: values.staffEmail
    });

    if (success) {
      onSuccess();
      onClose();
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 2-Column Grid for Inputs */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <CustomFormField
            control={form.control}
            name="title"
            label="Case Title"
            placeholder="Enter Case Title"
          />

          <CustomFormField
            control={form.control}
            name="clientEmail"
            label="Client Email"
            placeholder="client@example.com"
          />

          <CustomFormField
            control={form.control}
            name="staffEmail"
            label="Assigned Staff Email"
            placeholder="staff@firm.com"
            readOnly={true}
            className="bg-gray-100 cursor-not-allowed"
          />

          <CustomSelectField
            control={form.control}
            name="caseTypeId"
            label="Type of Case"
            placeholder="Select case type"
            // options={caseTypeOptions}
            options={[
              { label: "Arbitration", value: "Arbitration" },
              { label: "Contract", value: "Contract" },
              { label: "Criminal", value: "Criminal" }
            ]}
          />

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
            label="Time"
            type="time"
            placeholder="Pick a time"
          />

          <CustomFormField
            control={form.control}
            name="lastAdjournedDate"
            label="Last adjourned date"
            type="date"
            placeholder="Pick a lastAdjournedDate"
          />

          <CustomFormField
            control={form.control}
            name="nextAdjournedDate"
            label="Next adjourned date"
            type="date"
            placeholder="Pick a nextAdjournedDate"
          />

          <div className="col-span-2">
            <CustomSelectField
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={[
                { label: "Discovery", value: "Discovery" },
                { label: "Pleading", value: "Pleading" },
                { label: "Contract", value: "Contract" }
              ]}
            />
          </div>
        </div>

        {/* Document Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Document</label>
            <Plus className="h-4 w-4 cursor-pointer text-gray-500" />
          </div>
          <FileUpload
            id="case-doc-upload"
            label="" // Label handled by the row above
            fileData={form.watch("file") || null}
            onFileChange={(data) => form.setValue("file", data || "")}
            maxSize={10}
            accept=".pdf,.docx,.jpg"
          />
        </div>

        {/* Notes Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Notes</label>
          <textarea
            {...form.register("notes")}
            className="w-full min-h-[100px] p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            placeholder="Enter consultation notes"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
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
