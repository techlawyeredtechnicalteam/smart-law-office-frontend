"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, DocumentFormValues } from "@/types/document.schema";
import { useDocumentStore } from "@/store/documentStore";
import { useCaseStore } from "@/store/createCase";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { CustomFormField } from "@/components/shared/CustomFormField";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export function AddDocumentModal() {
  const { setIsAddModalOpen, setIsSuccessModalOpen, isAddModalOpen } =
    useDocumentStore();
  const { cases, fetchCases, uploadDocumentToCase, isLoading } = useCaseStore();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      caseType: "", // This is our caseId
      status: "Discovery",
      file: ""
    }
  });

  const activeCaseOptions = React.useMemo(() => {
    // Filter out any cases that somehow don't have an ID to prevent 404s
    return (cases || [])
      .filter((c) => c.id)
      .map((c) => ({
        label: `${c.caseCode || "CASE"} - ${c.clientName}`,
        value: c.id
      }));
  }, [cases]);

  React.useEffect(() => {
    if (isAddModalOpen) fetchCases();
  }, [isAddModalOpen, fetchCases]);

  const onSubmit = async (values: DocumentFormValues) => {
    // Directly use the store action that matches your payload {caseId, document}
    const success = await uploadDocumentToCase(
      values.caseType, // The UUID from the dropdown
      values.name,
      values.file // Base64 string
    );

    if (success) {
      setIsAddModalOpen(false);
      setIsSuccessModalOpen(true);
      form.reset();
      toast.success("Document attached to case.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* If no cases are found, show a warning */}
        {activeCaseOptions.length === 0 && !isLoading && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-amber-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>
              No active cases assigned to your account. You cannot upload
              documents until a case is assigned.
            </p>
          </div>
        )}

        <CustomSelectField
          control={form.control}
          name="caseType"
          label="Assigned Case"
          placeholder={
            isLoading ? "Fetching cases..." : "Select the target case"
          }
          options={activeCaseOptions}
          disabled={isLoading || activeCaseOptions.length === 0}
        />

        <CustomFormField
          control={form.control}
          name="name"
          label="Document Title"
          placeholder="e.g. Final Judgment"
        />

        <FileUpload
          id="staff-upload"
          label="Upload Document"
          fileData={form.watch("file")}
          onFileChange={(val) => form.setValue("file", val || "")}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-violet-600"
            disabled={
              form.formState.isSubmitting || activeCaseOptions.length === 0
            }
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Upload Document"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
