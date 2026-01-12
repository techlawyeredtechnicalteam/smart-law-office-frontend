"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, DocumentFormValues } from "@/types/document.schema";
import { useDocumentStore } from "@/store/documentStore";
import { caseDocument } from "@/app/api/document.api";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { toast } from "sonner";
import FileUpload from "@/components/shared/FileUpload";
import { Form } from "@/components/ui/form";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import React from "react";
import { getCaseById } from "@/app/api/cases.api";
import { getAdminCaseTypes } from "@/app/api/caseType.api";

const STATUS_OPTIONS = [
  { label: "Discovery", value: "Discovery" },
  { label: "Contract", value: "Contract" },
  { label: "Pleading", value: "Pleading" }
];

export function AddDocumentModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addDocument,
    setIsSuccessModalOpen,
    caseTypes,
    setCaseTypes
  } = useDocumentStore();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      caseType: "",
      status: "Discovery",
      date: "",
      time: "",
      file: ""
    }
  });

  // fetch case types on mount
  React.useEffect(() => {
    const fetchCaseTypes = async () => {
      try {
        const response = await getAdminCaseTypes();
        setCaseTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch case types");
      }
    };
    if (isAddModalOpen) fetchCaseTypes();
  }, [isAddModalOpen, setCaseTypes]);

  const onSubmit = async (values: DocumentFormValues) => {
    try {
      // 1. Prepare data for /case-types
      const payload = {
        caseId: values.caseType,
        document: values.file,
        name: values.name,
        status: values.status,
        date: values.date
      };
      // 2. Execute POST request
      const response = await caseDocument(payload);

      if (response.status === 200 || response.status === 201) {
        // 3. Update UI Store
        addDocument({
          caseDocumentId: response.data.id || Date.now().toString(),
          name: values.name,
          caseName:
            caseTypes.find((t) => t.id === values.caseType)?.name ||
            values.caseType,
          status: values.status as any,
          date: values.date,
          time: values.time
        });

        setIsAddModalOpen(false); // Close addNewDocumentFill.png
        setIsSuccessModalOpen(true); // Open documentUploaded.png
        form.reset();
      }
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Could not upload document");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          control={form.control}
          name="name"
          label="Document Name"
          placeholder="E.g. Engagement Letter"
        />

        <div className="space-y-2">
          <CustomSelectField
            control={form.control}
            name="caseType"
            label="Type of Case"
            placeholder="Select a Case"
            // options={caseTypes.map((type) => ({
            //   label: type.name,
            //   value: type.id
            // }))}
            options={[
              { label: "Arbitration", value: "Arbitration" },
              { label: "Contract", value: "Contract" },
              { label: "Criminal", value: "Criminal" }
            ]}
            className="w-full"
          />
          <CustomSelectField
            control={form.control}
            name="status"
            label="Status"
            placeholder="Select Status"
            className="w-full"
            options={STATUS_OPTIONS}
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={form.control}
              name="date"
              label="Date"
              type="date"
              placeholder="pick a date"
            />
            <CustomFormField
              control={form.control}
              name="time"
              label="Time"
              type="time"
              placeholder="00:00"
            />
          </div>

          <div className="space-y-2">
            <FileUpload
              id="file-upload"
              label="Document"
              fileData={form.watch("file")}
              onFileChange={(data) => form.setValue("file", data || "")}
            />
            {form.formState.errors.file && (
              <p className="text-sm text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700 px-2">
            {/* Add */}
            {form.formState.isSubmitting ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

{
  /* <CreateModal
  modalTitle="Add New Document"
  triggerText="Upload document"
  isOpen={isAddModalOpen}
  onOpenChange={setIsAddModalOpen}
></CreateModal>; */
}
