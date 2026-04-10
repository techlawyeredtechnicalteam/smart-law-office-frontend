"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCaseStore, Case } from "@/store/createCase";
import { createCaseSchema } from "@/types/case.schema";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { Loader2, Plus } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { useAuthStore } from "@/store/authStore";
import { useBillingStore } from "@/store/setRateBill";
import { useAssignStore } from "@/store/assignCaseStore";

interface CaseFormProps {
  caseData?: Case | null; // If provided, we are in EDIT mode
  onSuccess: () => void;
  onClose: () => void;
}

const CaseForm = ({ caseData, onSuccess, onClose }: CaseFormProps) => {
  const isEditMode = !!caseData;
  const { executeCreate, executeUpdate, isLoading } = useCaseStore();
  const { rates, fetchBillingInitialData } = useBillingStore();
  const {
    fetchUnassigned,
    counsels,
    isLoading: isFetchingData
  } = useAssignStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  React.useEffect(() => {
    fetchBillingInitialData();
    fetchUnassigned();
  }, []);

  const caseTypeOptions = React.useMemo(() => {
    return (rates || [])
      .filter((r) => r.serviceType === "Case")
      .map((rate: any) => ({
        label: `${rate.subServiceType} (₦${rate.caseRate?.toLocaleString()})`,
        value: String(rate.caseTypeId || rate.id)
      }));
  }, [rates]);

  const staffOptions = React.useMemo(() => {
    return counsels.map((c, index) => ({
      label: `${c.name} (${c.email})`,
      value: c.email || `missing-email-${c.id || index}`
    }));
  }, [counsels]);

  const statusOptions = [
    { label: "Scheduled", value: "Scheduled" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" }
  ];

  const form = useForm({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      clientEmail: caseData?.clientEmail || "",
      clientName: caseData?.clientName || "",
      caseTypeId: caseData?.caseTypeId || "",
      staffEmail: caseData?.staffEmail || (!isAdmin ? user?.email || "" : ""),
      lastAdjournedDate: caseData?.lastAdjournedAt?.split("T")[0] || "",
      nextAdjournedDate: caseData?.nextAdjournedAt?.split("T")[0] || "",
      notes: caseData?.notes === "No notes added" ? "" : caseData?.notes || "",
      document: caseData?.documents?.[0]?.url || "",
      documentName:"",
      title: caseData?.title || "",
      status: caseData?.status || "Scheduled"
    }
  });

  const onSubmit = async (values: any) => {
    let success = false;
    if (isEditMode && caseData) {
      success = await executeUpdate(caseData.id, values);
    } else {
      success = await executeCreate(values, user?.role || "USER");
    }

    if (success) {
      onSuccess();
      onClose();
      if (!isEditMode) form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="clientName"
            label="Client Name"
            placeholder="Full Name"
          />
          <CustomFormField
            control={form.control}
            name="clientEmail"
            label="Client Email"
            placeholder="Client Email"
            type="email"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CustomSelectField
            control={form.control}
            name="caseTypeId"
            label="Case Type"
            placeholder="Case Type"
            options={caseTypeOptions}
          />
          <CustomSelectField
            control={form.control}
            name="status"
            label="Status"
            placeholder="Status"
            options={statusOptions}
          />
        </div>

        {isAdmin && (
          <CustomSelectField
            control={form.control}
            name="staffEmail"
            label="Assign Counsel"
            placeholder="Assign Counsel"
            options={staffOptions}
            disabled={isFetchingData}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="lastAdjournedDate"
            label="Last Adjourned"
            placeholder="Last Adjourned Date"
            type="date"
          />
          <CustomFormField
            control={form.control}
            name="nextAdjournedDate"
            label="Next Adjourned"
            placeholder="Next Adjourned Date"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Document</label>
          <FileUpload
            id="case-doc-upload"
            label="Case document Upload"
            fileData={form.watch("document") || null}
            onFileChange={(data,name) => {
              form.setValue("document", data || "")
              form.setValue("documentName", name || "")
            }}
            maxSize={10}
            accept=".pdf,.docx,.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Notes</label>
          <textarea
            {...form.register("notes")}
            className="w-full min-h-20 p-3 border rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
            placeholder="Enter case notes..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              "Update Case"
            ) : (
              "Create Case"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CaseForm;
